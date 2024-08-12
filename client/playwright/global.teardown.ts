import { test as teardown } from '@playwright/test';
import { connect, DataType } from 'ts-postgres';

import {
    createRegisteredUser,
    supabaseServiceRole,
    TEST_ACCOUNT_EMAIL,
} from './conftest';

teardown('delete database', async ({}) => {
    console.log('Cleaning up database.');
    const users = (await supabaseServiceRole.auth.admin.listUsers()).data.users;
    for (let user of users) {
        const authDeleteRes = await supabaseServiceRole.auth.admin.deleteUser(
            user.id
        );
        const apiDeleteRes = await supabaseServiceRole
            .from('api_v1_users')
            .delete()
            .ilike('email', user.email!);
    }

    const dbClient = await connect({
        user: 'postgres',
        password: 'postgres',
        database: 'test',
    });

    await dbClient.query(`DELETE FROM api_v1_deliverables`);
    await dbClient.query(`DELETE FROM api_v1_courses`);
    await dbClient.query(`DELETE FROM api_v1_semesters`);
    await dbClient.query(`DELETE FROM api_v1_users`);
    await dbClient.end();

    await createRegisteredUser({ email: TEST_ACCOUNT_EMAIL });
});
