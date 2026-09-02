// ---------- Shared API DTO types (mirror the Vorder WebAPI contracts) ----------

export interface ApiResult<T> {
  errorMsg: string | null;
  errorCode: string | null;
  isSuccess: boolean;
  result: T | null;
}

export interface UserDto {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
}

export interface JwtTokenModel {
  token: string;
  refreshToken: string;
  tokenExpiryHours?: number;
  tokenExpiration?: string;
  refreshTokenExpiryHours?: number;
  refreshTokenExpiration?: string;
}

export interface RefreshTokenResult {
  token: string;
  expiryHours?: number;
  expiration?: string;
}

export interface ShopDto {
  id: string;
  ownerId?: string | null;
  name?: string | null;
  nameAr?: string | null;
  slug?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  whatsappNumber?: string | null;
  website?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export interface CategoryDto {
  id: string;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  appearsInHeader: boolean;
  iconUrl?: string | null;
  imageUrl?: string | null;
  color?: string | null;
  isFeatured: boolean;
  shopID: string;
}

export interface SubCategoryDto {
  id: string;
  categoryId: string;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  isFeatured: boolean;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  applyDiscount: boolean;
  discountPercent: number;
  discountPrice: number;
  stockQuantity: number;
  sku: string;
  brand: string;
  model: string;
  imageUrl: string;
  isPhysical: boolean;
  shopID: string;
  categoryId: string;
  subCategoryId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdDate?: string | null;
}

export interface CartItemDto {
  id: string;
  productId: string;
  productName: string | null;
  unitPrice: number | null;
  quantity: number;
}

export interface OrderDto {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: string | null;
  items: { productId: string; productName: string | null; quantity: number; unitPrice: number }[];
  shippingAddressLine: string;
  shippingCity: string;
  shippingCountry: string;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
}

export interface ReviewDto {
  id: string;
  productId: string;
  customerReview: string | null;
  rating: number;
  userFullName: string | null;
}

export interface AddressDto {
  id: string;
  addressType: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  province?: string | null;
  country: string;
  postalCode?: string | null;
}
