import { createClient } from '@supabase/supabase-js';

async function test() {
  const supabaseUrl = 'https://knjisqnhsidnunixngfs.supabase.co';
  const supabaseKey = 'sb_publishable_otVtB5O77lgknhGx23HcMQ_iRNUf2Cc';

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('users')
    .select('id, email, plan, customer_key, billing_key, next_billing_date')
    .not('billing_key', 'is', null)
    .lte('next_billing_date', new Date().toISOString());

  if (error) {
    console.error('ERROR OBJECT:', JSON.stringify(error, null, 2));
  } else {
    console.log('DATA:', data);
  }
}

test();
