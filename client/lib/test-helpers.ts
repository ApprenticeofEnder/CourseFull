import { BasicUserData, Product, User } from '@coursefull';
import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
import { Client, connect } from 'ts-postgres';
import { NIL as nilUUID } from 'uuid';

export const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.SUPABASE_SERVICE_KEY || '',
    {
        auth: {
            storageKey: 'sb-coursefull-auth-token',
        },
    }
);

export const TEST_ACCOUNT_EMAIL = 'test@test.com';
export const LOGIN_TEST_EMAIL = 'logintest@test.com';

export async function dbConnect(): Promise<Client> {
    return connect({
        user: 'postgres',
        password: 'postgres',
        database: 'test',
    });
}

export const createUserData = (
    data?: Partial<BasicUserData>
): BasicUserData => ({
    first_name: data?.first_name || faker.person.firstName(),
    last_name: data?.last_name || faker.person.lastName(),
    email: data?.email || faker.internet.email(),
    password: 'Password1!',
});

export const createValidFields = ({
    first_name,
    last_name,
    email,
    password,
}: BasicUserData): Record<string, string> => ({
    'First Name': first_name,
    'Last Name': last_name,
    Email: email,
    Password: password,
});

export async function createRegisteredUser(
    dbClient: Client,
    { email, first_name, last_name }: Partial<BasicUserData>
) {
    const userData = createUserData({ email, first_name, last_name });

    userData.email = email || userData.email;

    let supabaseResponse = await supabaseServiceRole.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
            first_name: userData.first_name,
            last_name: userData.last_name,
        },
        email_confirm: true,
    });

    if (supabaseResponse.error) {
        console.error(supabaseResponse.error.message);
        return null;
    }

    let date = new Date();
    let iso_date = date.toISOString();

    const { data, error } = await supabaseServiceRole
        .from('api_v1_users')
        .insert({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            supabase_id: supabaseResponse.data.user.id,
            courses_remaining: 3,
            created_at: iso_date,
            updated_at: iso_date,
        })
        .select();

    if (error) {
        console.info('Supabase error encountered during API user creation.');
        console.error(error.message);
        return null;
    }

    // This is to counteract the "Populate" script potentially duplicating users in Supabase
    if (process.env.NODE_ENV === 'test') {
        await dbClient.query(
            `INSERT INTO api_v1_users (first_name, last_name, email, supabase_id, courses_remaining, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                userData.first_name,
                userData.last_name,
                userData.email,
                supabaseResponse.data.user.id,
                3,
            ]
        );
    }

    const newUser: User = data?.shift();

    return { courseFullUser: newUser, password: userData.password };
}

export async function loadProducts(dbClient: Client) {
    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const { data, error } = await supabaseServiceRole
        .from('api_v1_products')
        .select();

    if (error) {
        throw new Error(error.message);
    }

    const products = data.map<Product>((product) => {
        const { id, created_at, updated_at, ...productData } = product;
        return productData;
    });

    (async () => {
        const insertProductStatement = await dbClient.prepare(
            'INSERT INTO api_v1_products (stripe_id, stripe_price, name, description, price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
        );
        for (let product of products) {
            await insertProductStatement.execute([
                product.stripe_id,
                product.stripe_price,
                product.name,
                product.description,
                product.price,
            ]);
        }
        await insertProductStatement.close();
    })();
}

export async function deleteData(dbClient: Client) {
    const users = (await supabaseServiceRole.auth.admin.listUsers()).data.users;

    for (let user of users) {
        const { error, data } = await supabaseServiceRole.auth.admin.deleteUser(
            user.id
        );
        if (error) {
            throw new Error(error.message);
        }
    }

    const apiUsersRes = await supabaseServiceRole.from('api_v1_users').select();

    if (apiUsersRes.error) {
        throw apiUsersRes.error;
    }

    const tables = [
        'api_v1_deliverables',
        'api_v1_courses',
        'api_v1_semesters',
        'api_v1_users',
    ];

    for (let table of tables) {
        const apiDeleteRes = await supabaseServiceRole
            .from(table)
            .delete()
            .neq('id', nilUUID)
            .select();
        if (apiDeleteRes.error) {
            throw apiDeleteRes.error;
        }
        //Yes this is an SQL injection technically, no it doesn't have any user-controlled input.
        await dbClient.query(`DELETE FROM ${table}`);
    }

    console.assert(
        (await supabaseServiceRole.auth.admin.listUsers()).data.users.length ===
            0,
        'Supabase Auth users table not empty.'
    );

    const numSupabaseUsers = (
        await supabaseServiceRole.from('api_v1_users').select()
    ).data?.length;

    console.assert(
        numSupabaseUsers === 0,
        'Supabase DB users table not empty, length %s.',
        numSupabaseUsers
    );

    for (let table of tables) {
        //See above.
        console.assert(
            (await dbClient.query(`SELECT * FROM ${table}`)).rows.length === 0,
            'Test DB table %s not empty.',
            table
        );
    }
}
