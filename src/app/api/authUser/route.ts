import { createClient } from "@lib/supabase/server"
import { getTmaData } from "@lib/telegram/getTmaData"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
    const authDataObject = await getTmaData(req.headers)
    if (!authDataObject) {
        throw new Error("No init data");
    }

    const authDate = new Date(authDataObject.auth_date.toString()).getTime()
    if (Date.now() / 1000 - authDate > 60) {
        throw new Error("Init data is too old");
    }

    const supabaseClient = await createClient()
    const createOrUpdateUser = await supabaseClient
        .from('users')
        .upsert(
            {
                tgId: authDataObject.user?.id,
                userName: authDataObject.user?.username,
                firstName: authDataObject.user?.first_name,
                lastName: authDataObject.user?.last_name,
            }
        )
        .select('*');
        
    if (!createOrUpdateUser.data) {
        console.error(createOrUpdateUser.error);
        return NextResponse.json(createOrUpdateUser.error)
    }
        
    return NextResponse.json(createOrUpdateUser.data)
}