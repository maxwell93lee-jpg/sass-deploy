import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env' });

async function test() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  console.log('Using URL:', supabaseUrl);
  console.log('Using Key:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'NONE');

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('users')
    .select('id, email, raw_user_meta_data, plan, customer_key, billing_key, next_billing_date')
    .not('billing_key', 'is', null)
    .lte('next_billing_date', new Date().toISOString());

  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('DATA:', data);
  }
}

test();
