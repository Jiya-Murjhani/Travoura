import { supabase } from './src/supabaseClient';

async function checkSchema() {
  const { data, error } = await supabase.from('itineraries').select('*').limit(1);
  console.log('Sample row:', data);
  console.log('Error:', error);
  process.exit(0);
}

checkSchema();
