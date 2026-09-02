import { api, call } from './client';
import type { ApiResult, SubCategoryDto } from './types';

const tenantHeaders = (shopId?: string) => (shopId ? { 'X-Shop-ID': shopId } : undefined);

export interface SubCategoryInput {
  categoryId: string;
  name: string;
  nameAr?: string;
  description?: string;
  isFeatured?: boolean;
}

export const subCategoryApi = {
  getSubCategories: (shopId?: string) =>
    call<SubCategoryDto[]>(api.get<unknown>('/api/SubCategory/GetSubCategories', { headers: tenantHeaders(shopId) })),

  getPaginatedSubCategories: (pageNumber: number, pageSize: number, shopId?: string) =>
    call<SubCategoryDto[]>(
      api.get<unknown>(
        `/api/SubCategory/GetPaginatedSubCategories?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        { headers: tenantHeaders(shopId) },
      ),
    ),

  getSubCategoryById: (subCategoryId: string) =>
    call<SubCategoryDto>(api.get<unknown>(`/api/SubCategory/GetSubCategoryByID?SubCategoryID=${subCategoryId}`)),

  getSubCategoryByCategoryId: (categoryId: string) =>
    call<SubCategoryDto[]>(api.get<unknown>(`/api/SubCategory/GetSubCategoryByCategoryID?CategoryID=${categoryId}`)),

  // JSON body ([FromBody] on the API)
  createSubCategory: (input: SubCategoryInput, shopId?: string) =>
    call<SubCategoryDto>(
      api.post<unknown>('/api/SubCategory/CreateSubCategory', input, { headers: tenantHeaders(shopId) }),
    ),

  updateSubCategory: (id: string, input: SubCategoryInput) =>
    call<SubCategoryDto>(api.patch<unknown>(`/api/SubCategory/UpdateSubCategory/${id}`, input)),

  deleteSubCategory: (id: string) => call<string>(api.delete<unknown>(`/api/SubCategory/DeleteSubCategory/${id}`)),
};
