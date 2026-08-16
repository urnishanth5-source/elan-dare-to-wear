import React, { useEffect, useState } from 'react';
import { fetchAllProductsAdmin, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../lib/supabase';

interface AdminDashboardProps { onBackToStore: () => void; onLogout: () => void; }

type Product = any;

const categories = ['T-Shirts', 'Linen Shirts & Pants', 'Summer Collection', "Kids' Wear"];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'T-Shirts', price: '', sale_price: '', stock: '10', image_url: '', is_active: true });

  const load = async () => {
    setLoading(true); setError('');
    try { setProducts(await fetchAllProductsAdmin()); }
    catch (e: any) { setError(e?.message || 'Could not connect to Supabase.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: 'T-Shirts', price: '', sale_price: '', stock: '10', image_url: '', is_active: true });
    setShowForm(true); setError('');
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name || '', category: p.category || 'T-Shirts', price: String(p.price ?? ''), sale_price: p.sale_price == null ? '' : String(p.sale_price), stock: String(p.stock ?? 0), image_url: p.image_url || '', is_active: p.is_active !== false });
    setShowForm(true); setError('');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setMessage('');
    if (!form.name.trim() || !form.price || Number(form.price) <= 0) { setError('Enter a product name and valid price.'); return; }
    try {
      setUploading(true);
      let imageUrl = form.image_url.trim();
      const input = document.getElementById('admin-product-image') as HTMLInputElement | null;
      if (input?.files?.[0]) imageUrl = await uploadProductImage(input.files[0]);
      if (!imageUrl) imageUrl = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop';
      const payload: any = { name: form.name.trim(), category: form.category, price: Number(form.price), sale_price: form.sale_price ? Number(form.sale_price) : null, stock: Number(form.stock || 0), image_url: imageUrl, is_active: form.is_active };
      if (editing) await updateProduct(editing.id, payload); else await createProduct(payload);
      setShowForm(false); setMessage(editing ? 'Product updated.' : 'Product added.'); await load();
    } catch (e: any) { setError(e?.message || 'Could not save product.'); }
    finally { setUploading(false); }
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try { await deleteProduct(p.id); setMessage('Product deleted.'); await load(); }
    catch (e: any) { setError(e?.message || 'Could not delete product.'); }
  };

  return <div className="min-h-screen bg-[#090a0f] text-white">
    <header className="border-b border-white/10 bg-[#0e1118] px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div><div className="text-xl font-extrabold">elan.</div><div className="text-xs text-blue-400 font-bold uppercase">Admin Portal</div></div>
        <div className="flex gap-2"><button onClick={onBackToStore} className="px-3 py-2 rounded-lg border border-white/10 text-sm">Storefront</button><button onClick={onLogout} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 text-sm">Exit</button></div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto p-4 sm:p-8">
      {error && <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">{error}</div>}
      {message && <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300">{message}</div>}
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">Product Manager</h1><p className="text-sm text-zinc-400">Add products here and they will appear on the store.</p></div><div className="flex gap-2"><button onClick={load} className="px-4 py-2 rounded-lg border border-white/10">↻ Refresh</button><button onClick={openAdd} className="px-4 py-2 rounded-lg bg-blue-600 font-bold">+ Add Product</button></div></div>
      {loading ? <div className="p-12 text-center text-zinc-400">Loading products...</div> : products.length === 0 ? <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#12151d]"><div className="text-xl font-bold">No products yet</div><p className="text-zinc-400 mt-2">Click Add Product to create your first item.</p></div> : <div className="grid gap-4">{products.map((p) => <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#12151d]"><img src={p.image_url} className="w-20 h-20 object-cover rounded-lg bg-black" /><div className="flex-1"><div className="font-bold">{p.name}</div><div className="text-sm text-zinc-400">{p.category} · ₹{p.sale_price ?? p.price} · Stock {p.stock}</div></div><button onClick={() => openEdit(p)} className="px-3 py-2 rounded-lg border border-white/10">Edit</button><button onClick={() => remove(p)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300">Delete</button></div>)}</div>}
    </main>
    {showForm && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><form onSubmit={save} className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-[#12151d] border border-white/10 p-6"><div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold">{editing ? 'Edit Product' : 'Add New Product'}</h2><button type="button" onClick={() => setShowForm(false)} className="text-zinc-400 text-xl">×</button></div><div className="grid sm:grid-cols-2 gap-4"><label className="sm:col-span-2">Product name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10" /></label><label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10">{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Stock<input type="number" min="0" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10" /></label><label>Regular price ₹<input required type="number" min="1" value={form.price} onChange={e => setForm({...form,price:e.target.value})} className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10" /></label><label>Sale price ₹<input type="number" min="0" value={form.sale_price} onChange={e => setForm({...form,sale_price:e.target.value})} className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10" /></label><label className="sm:col-span-2">Product image<input id="admin-product-image" type="file" accept="image/*" className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10" /></label><label className="sm:col-span-2">Or image URL<input value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})} placeholder="https://..." className="w-full mt-1 p-3 rounded-lg bg-black border border-white/10" /></label><label className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form,is_active:e.target.checked})} /> Visible on storefront</label></div><button disabled={uploading} className="w-full mt-6 p-3 rounded-lg bg-blue-600 font-bold">{uploading ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button></form></div>}
  </div>;
};
