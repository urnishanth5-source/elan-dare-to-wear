import { ProductCategory, SupabaseProductRow } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  salePriceINR?: number | null;
  salePriceUSD?: number | null;
  image: string;
  category: ProductCategory;
  stock: number;
  isActive: boolean;
  tag?: string;
  description?: string;
  fabric?: string;
  fit?: string;
  ageGroup?: string;
  sizes?: string[];
  colors?: string[];
  rating?: number;
  featuredIn?: string[];
}

export const INR_TO_USD_RATE = 0.012;

export function mapSupabaseToProduct(row: SupabaseProductRow): Product {
  const priceUSD = Math.max(1, Math.round(row.price * INR_TO_USD_RATE));
  const salePriceUSD = row.sale_price ? Math.max(1, Math.round(row.sale_price * INR_TO_USD_RATE)) : null;

  let tag: string | undefined = undefined;
  if (row.sale_price && row.sale_price < row.price) {
    tag = 'SALE';
  } else if (row.stock <= 3 && row.stock > 0) {
    tag = 'LOW STOCK';
  } else if (row.category === 'Summer Collection') {
    tag = 'SUMMER';
  }

  let sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
  let ageGroup: string | undefined = undefined;

  if (row.category === "Kids' Wear") {
    sizes = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y'];
    ageGroup = 'Ages 2 - 12 Years';
  }

  return {
    id: row.id,
    name: row.name,
    priceINR: row.price,
    priceUSD,
    salePriceINR: row.sale_price,
    salePriceUSD,
    image: row.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    category: row.category,
    stock: row.stock,
    isActive: row.is_active,
    tag,
    sizes,
    fabric: row.category === 'Shirts' || row.category === 'Pants' ? '100% Breathable Pure Linen' : '100% Combed Compact Cotton',
    fit: row.category === 'T-Shirts' ? 'Relaxed Drop-Shoulder' : 'Modern Tailored Comfort',
    ageGroup,
    rating: 4.8,
  };
}

export const SAMPLE_SEED_PRODUCTS: Omit<SupabaseProductRow, 'id' | 'created_at'>[] = [
  {
    name: '240 GSM Heavyweight Drop-Shoulder Tee (Obsidian)',
    price: 699,
    sale_price: 599,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    category: 'T-Shirts',
    stock: 24,
    is_active: true,
  },
  {
    name: 'Mineral Washed Vintage Boxy Tee (Dust Taupe)',
    price: 749,
    sale_price: null,
    image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    category: 'T-Shirts',
    stock: 18,
    is_active: true,
  },
  {
    name: 'Textured Waffle Knit Oversized T-Shirt (Ecru White)',
    price: 799,
    sale_price: 699,
    image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    category: 'T-Shirts',
    stock: 12,
    is_active: true,
  },
  {
    name: 'Pure Flax Linen Relaxed Band Collar Shirt (Sky Blue)',
    price: 1399,
    sale_price: 1199,
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    category: 'Shirts',
    stock: 15,
    is_active: true,
  },
  {
    name: 'Classic Linen Resort Camp Shirt (Sand Beige)',
    price: 1299,
    sale_price: null,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    category: 'Shirts',
    stock: 20,
    is_active: true,
  },
  {
    name: 'Tailored Drawstring Linen Trousers (Olive Dusk)',
    price: 1499,
    sale_price: 1299,
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop',
    category: 'Pants',
    stock: 8,
    is_active: true,
  },
  {
    name: 'Breezy Seersucker Striped Summer Shirt (Citrus)',
    price: 999,
    sale_price: 849,
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
    category: 'Summer Collection',
    stock: 16,
    is_active: true,
  },
  {
    name: 'Lightweight Poplin Utility Short-Sleeve (Sage)',
    price: 899,
    sale_price: null,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    category: 'Summer Collection',
    stock: 22,
    is_active: true,
  },
  {
    name: 'Summer Resort Floral Vacation Shirt (Coastline)',
    price: 1099,
    sale_price: 949,
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    category: 'Summer Collection',
    stock: 10,
    is_active: true,
  },
  {
    name: "Boys' Cotton Casual Linen-Blend Set (Ages 3-8Y)",
    price: 799,
    sale_price: 649,
    image_url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
    category: "Kids' Wear",
    stock: 14,
    is_active: true,
  },
  {
    name: "Kids' Combed Cotton Graphic Playwear Tee (Mustard)",
    price: 449,
    sale_price: null,
    image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop',
    category: "Kids' Wear",
    stock: 25,
    is_active: true,
  },
  {
    name: "Organic Cotton Kids' Summer Dungaree & Polo Set",
    price: 899,
    sale_price: 749,
    image_url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop',
    category: "Kids' Wear",
    stock: 9,
    is_active: true,
  },
];

