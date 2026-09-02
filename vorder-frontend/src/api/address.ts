import { api, call } from './client';
import type { ApiResult, AddressDto } from './types';

export interface AddressInput {
  addressType: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province?: string;
  country: string;
  postalCode?: string;
}

export const addressApi = {
  addAddress: (input: AddressInput) =>
    call<AddressDto>(api.post<unknown>('/api/Address/AddAddress', input)),

  getUserAddresses: () => call<AddressDto[]>(api.get<unknown>('/api/Address/GetUserAddresses')),
};
