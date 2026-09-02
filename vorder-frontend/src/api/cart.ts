import { api, call } from './client';
import type { ApiResult, CartItemDto } from './types';

export const cartApi = {
  addToCart: (productId: string, quantity: number) =>
    call<string>(api.post<unknown>('/api/ShoppingCart/AddToCart', { productId, quantity })),

  getMyCart: () => call<CartItemDto[]>(api.get<unknown>('/api/ShoppingCart/GetMyCart')),
};
