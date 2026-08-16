import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://rwvkryjtdgvowythuvjx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_hCUXYQ5LUK4XA5mL5y6ePQ_IrFvxQN0';

const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const envAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

export const getStoredConfig = () => ({ url: envUrl, key: envAnonKey });

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getStoredConfig();
  return Boolean(url && key && (url.startsWith('https://') || url.startsWith('http://')));
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (!url.trim() || !anonKey.trim()) return;
  localStorage.removeItem('elan_supabase_url');
  localStorage.removeItem('elan_supabase_anon_key');
  supabaseInstance = null;
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('elan_supabase_url');
  localStorage.removeItem('elan_supabase_anon_key');
  localStorage.removeItem('elan_local_products_db');
  supabaseInstance = null;
  window.location.reload();
};

export interface SupabaseProductRow {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  image_url: string;
  category: 'T-Shirts' | 'Linen Shirts & Pants' | 'Summer Collection' | "Kids' Wear";
  stock: number;
  is_active: boolean;
}

export const CATEGORY_OPTIONS = ['T-Shirts', 'Linen Shirts & Pants', 'Summer Collection', "Kids' Wear"] as const;
export type ProductCategory = typeof CATEGORY_OPTIONS[number];

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  const { url, key } = getStoredConfig();
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

// Local product storage is intentionally disabled for production so all devices
// use the same Supabase catalog. Clear any products from the previous local demo.
export function getLocalProducts(): SupabaseProductRow[] {
  if (typeof window !== 'undefined') localStorage.removeItem('elan_local_products_db');
  return [];
}

export function saveLocalProducts(_products: SupabaseProductRow[]) {
  if (typeof window !== 'undefined') localStorage.removeItem('elan_local_products_db');
}

// Storefront reads go through the Vercel API proxy so customer devices do not
// have to connect directly to the Supabase hostname.
async function fetchStorefrontProducts(category?: ProductCategory): Promise<SupabaseProductRow[]> {
  const url = category ? `/api/products?category=${encodeURIComponent(category)}` : '/api/products';
  const response = await fetch(url, { cache: 'no-store' });
  const body = await response.text();
  if (!response.ok) {
    let message = body || `Product API returned ${response.status}`;
    try { message = JSON.parse(body).error || message; } catch { /* keep raw message */ }
    throw new Error(message);
  }
  const data = JSON.parse(body);
  return (Array.isArray(data) ? data : []).map(normalizeProductRow);
}

export async function fetchActiveProducts(): Promise<SupabaseProductRow[]> {
  return fetchStorefrontProducts();
}

export async function fetchActiveProductsByCategory(category: ProductCategory): Promise<SupabaseProductRow[]> {
  return fetchStorefrontProducts(category);
}

export async function fetchAllProductsAdmin(): Promise<SupabaseProductRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeProductRow);
}

export async function createProduct(product: Omit<SupabaseProductRow, 'id'>): Promise<SupabaseProductRow> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const dbProduct = {
    name: product.name,
    price: product.price,
    sales_price: product.sale_price,
    image_url: product.image_url,
    category: product.category,
    stock: product.stock,
    is_active: product.is_active,
  };
  const { data, error } = await supabase.from('products').insert([dbProduct]).select().single();
  if (error) throw error;
  return normalizeProductRow(data);
}

export async function updateProduct(id: number, updates: Partial<Omit<SupabaseProductRow, 'id'>>): Promise<SupabaseProductRow> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const dbUpdates: Record<string, unknown> = { ...updates };
  if ('sale_price' in dbUpdates) {
    dbUpdates.sales_price = dbUpdates.sale_price;
    delete dbUpdates.sale_price;
  }
  const { data, error } = await supabase.from('products').update(dbUpdates).eq('id', id).select().single();
  if (error) throw error;
  return normalizeProductRow(data);
}

export async function deleteProduct(id: number): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function seedSampleProducts(sampleRows: Omit<SupabaseProductRow, 'id'>[]): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured.');
  const dbRows = sampleRows.map((row) => ({
    name: row.name,
    price: row.price,
    sales_price: row.sale_price,
    image_url: row.image_url,
    category: row.category,
    stock: row.stock,
    is_active: row.is_active,
  }));
  const { data, error } = await supabase.from('products').insert(dbRows).select();
  if (error) throw error;
  return data?.length || 0;
}

function normalizeProductRow(row: any): SupabaseProductRow {
  return {
    id: Number(row.id),
    name: row.name,
    price: Number(row.price || 0),
    sale_price: row.sales_price == null ? null : Number(row.sales_price),
    image_url: row.image_url || '',
    category: row.category as ProductCategory,
    stock: Number(row.stock || 0),
    is_active: row.is_active !== false,
  };
}

// Upload through the Vercel API proxy instead of directly from the browser.
// This avoids browser-side Supabase Storage fetch/CORS failures while keeping
// the Supabase hostname and storage handling off the customer device.
export async function uploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
  if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
  if (file.size > 4 * 1024 * 1024) throw new Error('Image is too large. Please use an image under 4 MB.');

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
  }
  const base64 = btoa(binary);
  const extension = file.name.includes('.') ? file.name.split('.').pop() : file.type.split('/')[1];

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, contentType: file.type, extension }),
  });

  const body = await response.text();
  let data: any = null;
  try { data = JSON.parse(body); } catch { /* handled below */ }
  if (!response.ok || !data?.publicUrl) {
    throw new Error(data?.error || body || `Image upload failed (${response.status}).`);
  }
  return data.publicUrl;
}
