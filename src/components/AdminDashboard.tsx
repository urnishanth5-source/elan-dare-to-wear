import React, { useState, useEffect } from 'react';
import { 
  getSupabase, 
  isSupabaseConfigured, 
  saveSupabaseConfig, 
  fetchAllProductsAdmin, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  uploadProductImage,
  SupabaseProductRow, 
  CATEGORY_OPTIONS, 
  ProductCategory 
} from '../lib/supabase';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  Image as ImageIcon, 
  LogOut, 
  ExternalLink, 
  AlertCircle, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  Package, 
  DollarSign, 
  Tag, 
  Eye, 
  EyeOff,
  Copy,
  Terminal
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onLogout }) => {
  const [products, setProducts] = useState<SupabaseProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'sql-setup'>('products');

  // Filter & Search
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form states for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupabaseProductRow | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState<{
    name: string;
    price: number | '';
    sale_price: number | '';
    category: ProductCategory;
    stock: number | '';
    is_active: boolean;
    image_url: string;
  }>({
    name: '',
    price: '',
    sale_price: '',
    category: 'T-Shirts',
    stock: 20,
    is_active: true,
    image_url: '',
  });

  // Image Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // SQL Copy State
  const [copiedSql, setCopiedSql] = useState(false);

  // Initial load
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await fetchAllProductsAdmin();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to fetch products from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 999,
      sale_price: '',
      category: 'T-Shirts',
      stock: 25,
      is_active: true,
      image_url: '',
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleOpenEdit = (product: SupabaseProductRow) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      sale_price: product.sale_price ?? '',
      category: product.category,
      stock: product.stock,
      is_active: product.is_active,
      image_url: product.image_url || '',
    });
    setImageFile(null);
    setImagePreview(product.image_url || '');
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Product name is required');
      return;
    }
    if (formData.price === '' || Number(formData.price) <= 0) {
      setErrorMessage('Price must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      let finalImageUrl = formData.image_url;

      // If user uploaded a new image file, upload to Supabase Storage
      if (imageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadProductImage(imageFile);
        } catch (uploadErr: any) {
          throw new Error(`Image upload failed: ${uploadErr.message}. Make sure the 'products' bucket exists in Supabase Storage with public access enabled.`);
        } finally {
          setUploadingImage(false);
        }
      }

      if (!finalImageUrl) {
        // Fallback default fashion image if none provided
        finalImageUrl = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop';
      }

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        sale_price: formData.sale_price !== '' && Number(formData.sale_price) > 0 ? Number(formData.sale_price) : null,
        category: formData.category,
        stock: formData.stock === '' ? 0 : Number(formData.stock),
        is_active: formData.is_active,
        image_url: finalImageUrl,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccessMessage(`Product "${payload.name}" updated successfully!`);
      } else {
        await createProduct(payload);
        setSuccessMessage(`Product "${payload.name}" added successfully!`);
      }

      setIsModalOpen(false);
      await loadProducts();

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSaving(true);
      await deleteProduct(id);
      setSuccessMessage(`Deleted "${name}"`);
      await loadProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (product: SupabaseProductRow) => {
    try {
      const updatedStatus = !product.is_active;
      await updateProduct(product.id, { is_active: updatedStatus });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: updatedStatus } : p));
      setSuccessMessage(`Product is now ${updatedStatus ? 'Active on Store' : 'Hidden from Store'}`);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to toggle product status');
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sqlSetupInstructions = `-- 1. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  sale_price NUMERIC DEFAULT NULL CHECK (sale_price >= 0),
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('T-Shirts', 'Linen Shirts & Pants', 'Summer Collection', 'Kids'' Wear')),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. PUBLIC CAN READ ACTIVE PRODUCTS
CREATE POLICY "Public users can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- 4. AUTHENTICATED ADMINS CAN SELECT ALL PRODUCTS
CREATE POLICY "Authenticated admins can view all products" 
ON public.products 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. AUTHENTICATED ADMINS CAN INSERT PRODUCTS
CREATE POLICY "Authenticated admins can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 6. AUTHENTICATED ADMINS CAN UPDATE PRODUCTS
CREATE POLICY "Authenticated admins can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 7. AUTHENTICATED ADMINS CAN DELETE PRODUCTS
CREATE POLICY "Authenticated admins can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- 8. SUPABASE STORAGE SETUP
-- Create a public bucket named 'products' in Supabase Storage.
-- Make sure the bucket is set to "Public" so product images can load on the storefront!`;

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f1f5f9]">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0e1118]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tight text-white">
              elan.
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
              Admin Portal
            </span>
          </div>

          {/* Center Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Product Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('sql-setup')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'sql-setup' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SQL & RLS Guide</span>
            </button>
          </div>

          {/* Right Action: Storefront & Sign Out */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Messages */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-2.5 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 1: Product Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12151d] p-4 sm:p-6 rounded-2xl border border-white/[0.08]">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Dynamic Inventory Manager
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time sync with your Supabase database table. Changes appear immediately on the storefront.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadProducts}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors disabled:opacity-50"
                  title="Reload from Supabase"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#12151d] text-zinc-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  All ({products.length})
                </button>
                {CATEGORY_OPTIONS.map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        selectedCategoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#12151d] text-zinc-400 hover:text-white border border-white/[0.08]'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-[#12151d] text-white px-3.5 py-2 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none placeholder:text-zinc-500"
                />
              </div>

            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-[#12151d] border border-white/[0.08] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-[#0e1118] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Product</th>
                      <th className="py-3.5 px-4 font-bold">Category</th>
                      <th className="py-3.5 px-4 font-bold">Price</th>
                      <th className="py-3.5 px-4 font-bold">Sale Price</th>
                      <th className="py-3.5 px-4 font-bold">Stock</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-zinc-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                          <span>Loading products from Supabase...</span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-zinc-500">
                          <Package className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                          <p className="text-sm font-semibold text-zinc-400">No products found</p>
                          <p className="text-xs mt-1">Click "Add Product" above or check your Supabase table.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                          
                          {/* Product Image & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 rounded-lg bg-[#181c26] overflow-hidden shrink-0 border border-white/10">
                                <img
                                  src={product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200'}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span className="font-bold text-white text-xs block line-clamp-1">
                                  {product.name}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  ID: {product.id.slice(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-zinc-300">
                              {product.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-bold text-white">
                            ₹{product.price.toLocaleString('en-IN')}
                          </td>

                          {/* Sale Price */}
                          <td className="py-3 px-4">
                            {product.sale_price ? (
                              <span className="text-emerald-400 font-semibold">
                                ₹{product.sale_price.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-zinc-500">—</span>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${
                              product.stock === 0
                                ? 'text-rose-400'
                                : product.stock <= 5
                                ? 'text-amber-400'
                                : 'text-zinc-300'
                            }`}>
                              {product.stock} units
                            </span>
                          </td>

                          {/* Active / Inactive Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleActive(product)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                                product.is_active
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-zinc-800 text-zinc-400 border border-white/10 hover:bg-zinc-700'
                              }`}
                              title={product.is_active ? 'Click to hide from store' : 'Click to show on store'}
                            >
                              {product.is_active ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>Disabled</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(product)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: SQL Setup & RLS Guide */}
        {activeTab === 'sql-setup' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 rounded-2xl bg-[#12151d] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">Supabase Schema & Security Setup</h2>
                  <p className="text-xs text-zinc-400">
                    Run this SQL script in your Supabase SQL Editor if you ever need to recreate or harden the table schema and Row Level Security policies.
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlSetupInstructions);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied to Clipboard' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                {sqlSetupInstructions}
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0e1118] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Syncs with the Supabase `products` table and storage bucket.
            </p>

            <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Heavyweight Oversized Tee"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Category & Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full text-xs bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0e1118] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full text-xs bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price & Sale Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Regular Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full text-xs bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Sale Price (₹ INR) <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave empty if not on sale"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full text-xs bg-black/40 text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload / Storage */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Product Image (Supabase Storage)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Image Preview */}
                  <div className="sm:col-span-4 h-32 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-zinc-500">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                  </div>

                  {/* File Selector & URL */}
                  <div className="sm:col-span-8 space-y-2.5">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="product-image-upload"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-colors"
                      >
                        <Upload className="w-4 h-4 text-blue-400" />
                        <span>Upload from Computer</span>
                      </label>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Files are automatically uploaded to your Supabase <code>'products'</code> storage bucket.
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                        Or enter direct Image URL:
                      </span>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData({ ...formData, image_url: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                        className="w-full text-xs bg-black/40 text-white px-3 py-1.5 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Is Active Toggle */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Visible on Customer Storefront</span>
                  <span className="text-[11px] text-zinc-400">Enable this to display the product to buyers immediately</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    formData.is_active ? 'bg-blue-600' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving || uploadingImage}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {saving || uploadingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{uploadingImage ? 'Uploading Image...' : 'Saving to Supabase...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
