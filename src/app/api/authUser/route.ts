import crypto from "crypto"
import { NextResponse } from "next/server"

import { createServerClient } from "@lib/supabase/server"
import { getTmaData } from "@lib/telegram/getTmaData"

export async function POST(req: Request) {
    const authDataObject = await getTmaData(req.headers)
    if (!authDataObject) {
        throw new Error("No init data")
    }

    const authDate = new Date(authDataObject.auth_date.toString()).getTime()
    if (Date.now() / 1000 - authDate > 60) {
        throw new Error("Init data is too old")
    }

    const supabaseClient = await createServerClient()
    let user
    if (authDataObject.user?.id) {
        const secret = process.env.TG_AUTH_SECRET
        const email = `${authDataObject.user.id}@techemail.local`
        const password = crypto
            .createHash("sha256")
            .update(`${email}_${authDataObject.user.id}:${secret}`)
            .digest("hex")
            .slice(0, 32)

        const checkUserIsReg = await supabaseClient
            .from("users")
            .select("tgId")
            .eq("tgId", authDataObject.user?.id)

        if (
            checkUserIsReg &&
            checkUserIsReg.status === 200 &&
            checkUserIsReg.data &&
            checkUserIsReg.data.length > 0
        ) {
            user = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            })
        } else {
            user = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        custom_id: authDataObject.user.id,
                    },
                },
            })
        }
    }

    if (!user?.data) {
        console.error("createOrUpdateUser error", user?.error)
        return NextResponse.json(user?.error)
    }

    await supabaseClient
        .from("users")
        .upsert(
            {
                tgId: authDataObject.user?.id,
                userName: authDataObject.user?.username,
                firstName: authDataObject.user?.first_name,
                lastName: authDataObject.user?.last_name,
            },
            { onConflict: "tgId" }
        )
        .select("*")

    return NextResponse.json(user.data)
}
