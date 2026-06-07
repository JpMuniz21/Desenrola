import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qavddyjminvytewbfqju.supabase.co/rest/v1/'
const supabaseKey = 'sb_publishable_Sg6mRNe2Ar9rJWCnCvitnQ_sR22Mt5n'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)