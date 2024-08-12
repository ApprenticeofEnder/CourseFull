import { test as teardown } from '@playwright/test';
import { connect, DataType } from 'ts-postgres';

import { supabaseServiceRole, TEST_ACCOUNT_EMAIL } from './conftest';

teardown('delete database', async ({}) => {
    console.log('Cleaning up database.');
    const users = (
        await supabaseServiceRole.auth.admin.listUsers()
    ).data.users.filter((user) => user.email !== TEST_ACCOUNT_EMAIL);
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

    await dbClient.query(`DELETE FROM api_v1_users WHERE email != $1`, [
        TEST_ACCOUNT_EMAIL,
    ]);
});
