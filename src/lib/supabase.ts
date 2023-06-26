import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://groflvqjrqgsvtnhexso.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyb2ZsdnFqcnFnc3Z0bmhleHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NzgwMjU5NCwiZXhwIjoyMDAzMzc4NTk0fQ.9lFN-S7rSvvFUHrWCojWQlFwp7E4bcDUnvcVAp5LKIo',
)
