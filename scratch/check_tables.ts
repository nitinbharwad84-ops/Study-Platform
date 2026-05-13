import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkTables() {
  const { data, error } = await supabase.rpc('get_tables'); // If a custom RPC exists, else try querying
  
  // Try querying common tables
  const tables = [
    'users', 'roles', 'approved_emails', 'password_reset_requests', 'audit_logs', 'subjects', 'mcq_questions', 'provider_configs'
  ];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`Table ${table}: ${error ? 'Missing (' + error.message + ')' : 'Exists'}`);
  }
}

checkTables();
