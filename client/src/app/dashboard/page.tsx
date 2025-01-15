import { createClient } from "@/lib/supabase/server";
import { AuthEndpoints } from "@/types";
import { redirect } from "next/navigation";

export default async function Page(){
    const supabase = await createClient();

    const {data, error} = await supabase.auth.getUser();
    if(error || !data?.user){
        redirect(AuthEndpoints.LOGIN);
    }

    return <p>Hello {data.user.email}</p>
}