import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function updatePlan(email) {
  // First login to get user id
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: 'Test123!'
  })
  
  if (error) {
    console.error(`Login failed for ${email}:`, error)
    return
  }

  // Actually we need service_role key to bypass RLS and update users table.
  // But wait, if RLS allows users to update their own table, we can do it.
  const { error: updateError } = await supabase
    .from('users')
    .update({ plan: 'pro' })
    .eq('id', data.user.id)
    
  if (updateError) {
    console.error(`Update failed for ${email} (Probably RLS):`, updateError)
  } else {
    console.log(`Success: Updated ${email} to pro.`)
  }
}

updatePlan('test2@test.com')
