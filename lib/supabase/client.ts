import { createBrowserClient as createClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createBrowserClient = () =>
    createClient(supabaseUrl!, supabaseKey!, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    })
