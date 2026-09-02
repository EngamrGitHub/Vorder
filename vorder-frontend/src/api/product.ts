import { api, call } from './client';
import type { ApiResult, ProductDto } from './types';

const tenantHeaders = (shopId?: string) => (shopId ? { 'X-Shop-ID': shopId } : undefined);

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  sku: string;
  brand: string;
  model: string;
  subCategoryId: string;
  isPhysical: boolean;
  applyDiscount: boolean;
  discountPercent: number;
  discountPrice: number;
  image?: File | null;
  imageUrl?: string; // existing image name (required when updating without new file)
}

function toForm(p: ProductInput, forUpdate: boolean): FormData {
  const fd = new FormData();
  fd.append('Name', p.name);
  fd.append('Description', p.description);
  fd.append('Price', String(p.price));
  fd.append('StockQuantity', String(p.stockQuantity));
  fd.append('SKU', p.sku);
  fd.append('Brand', p.brand);
  fd.append('Model', p.model);
  fd.append('SubCategoryId', p.subCategoryId);
  fd.append('isPhysical', String(p.isPhysical));
  fd.append('ApplyDiscount', String(p.applyDiscount));
  fd.append('DiscountPercent', String(p.discountPercent));
  fd.append('DiscountPrice', String(p.discountPrice));
  if (p.image) fd.append('Image', p.image);
  if (forUpdate && p.imageUrl) fd.append('ImageUrl', p.imageUrl);
  return fd;
}

export const productApi = {
  getProducts: (shopId?: string) =>
    call<ProductDto[]>(api.get<unknown>('/api/Product/GetProducts', { headers: tenantHeaders(shopId) })),

  getPaginatedProducts: (pageNumber: number, pageSize: number, shopId?: string) =>
    call<ProductDto[]>(
      api.get<unknown>(`/api/Product/GetPaginatedProducts?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
        headers: tenantHeaders(shopId),
      }),
    ),

  getProductById: (productId: string) =>
    call<ProductDto>(api.get<unknown>(`/api/Product/GetProductByID?ProductID=${productId}`)),

  // [FromForm] — multipart with optional Image file
  createProduct: (input: ProductInput, shopId?: string) =>
    call<ProductDto>(
      api.post<unknown>('/api/Product/CreateProduct', toForm(input, false), { headers: tenantHeaders(shopId) }),
    ),

  // PATCH — multipart (UpdateProductDto contains IFormFile → form binding)
  updateProduct: (id: string, input: ProductInput) =>
    call<ProductDto>(api.patch<unknown>(`/api/Product/UpdateProduct/${id}`, toForm(input, true))),

  deleteProduct: (id: string) => call<string>(api.delete<unknown>(`/api/Product/DeleteProduct/${id}`)),
};
