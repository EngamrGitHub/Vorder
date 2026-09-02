import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'ar' | 'en';

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  // Brand & General
  brandName: { ar: 'فوردر', en: 'Vorder' },
  brandTagline: { ar: 'وكالة تسويق • خدمات رقمية واستراتيجية', en: 'Marketing Agency • Digital & Strategic Services' },
  loading: { ar: 'جاري التحميل…', en: 'Loading…' },
  allShops: { ar: 'كل المتاجر', en: 'All shops' },
  backHome: { ar: 'العودة للرئيسية', en: 'Back home' },
  notFoundTitle: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
  notFoundDesc: { ar: 'عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.', en: "The page you're looking for doesn't exist." },

  // Navbar & Nav
  home: { ar: 'الرئيسية', en: 'Home' },
  shops: { ar: 'المتاجر', en: 'Shops' },
  featuredProducts: { ar: 'المنتجات المميزة', en: 'Featured Products' },
  categories: { ar: 'التصنيفات', en: 'Categories' },
  myShop: { ar: 'متجري', en: 'My Shop' },
  addresses: { ar: 'عناويني', en: 'Addresses' },
  login: { ar: 'تسجيل الدخول', en: 'Login' },
  signUp: { ar: 'إنشاء حساب', en: 'Sign up' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout' },
  cart: { ar: 'سلة المشتريات', en: 'Shopping Cart' },

  // Hero
  heroBadge: { ar: 'منصة التجارة الإلكترونية والحلول التسويقية الأولى', en: 'The #1 Multi-Vendor & Marketing Agency Platform' },
  heroTitle: { ar: 'كل ما يحتاجه متجرك للنمو، في مكان واحد', en: 'Everything your shop needs to scale, on one platform' },
  heroSubtitle: { 
    ar: 'فوردر هي منصة متكاملة تجمع بين قوة التسويق الرقمي وتجربة التجارة الإلكترونية متعددة التجار. افتح متجرك الخاص، اعرض منتجاتك، وتواصل مع آلاف العملاء بسهولة واحترافية.', 
    en: 'Vorder combines digital marketing prowess with a cutting-edge multi-vendor marketplace. Open your boutique, list products, and connect with thousands of active buyers with ease.' 
  },
  browseShops: { ar: 'استكشف المتاجر', en: 'Browse Shops' },
  openYourShop: { ar: 'ابدأ البيع الآن', en: 'Start Selling Today' },

  // Stats
  statShops: { ar: 'متجر مسجل', en: 'Registered Shops' },
  statActiveShops: { ar: 'متجر نشط حالياً', en: 'Active Stores' },
  statProducts: { ar: 'منتج متاح', en: 'Curated Products' },
  statOrders: { ar: 'نسبة رضا العملاء', en: 'Customer Satisfaction' },

  // Trust Badges
  trustVerified: { ar: 'متاجر معتمدة وموثوقة', en: 'Verified & Trusted Stores' },
  trustVerifiedDesc: { ar: 'جميع البائعين يمرون بعملية فحص دقيقة لضمان الجودة.', en: 'All vendors undergo strict quality verification.' },
  trustShipping: { ar: 'شحن سريع ومضمون', en: 'Fast & Secure Delivery' },
  trustShippingDesc: { ar: 'توصيل لباب بيتك مع خيارات تتبع مباشرة وفورية.', en: 'Direct doorstep delivery with real-time live tracking.' },
  trustPayments: { ar: 'دفع آمن 100%', en: '100% Secure Checkout' },
  trustPaymentsDesc: { ar: 'بوابات دفع إلكتروني مشفرة ومحمية بأحدث المعايير.', en: 'Encrypted payment gateways adhering to global standards.' },
  trustSupport: { ar: 'دعم استراتيجي 24/7', en: '24/7 Marketing Support' },
  trustSupportDesc: { ar: 'فريق خبراء تسويق لمساعدتك في زيادة مبيعاتك وأرباحك.', en: 'Dedicated specialists to amplify your store sales.' },

  // Categories Showcase
  categoriesTitle: { ar: 'تسوق حسب التصنيف', en: 'Explore by Category' },
  categoriesSubtitle: { ar: 'اختر من بين تشكيلات واسعة من أرقى المنتجات والعلامات التجارية', en: 'Choose from a handpicked selection of top-tier categories and brands' },
  catElectronics: { ar: 'الإلكترونيات والهواتف', en: 'Electronics & Mobiles' },
  catFashion: { ar: 'الأزياء والموضة', en: 'Fashion & Apparel' },
  catWatches: { ar: 'الساعات والإكسسوارات', en: 'Watches & Accessories' },
  catPerfumes: { ar: 'العطور ومستحضرات التجميل', en: 'Perfumes & Beauty' },
  catHome: { ar: 'المنزل والديكور', en: 'Home & Living' },
  catDigital: { ar: 'خدمات وحلول رقمية', en: 'Digital & Marketing Services' },

  // Featured Products
  featuredTitle: { ar: 'أحدث المنتجات والعروض', en: 'Trending & Featured Products' },
  featuredSubtitle: { ar: 'منتجات مختارة بعناية بأفضل الأسعار وأعلى جودة من شركائنا المعتمدين', en: 'Handpicked products at the best prices from verified merchants' },
  addToCart: { ar: 'أضف للسلة', en: 'Add to Cart' },
  adding: { ar: 'جاري الإضافة…', en: 'Adding…' },
  inStock: { ar: 'متوفر في المخزون', en: 'In Stock' },
  outOfStock: { ar: 'نفد من المخزون', en: 'Out of Stock' },
  discountBadge: { ar: 'خصم', en: 'OFF' },
  viewDetails: { ar: 'عرض التفاصيل', en: 'View Details' },

  // Featured Shops
  featuredShopsTitle: { ar: 'أبرز المتاجر المعتمدة', en: 'Featured Stores' },
  featuredShopsSubtitle: { ar: 'تسوّق من أفضل البراندات والمتاجر المتخصصة على منصتنا', en: 'Discover premium brands and curated boutiques across the platform' },
  visitShop: { ar: 'زيارة المتجر', en: 'Visit Store' },
  active: { ar: 'نشط', en: 'Active' },
  inactive: { ar: 'غير نشط', en: 'Inactive' },
  productsCount: { ar: 'منتج', en: 'products' },

  // CTA Section
  ctaTitle: { ar: 'هل تمتلك علامة تجارية أو متجراً؟', en: 'Are you a brand owner or merchant?' },
  ctaSubtitle: { 
    ar: 'انضم إلى شبكة فوردر واستفد من خدماتنا الرقمية والتسويقية المتكاملة لتوسيع مبيعاتك والوصول لملايين العملاء في مصر والشرق الأوسط.', 
    en: 'Join the Vorder network and leverage our strategic marketing services to scale your reach across millions of shoppers.' 
  },
  ctaButton: { ar: 'سجل متجرك الآن مجاناً', en: 'Register Your Store Free' },

  // Shops Page
  shopsPageTitle: { ar: 'دليل المتاجر والشركاء', en: 'Vendors & Stores Directory' },
  shopsPageSubtitle: { ar: 'استعرض جميع المتاجر المسجلة والنشطة على شبكة فوردر', en: 'Explore all registered and verified merchants on Vorder' },
  searchShops: { ar: 'ابحث عن اسم متجر، مدينة، أو نشاط…', en: 'Search store name, city, or specialty…' },
  noShops: { ar: 'لا توجد متاجر حالياً', en: 'No shops yet' },
  noShopsSubtitle: { ar: 'كن أول من ينضم لمنصتنا — سجل حسابك وافتح متجرك الآن!', en: 'Be the first! Sign up and launch your shop from My Shop.' },

  // Shop Detail Page
  shopProducts: { ar: 'منتجات المتجر', en: 'Store Products' },
  noProductsShop: { ar: 'لا توجد منتجات في هذا المتجر حتى الآن', en: 'No products in this shop yet' },
  noProductsShopSub: { ar: 'لم يقم صاحب المتجر بإضافة منتجات بعد.', en: "The store owner hasn't added any products yet." },
  contactStore: { ar: 'تواصل مع المتجر', en: 'Contact Merchant' },
  city: { ar: 'المدينة', en: 'City' },
  country: { ar: 'الدولة', en: 'Country' },
  website: { ar: 'الموقع الإلكتروني', en: 'Website' },
  whatsapp: { ar: 'واتساب', en: 'WhatsApp' },

  // Product Detail Page
  qty: { ar: 'الكمية', en: 'Quantity' },
  loginToBuy: { ar: 'سجل دخولك لتتمكن من إضافة المنتج إلى سلتك والمتابعة.', en: 'Log in to add this product to your cart and checkout.' },
  reviews: { ar: 'تقييمات وآراء العملاء', en: 'Customer Reviews' },
  noReviews: { ar: 'لا توجد تقييمات بعد — كن أول من يشارك رأيه!', en: 'No reviews yet — be the first to review!' },
  writeReview: { ar: 'أضف تقييمك', en: 'Write a Review' },
  yourRating: { ar: 'تقييمك', en: 'Your Rating' },
  reviewPlaceholder: { ar: 'شاركنا برأيك حول جودة المنتج وتجربتك…', en: 'Share your honest thoughts about the product…' },
  postReview: { ar: 'نشر التقييم', en: 'Submit Review' },
  posting: { ar: 'جاري النشر…', en: 'Submitting…' },
  addedToCart: { ar: 'تمت إضافة المنتج إلى السلة بنجاح!', en: 'Item added to cart successfully!' },

  // Cart Page
  yourCart: { ar: 'سلة المشتريات', en: 'Your Shopping Cart' },
  cartItemsCount: { ar: 'عنصر في السلة', en: 'items in cart' },
  cartEmpty: { ar: 'سلتك فارغة حالياً', en: 'Your cart is currently empty' },
  cartEmptySub: { ar: 'تصفح المتاجر واستكشف أفضل العروض والمنتجات المميزة.', en: 'Browse shops and discover our top trending products.' },
  product: { ar: 'المنتج', en: 'Product' },
  unitPrice: { ar: 'سعر الوحدة', en: 'Unit Price' },
  total: { ar: 'المجموع الإجمالي', en: 'Total' },
  orderSummary: { ar: 'ملخص الطلب', en: 'Order Summary' },
  subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
  shipping: { ar: 'الشحن والتوصيل', en: 'Shipping' },
  freeShipping: { ar: 'مجاني', en: 'Free' },
  proceedToCheckout: { ar: 'متابعة إتمام الطلب', en: 'Proceed to Checkout' },

  // Footer
  footerAbout: { 
    ar: 'فوردر وكالة تسويق رقمي وخدمات استراتيجية متكاملة تدعم منصات التجارة الإلكترونية، تُمكّن البائعين ورواد الأعمال من بناء علامات تجارية رائدة وتحقيق أعلى معدلات نمو ومبيعات.', 
    en: 'Vorder is a full-service marketing agency and multi-vendor commerce powerhouse, empowering merchants and brands to scale exponentially through cutting-edge digital strategies.' 
  },
  quickLinks: { ar: 'روابط سريعة', en: 'Quick Links' },
  services: { ar: 'خدماتنا', en: 'Our Services' },
  serviceDigitalMarketing: { ar: 'التسويق الرقمي وإدارة الحملات', en: 'Digital Marketing & Ads' },
  serviceBrandStrategy: { ar: 'استراتيجيات الهوية والعلامات التجارية', en: 'Brand Strategy & Identity' },
  serviceEcommerce: { ar: 'حلول المتاجر والربط التقني', en: 'E-Commerce Solutions' },
  serviceAnalytics: { ar: 'تحليل الأداء ونمو المبيعات', en: 'Growth Analytics & SEO' },
  contactUs: { ar: 'تواصل معنا', en: 'Contact Us' },
  allRightsReserved: { ar: 'جميع الحقوق محفوظة © فوردر للخدمات التسويقية والتجارة الإلكترونية', en: 'All rights reserved © Vorder Marketing Agency & E-Commerce' },
  switchLanguage: { ar: 'English', en: 'العربية' }
};

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, defaultFallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'vorder_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
    // Default to Arabic since client requested Arabic & English with Arabic primary request
    return 'ar';
  });

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    if (lang === 'ar') {
      document.body.classList.add('lang-ar');
      document.body.classList.remove('lang-en');
    } else {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-ar');
    }
  }, [lang, dir]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, defaultFallback?: string): string => {
    const item = translations[key];
    if (item && item[lang]) return item[lang];
    return defaultFallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
