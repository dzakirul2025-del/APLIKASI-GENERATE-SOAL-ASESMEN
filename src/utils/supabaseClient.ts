import { createClient } from '@supabase/supabase-js';
import { getSettings } from './storage';

export const getSupabaseClient = () => {
  const settings = getSettings();
  if (settings.supabaseUrl && settings.supabaseAnonKey) {
    try {
      return createClient(settings.supabaseUrl, settings.supabaseAnonKey);
    } catch (e) {
      console.warn('Invalid Supabase configuration:', e);
      return null;
    }
  }
  return null;
};

export const testSupabaseConnection = async (url: string, anonKey: string) => {
  try {
    const testClient = createClient(url, anonKey);
    // Simple ping check
    const { error } = await testClient.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      return { success: false, message: 'API key atau URL Supabase tidak valid.' };
    }
    return { success: true, message: 'Koneksi ke Supabase berhasil terhubung!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal.' };
  }
};
