import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function testInsert() {
  console.log("Testing insert into buku_tamu...")
  
  const payload = {
    nama: "Test Debug",
    no_whatsapp: "08123456789",
    kategori: "donatur",
    keperluan: "Testing system connectivity",
    kantor_id: "00000000-0000-0000-0000-000000000000"
  }

  const { data, error } = await supabase
    .from("buku_tamu")
    .insert([payload])
    .select()

  if (error) {
    console.error("❌ Insert failed:", error)
  } else {
    console.log("✅ Insert successful:", data)
  }
}

testInsert()
