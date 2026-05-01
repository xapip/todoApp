import { createBrowserClient as createClient } from "@supabase/ssr"
import { Database } from "@db-types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createBrowserClient = () =>
  createClient<Database>(supabaseUrl!, supabaseKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
