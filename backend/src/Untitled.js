import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://fvmqcytrdygwitaqoutl.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bXFjeXRyZHlnd2l0YXFvdXRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTAzMTE2MSwiZXhwIjoyMDgwNjA3MTYxfQ.kJcwu61jr4SWsK7eMNBUJLR6ncfFgG3o-nl20GwgQKA"
)

const { error, data } = await supabase
  .from('users')
  .select('*')
  .limit(1)

if (error?.code === '42P01') {
  console.log('Table does NOT exist')
} else if (error) {
  console.error('Other error:', error)
} else {
  console.log('Table exists')
  console.log(data)
}
