import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Supabase configuration from Expo Constants (app.json) or environment variables
const supabaseUrl = 
  Constants.expoConfig?.extra?.SUPABASE_URL || 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  'https://ekzbruzmnmbczfgpdqxp.supabase.co';

const supabaseAnonKey = 
  Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVremJydXptbm1iY3pmZ3BkcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzYwMTYsImV4cCI6MjA2OTkxMjAxNn0.hmCrg9cmK47ASKs0xphJoamtBW7Usnl6VD-s7rgTl5o';

// Add validation to prevent crashes
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error('Supabase URL is not set in app.json extra or environment variables');
}
if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.error('Supabase Anon Key is not set in app.json extra or environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});