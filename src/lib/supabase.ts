import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SAMPLE_SEED_PRODUCTS } from '../data/products';

// Production Supabase connection. The publishable/anon key is safe for browser use;
// database security must be enforced with Supabase RLS policies.
const DEFAULT_SUPABASE_URL = 'https://rwvkryjtdgvowythuvjx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_hCUXYQ5LUK4XA5mL5y6ePQ_IrFvxQN0';

// Environment variables or localStorage fallbacks for Supabase
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const envAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

export const getStoredConfig = () => {
  if (typeof window === 'undefined') return { url: envUrl, key: envAnonKey };
  const storedUrl = localStorage.getItem('elan_supabase_url') || '';
  const storedKey = localStorage.getItem('elan_supabase_anon_key') || '';
  return {
    url: storedUrl || envUrl,
    key: storedKey || envAnonKey,
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getStoredConfig();
  if (!url || !key) return false;
  if (!url.startsWith('https://') && !url.startsWith('http://')) return false;
  if (url.includes('your-project.supabase.co') || key.includes('your-anon-public-key')) return false;
  return true;
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('elan_supabase_url', url.trim());
  localStorage.setItem('elan_supabase_anon_key', anonKey.trim());
  supabaseInstance = null;
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('elan_supabase_url');
  localStorage.removeItem('elan_supabase_anon_key');
  supabaseInstance = null;
  window.location.reload();
};

export interface SupabaseProductRow {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image_url: string;
  category: 'T-Shirts' | 'Linen Shirts & Pants' | 'Summer Collection' | "Kids' Wear";
  stock: number;
  is_active: boolean;
  created_at?: string;
}

export const CATEGORY_OPTIONS = [
  'T-Shirts',
  'Linen Shirts & Pants',
  'Summer Collection',
  "Kids' Wear",
] as const;

export type ProductCategory = typeof CATEGORY_OPTIONS[number];

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { url, key } = getStoredConfig();
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

const LOCAL_DB_KEY = 'elan_local_products_db';

export function getLocalProducts(): SupabaseProductRow[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (!raw) {
      const initial: SupabaseProductRow[] = SAMPLE_SEED_PRODUCTS.map((p, idx) => ({
        ...p,
        id: `local-prod-${idx + 1}`,
        created_at: new Date(Date.now() - idx * 3600000).toISOString(),
      }));
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveLocalProducts(products: SupabaseProductRow[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(products));
}

export async function fetchActiveProducts(): Promise<SupabaseProductRow[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch active products fallback to local:', err);
    }
  }
  return getLocalProducts().filter((p) => p.is_active);
}

export async function fetchActiveProductsByCategory(category: ProductCategory): Promise<SupabaseProductRow[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).eq('category', category).order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn(`Supabase fetch category ${category} fallback to local:`, err);
    }
  }
  return getLocalProducts().filter((p) => p.is_active && p.category === category);
}

export async function fetchAllProductsAdmin(): Promise<SupabaseProductRow[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase admin fetch fallback to local:', err);
    }
  }
  return getLocalProducts();
}

export async function createProduct(product: Omit<SupabaseProductRow, 'id' | 'created_at'>): Promise<SupabaseProductRow> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').insert([product]).select().single();
      if (!error && data) {
        const local = getLocalProducts();
        saveLocalProducts([data, ...local]);
        return data;
      }
    } catch (err) {
      console.warn('Supabase create fallback to local:', err);
    }
  }
  const newRow: SupabaseProductRow = { ...product, id: `local-prod-${Date.now()}`, created_at: new Date().toISOString() };
  const current = getLocalProducts();
  saveLocalProducts([newRow, ...current]);
  return newRow;
}

export async function updateProduct(id: string, updates: Partial<Omit<SupabaseProductRow, 'id' | 'created_at'>>): Promise<SupabaseProductRow> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (!error && data) {
        const local = getLocalProducts();
        saveLocalProducts(local.map((p) => (p.id === id ? { ...p, ...data } : p)));
        return data;
      }
    } catch (err) {
      console.warn('Supabase update fallback to local:', err);
    }
  }
  const current = getLocalProducts();
  let updatedRow: SupabaseProductRow | null = null;
  const next = current.map((p) => {
    if (p.id === id) {
      updatedRow = { ...p, ...updates };
      return updatedRow;
    }
    return p;
  });
  saveLocalProducts(next);
  return updatedRow || { id, ...updates } as SupabaseProductRow;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try { await supabase.from('products').delete().eq('id', id); } catch (err) { console.warn('Supabase delete fallback to local:', err); }
  }
  const current = getLocalProducts();
  saveLocalProducts(current.filter((p) => p.id !== id));
}

export async function seedSampleProducts(sampleRows: Omit<SupabaseProductRow, 'id' | 'created_at'>[]): Promise<number> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').insert(sampleRows).select();
      if (!error && data) { saveLocalProducts(data); return data.length; }
    } catch (err) { console.warn('Supabase seed fallback to local:', err); }
  }
  const seeded: SupabaseProductRow[] = sampleRows.map((row, idx) => ({ ...row, id: `local-seed-${Date.now()}-${idx + 1}`, created_at: new Date().toISOString() }));
  saveLocalProducts(seeded);
  return seeded.length;
}

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) return publicUrlData.publicUrl;
      }
    } catch (err) { console.warn('Supabase storage upload error, falling back to data URL:', err); }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
