import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zlkjsivnkciwqffoaizt.supabase.co"
const supabaseAnonKey = "sb_publishable_2LTe4udT9BhFSG7oed3j6w_D2lw61aj"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)