export const CATEGORY_METADATA: Record<ProductCategory | 'new-arrivals' | 'summer', { title: string; badge: string; subtitle: string; }> = {
  'T-Shirts': {
    title: 'T-Shirts & Drop Shoulders',
    badge: 'Heavyweight Cotton',
    subtitle: '240gsm high-density compact combed cotton with tailored neck ribs and dropped shoulders.',
  },
  'Shirts': {
    title: 'Shirts',
    badge: 'Pure Linen Weave',
    subtitle: 'Breathable, pre-washed shirts designed for airy elegance and tropical Coimbatore days.',
  },
  'Pants': {
    title: 'Pants',
    badge: 'Tailored Linen',
    subtitle: 'Comfortable, breathable trousers and pants designed for everyday wear in Coimbatore.',
  },
  'Summer Collection': {
    title: 'Summer 2024 Collection',
    badge: 'Seasonal Drop',
    subtitle: 'Sun-drenched hues, relaxed resort collars, and lightweight textures tailored for comfort.',
  },
  "Kids' Wear": {
    title: "Kids' Ready-Made Wear",
    badge: 'Ages 1-12 Years',
    subtitle: 'Skin-safe organic cotton sets, breathable playwear, and joyful patterns for active little ones.',
  },
  'new-arrivals': {
    title: 'New In Store This Week',
    badge: 'Weekly Refresh',
    subtitle: 'Fresh silhouettes and color drops newly stocked at our Sukrawarpet store.',
  },
  'summer': {
    title: 'Summer Collection',
    badge: 'Seasonal Drop',
    subtitle: 'Sun-drenched hues, relaxed resort collars, and lightweight textures tailored for comfort.',
  },
};

export const STORE_INFO = {
  name: 'elan.',
  tagline: 'Ready-made garments. Honest prices.',
  categorySummary: "Men's & Kids' Wear",
  phone: '97917 86008',
  whatsappNumber: '919791786008',
  address: '1158, Sukrawarpet St, opp. to Rajendrasuri Jain Trust, Sukrawar Pettai, R.S. Puram, Coimbatore, Tamil Nadu 641001',
  shortAddress: 'Sukrawarpet St, Coimbatore',
  hours: 'Mon - Sun: 10:00 AM – 9:30 PM',
  googleMapsUrl: 'https://maps.app.goo.gl/9ZpL9tQ175Bms9c68',
  websiteUrl: 'https://elandaretowear.pages.dev',
  rating: 4.9,
  reviewCount: 174,
};

export const REVIEWS = [
  { id: 1, name: 'Karthik Raja', rating: 5, date: '2 weeks ago', comment: 'The 240gsm oversized t-shirts are top tier quality. Fabric feels heavy yet super soft in Coimbatore heat. Honest prices!', initials: 'KR', source: 'Google Review' },
  { id: 2, name: 'Priya Sundaram', rating: 5, date: '1 month ago', comment: 'Bought linen shirts for my husband and soft cotton coords for my 4-year-old son. The staff in Sukrawarpet is extremely helpful.', initials: 'PS', source: 'Google Review' },
  { id: 3, name: 'Vignesh M', rating: 5, date: '3 weeks ago', comment: 'Best ready-made store near Town Hall. The linen shirts fit like a glove and the pricing is very reasonable compared to malls.', initials: 'VM', source: 'Google Review' },
];
