import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { CollectionsScreen } from './components/CollectionsScreen';
import { TShirtsScreen } from './components/TShirtsScreen';
import { ShirtsScreen } from './components/ShirtsScreen';
import { SummerScreen } from './components/SummerScreen';
import { KidsScreen } from './components/KidsScreen';
import { NewArrivalsScreen } from './components/NewArrivalsScreen';
import { AboutScreen } from './components/AboutScreen';
import { ProductModal } from './components/ProductModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { Product, mapSupabaseToProduct } from './data/products';
import { fetchActiveProducts, getSupabase } from './lib/supabase';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') return 'admin';
    }
    return 'home';
  });
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppTopic, setWhatsAppTopic] = useState<string | undefined>(undefined);
  const [whatsAppProduct, setWhatsAppProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') setActiveTab('admin');
    };
    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'admin') window.history.pushState(null, '', '#admin');
    else if (window.location.hash === '#admin') window.history.pushState(null, '', '/');
  }, [activeTab]);

  useEffect(() => {
    loadStoreProducts();
    const supabase = getSupabase();
    if (supabase) {
      const channel = supabase.channel('public:products').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadStoreProducts()).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, []);

  const loadStoreProducts = async () => {
    try {
      setLoadingProducts(true);
      setDbError(null);
      const rows = await fetchActiveProducts();
      setProducts(rows.map(mapSupabaseToProduct));
    } catch (err: any) {
      console.error('Failed to load active products:', err);
      setDbError(err.message || 'Could not fetch products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product: Product, size?: string) => setCartItems(prev => {
    const existing = prev.find(item => item.product.id === product.id && item.selectedSize === size);
    return existing
      ? prev.map(item => item.product.id === product.id && item.selectedSize === size ? { ...item, quantity: item.quantity + 1 } : item)
      : [...prev, { product, quantity: 1, selectedSize: size }];
  });

  const handleUpdateQuantity = (productId: string, delta: number, size?: string) => setCartItems(prev => prev
    .map(item => item.product.id === productId && item.selectedSize === size ? { ...item, quantity: item.quantity + delta } : item)
    .filter(item => item.quantity > 0));

  const handleRemoveCartItem = (productId: string, size?: string) => setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  const handleClearCart = () => setCartItems([]);
  const handleOpenWhatsApp = (topicOrProductName?: string) => { setWhatsAppTopic(topicOrProductName); setWhatsAppProduct(null); setIsWhatsAppOpen(true); };
  const handleOpenProductWhatsApp = (product: Product, selectedSize?: string) => { setWhatsAppProduct(product); setWhatsAppTopic(selectedSize ? `Size: ${selectedSize}` : undefined); setIsWhatsAppOpen(true); };
  const handleOpenQuickView = (product: Product) => { setSelectedProduct(product); setIsProductModalOpen(true); };
  const toggleCurrency = () => setCurrency(prev => prev === 'INR' ? 'USD' : 'INR');

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartProductIds = cartItems.map(item => item.product.id);

  if (activeTab === 'admin') {
    return (
      <AdminDashboard
        onBackToStore={() => { setActiveTab('home'); loadStoreProducts(); }}
        onLogout={() => setActiveTab('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f1f5f9] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount} openCart={() => setIsCartOpen(true)} currency={currency} toggleCurrency={toggleCurrency} openWhatsAppModal={() => handleOpenWhatsApp('General Stylist Advice')} isAdminLoggedIn={false} />
        {dbError && <div className="bg-rose-500/10 border-b border-rose-500/20 text-rose-300 py-2.5 px-4 text-xs"><div className="max-w-7xl mx-auto flex items-center justify-between gap-2"><div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /><span>Supabase connection notice: {dbError}</span></div><button onClick={() => setActiveTab('admin')} className="underline font-bold hover:text-white shrink-0">Configure in Admin</button></div></div>}
        <main className="pb-12">
          {activeTab === 'home' && <HomeScreen products={products} loading={loadingProducts} currency={currency} setActiveTab={setActiveTab} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'collections' && <CollectionsScreen products={products} loading={loadingProducts} currency={currency} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'tshirts' && <TShirtsScreen products={products} loading={loadingProducts} currency={currency} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'shirts' && <ShirtsScreen products={products} loading={loadingProducts} currency={currency} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'summer' && <SummerScreen products={products} loading={loadingProducts} currency={currency} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'kids' && <KidsScreen products={products} loading={loadingProducts} currency={currency} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'new-arrivals' && <NewArrivalsScreen products={products} loading={loadingProducts} currency={currency} openWhatsAppModal={handleOpenWhatsApp} onProductClick={handleOpenQuickView} onAddToCart={handleAddToCart} cartProductIds={cartProductIds} />}
          {activeTab === 'about' && <AboutScreen openWhatsAppModal={handleOpenWhatsApp} />}
        </main>
      </div>
      <ProductModal product={selectedProduct} isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} currency={currency} onInquireWhatsApp={handleOpenProductWhatsApp} onAddToCart={handleAddToCart} isInCart={Boolean(selectedProduct && cartProductIds.includes(selectedProduct.id))} />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => { setIsWhatsAppOpen(false); setWhatsAppProduct(null); setWhatsAppTopic(undefined); }} selectedProduct={whatsAppProduct} customTopic={whatsAppTopic} cartItems={cartItems} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} currency={currency} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveCartItem} onClearCart={handleClearCart} onInquireWhatsAppBag={() => { setIsCartOpen(false); setIsWhatsAppOpen(true); }} />
      <Footer setActiveTab={setActiveTab} openWhatsAppModal={handleOpenWhatsApp} />
    </div>
  );
}

export default App;
