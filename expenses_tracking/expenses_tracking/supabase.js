import { createClient } from '@supabase/supabase-js';

// Replace with your own Supabase project details
const SUPABASE_URL = 'https://adbyufdohfqmjceaiwvt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYnl1ZmRvaGZxbWpjZWFpd3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODUyMTgsImV4cCI6MjA3NTg2MTIxOH0.h3QxTgMBEpixT5Ch00RKGhoFwYE10N1Y9u_5P9a4iw4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
