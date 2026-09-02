import { api, call } from './client';
import type { ApiResult, OrderDto } from './types';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  shippingAddressLine: string;
  shippingCity: string;
  shippingProvince?: string;
  shippingCountry: string;
  shippingPostalCode?: string;
}

export const orderApi = {
  createOrder: (input: CreateOrderInput) =>
    call<OrderDto>(api.post<unknown>('/api/Order/CreateOrder', input)),

  getOrderById: (id: string) => call<OrderDto>(api.get<unknown>(`/api/Order/GetOrderById/${id}`)),
};
