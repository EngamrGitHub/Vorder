import { api, call } from './client';
import type { ApiResult, CategoryDto } from './types';

// Shop-scoped calls pass the tenant explicitly via X-Shop-ID header
// (mirrors CurrentUserService header fallback on the API).
const tenantHeaders = (shopId?: string) => (shopId ? { 'X-Shop-ID': shopId } : undefined);

export interface CategoryInput {
  name: string;
  nameAr?: string;
  description?: string;
  appearsInHeader?: boolean;
  isFeatured?: boolean;
  color?: string;
}

export const categoryApi = {
  getCategories: (shopId?: string) =>
    call<CategoryDto[]>(api.get<unknown>('/api/Category/GetCategories', { headers: tenantHeaders(shopId) })),

  getPaginatedCategories: (pageNumber: number, pageSize: number, shopId?: string) =>
    call<CategoryDto[]>(
      api.get<unknown>(`/api/Category/GetPaginatedCategories?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
        headers: tenantHeaders(shopId),
      }),
    ),

  getCategoryById: (categoryId: string) =>
    call<CategoryDto>(api.get<unknown>(`/api/Category/GetCategoryByID?CategoryID=${categoryId}`)),

  // [FromForm] on the API — send as multipart
  createCategory: (input: CategoryInput, shopId?: string) => {
    const fd = new FormData();
    fd.append('Name', input.name);
    if (input.nameAr) fd.append('NameAr', input.nameAr);
    if (input.description) fd.append('Description', input.description);
    if (input.appearsInHeader !== undefined) fd.append('AppearsInHeader', String(input.appearsInHeader));
    if (input.isFeatured !== undefined) fd.append('IsFeatured', String(input.isFeatured));
    if (input.color) fd.append('Color', input.color);
    return call<CategoryDto>(
      api.post<unknown>('/api/Category/CreateCategory', fd, { headers: tenantHeaders(shopId) }),
    );
  },

  // PATCH — UpdateCategoryDto has no IFormFile → JSON body
  updateCategory: (id: string, input: CategoryInput) =>
    call<CategoryDto>(api.patch<unknown>(`/api/Category/UpdateCategory/${id}`, {
      name: input.name,
      nameAr: input.nameAr ?? null,
      description: input.description ?? null,
      appearsInHeader: input.appearsInHeader ?? false,
      isFeatured: input.isFeatured ?? false,
      color: input.color ?? null,
    })),

  deleteCategory: (id: string) => call<string>(api.delete<unknown>(`/api/Category/DeleteCategory/${id}`)),
};
