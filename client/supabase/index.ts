import { createClient } from '@supabase/supabase-js';

export { default as useSupabaseSession } from '@/supabase/useSupabaseSession';

export default createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
