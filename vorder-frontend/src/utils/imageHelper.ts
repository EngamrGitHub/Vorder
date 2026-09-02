import { API_BASE_URL } from '../api/client';
import type { ProductDto, ShopDto } from '../api/types';

// Curated high quality photographic assets
export const CURATED_PRODUCT_IMAGES: Record<string, string> = {
  phone: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  iphone: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  perfume: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  camera: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  cosmetics: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
};

// Curated shop banners
export const CURATED_SHOP_BANNERS = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
];

// Curated shop logos
export const CURATED_SHOP_LOGOS = [
  'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
];

export function getProductFallbackImage(name?: string, brand?: string): string {
  const query = `${name || ''} ${brand || ''}`.toLowerCase();
  for (const [key, url] of Object.entries(CURATED_PRODUCT_IMAGES)) {
    if (query.includes(key)) {
      return url;
    }
  }
  return CURATED_PRODUCT_IMAGES.default;
}

export function resolveProductImage(imageUrl?: string | null, name?: string, brand?: string): string {
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  if (imageUrl && !imageUrl.includes('dummy') && !imageUrl.endsWith('.empty')) {
    return `${API_BASE_URL}/shop-images/${imageUrl}`;
  }
  return getProductFallbackImage(name, brand);
}

export function resolveShopBanner(bannerUrl?: string | null, index = 0): string {
  if (bannerUrl && bannerUrl.startsWith('http')) return bannerUrl;
  if (bannerUrl) return `${API_BASE_URL}/shop-images/${bannerUrl}`;
  return CURATED_SHOP_BANNERS[index % CURATED_SHOP_BANNERS.length];
}

export function resolveShopLogo(logoUrl?: string | null, index = 0): string {
  if (logoUrl && logoUrl.startsWith('http')) return logoUrl;
  if (logoUrl) return `${API_BASE_URL}/shop-images/${logoUrl}`;
  return CURATED_SHOP_LOGOS[index % CURATED_SHOP_LOGOS.length];
}

// Fallback products if backend catalog has limited products
export const SHOWCASE_PRODUCTS: ProductDto[] = [
  {
    id: 'demo-p1',
    name: 'Apple iPhone 15 Pro Max',
    description: 'تيتانيوم طبيعي، شريحة A17 Pro فائقة القوة، كاميرا احترافية 48MP مع تقريب بصري 5x.',
    price: 64999,
    applyDiscount: true,
    discountPercent: 8,
    discountPrice: 59799,
    stockQuantity: 12,
    sku: 'IPH-15-PM-TIT',
    brand: 'Apple',
    model: '15 Pro Max 256GB',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    isPhysical: true,
    shopID: '272374a9-f4f1-4d09-aa6b-9aa081aa27e2',
    categoryId: 'c-elec',
    subCategoryId: 'sc-phones',
    isDeleted: false,
    isActive: true,
    createdDate: new Date().toISOString(),
  },
  {
    id: 'demo-p2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'سماعات رأس لاسلكية بخاصية إلغاء الضوضاء الرائدة عالمياً وصوت عالي الدقة بدون تشويش.',
    price: 18500,
    applyDiscount: true,
    discountPercent: 15,
    discountPrice: 15725,
    stockQuantity: 24,
    sku: 'SNY-WH-XM5-BLK',
    brand: 'Sony',
    model: 'WH-1000XM5',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    isPhysical: true,
    shopID: '272374a9-f4f1-4d09-aa6b-9aa081aa27e2',
    categoryId: 'c-elec',
    subCategoryId: 'sc-audio',
    isDeleted: false,
    isActive: true,
    createdDate: new Date().toISOString(),
  },
  {
    id: 'demo-p3',
    name: 'Bespoke Italian Leather Chrono Watch',
    description: 'ساعة يد أوتوماتيكية فاخرة من الفولاذ المقاوم للصدأ مع حزام جلدي إيطالي أصلي مقاوم للماء.',
    price: 8900,
    applyDiscount: false,
    discountPercent: 0,
    discountPrice: 8900,
    stockQuantity: 7,
    sku: 'WAT-CHRN-ITL',
    brand: 'Chronos',
    model: 'Apex 42mm',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    isPhysical: true,
    shopID: '8115d2d0-8fce-4d91-9bc9-a11f5f778fa3',
    categoryId: 'c-watch',
    subCategoryId: 'sc-chrono',
    isDeleted: false,
    isActive: true,
    createdDate: new Date().toISOString(),
  },
  {
    id: 'demo-p4',
    name: 'Tom Ford Oud Wood Eau de Parfum 100ml',
    description: 'عطر خشبي شرقي فاخر يجمع بين نفحات العود النادر، خشب الصندل، الهيل والعنبر الفواح.',
    price: 14200,
    applyDiscount: true,
    discountPercent: 12,
    discountPrice: 12496,
    stockQuantity: 18,
    sku: 'TF-OUD-WD-100',
    brand: 'Tom Ford',
    model: 'Private Blend 100ml',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    isPhysical: true,
    shopID: '0376963a-7109-45bd-a486-a921d5a7aace',
    categoryId: 'c-perfume',
    subCategoryId: 'sc-oriental',
    isDeleted: false,
    isActive: true,
    createdDate: new Date().toISOString(),
  }
];
