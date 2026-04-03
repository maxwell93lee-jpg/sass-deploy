import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth(email, password) {
  console.log(`Testing ${email}...`)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error(`Error for ${email}:`, error.message)
    return
  }
  
  console.log(`Success for ${email}: User ID =`, data.user.id)
  
  // also get the plan
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('plan')
    .eq('id', data.user.id)
    .single()
    
  if (userError) {
    console.error(`Error fetching plan for ${email}:`, userError.message)
  } else {
    console.log(`Plan for ${email}:`, userData.plan)
  }
}

async function run() {
  await testAuth('test1@test.com', 'Test123!')
  await testAuth('test2@test.com', 'Test123!')
}

run()
