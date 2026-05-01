import crypto from "crypto"
import { NextResponse } from "next/server"

import { createServerClient } from "@src/lib/supabase/server"
import { getTmaData } from "@src/lib/telegram/getTmaData"

export async function POST(req: Request) {
  const authDataObject = await getTmaData(req.headers)
  if (!authDataObject || !authDataObject.user?.id) {
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
      .select("tg_id")
      .eq("tg_id", authDataObject.user?.id)

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

    const startParam = authDataObject.start_param
    if (startParam && startParam?.startsWith("invite_")) {
      const token = startParam.replace("invite_", "")
      const { error } = await supabaseClient.rpc("accept_invite", {
        invite_token: token,
      })
      if (error) {
        console.log("Ошибка добавления пользователя к списку:", error)
      }
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
        tg_id: authDataObject.user.id,
        user_name: authDataObject.user.username,
        first_name: authDataObject.user.first_name,
        last_name: authDataObject.user.last_name,
      },
      { onConflict: "tg_id" }
    )
    .select("*")

  return NextResponse.json(user.data)
}
