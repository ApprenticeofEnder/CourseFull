import { test as teardown } from '@playwright/test';
import { supabaseServiceRole } from './conftest';

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
});
