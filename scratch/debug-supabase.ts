import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Connecting to:", supabaseUrl)
  
  // Test connection
  const { data: guests, error: tableError } = await supabase
    .from("buku_tamu")
    .select("*")

  if (tableError) {
    console.error("❌ Error connecting to buku_tamu:", tableError)
  } else {
    console.log("✅ Successfully connected! Row count:", guests?.length)
  }

  // Check auth
  const { data: { session }, error: authError } = await supabase.auth.getSession()
  console.log("Auth session:", session ? "Active" : "None (Anon)")
}

test()
