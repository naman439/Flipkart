const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('⚠️ Supabase credentials not fully configured in .env. Auth will fail.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
