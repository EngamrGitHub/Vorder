import { api, call } from './client';
import type { ApiResult, ShopDto } from './types';

export interface ShopInput {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  whatsappNumber?: string;
  website?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: File | null;
  banner?: File | null;
  favicon?: File | null;
}

function toForm(s: ShopInput): FormData {
  const fd = new FormData();
  fd.append('Name', s.name);
  if (s.nameAr) fd.append('NameAr', s.nameAr);
  if (s.description) fd.append('Description', s.description);
  if (s.descriptionAr) fd.append('DescriptionAr', s.descriptionAr);
  if (s.whatsappNumber) fd.append('WhatsAppNumber', s.whatsappNumber);
  if (s.website) fd.append('Website', s.website);
  if (s.addressLine1) fd.append('AddressLine1', s.addressLine1);
  if (s.city) fd.append('City', s.city);
  if (s.state) fd.append('State', s.state);
  if (s.country) fd.append('Country', s.country);
  if (s.postalCode) fd.append('PostalCode', s.postalCode);
  if (s.logo) fd.append('Logo', s.logo);
  if (s.banner) fd.append('Banner', s.banner);
  if (s.favicon) fd.append('Favicon', s.favicon);
  return fd;
}

export interface CreateShopResult {
  shop: ShopDto;
  token: string;
}

export const shopApi = {
  getShops: () => call<ShopDto[]>(api.get<unknown>('/api/Shop/GetShops')),

  getPaginatedShops: (pageNumber: number, pageSize: number) =>
    call<ShopDto[]>(
      api.get<unknown>(`/api/Shop/GetPaginatedShops?PageNumber=${pageNumber}&PageSize=${pageSize}`),
    ),

  getShopById: (shopId: string) =>
    call<ShopDto>(api.get<unknown>(`/api/Shop/GetShopByID?shopID=${shopId}`)),

  createShop: (input: ShopInput) =>
    call<CreateShopResult>(api.post<unknown>('/api/Shop/CreateShop', toForm(input))),

  // PATCH — the API expects multipart/form-data for UpdateShop (DTO contains IFormFile)
  updateShop: (id: string, input: ShopInput) =>
    call<ShopDto>(api.patch<unknown>(`/api/Shop/UpdateShop/${id}`, toForm(input))),

  deleteShop: (id: string) => call<string>(api.delete<unknown>(`/api/Shop/DeleteShop/${id}`)),
};
