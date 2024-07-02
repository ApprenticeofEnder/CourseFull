import { createClient } from '@supabase/supabase-js';
export async function clearData(email: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
    );

    const result = await supabase
        .from('api_v1_users')
        .select()
        .eq('email', email);

    const user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        supabase_id: string;
        courses_remaining: number;
        created_at: string;
        updated_at: string;
    } = result?.data?.at(0);

    supabase.from('api_v1_users').delete().eq('id', user.id);
    supabase.auth.admin.deleteUser(user.supabase_id);
}
