import { api, call } from './client';
import type { ApiResult, PaymentDto } from './types';

export const paymentApi = {
  processPayment: (orderId: string, amount: number, paymentMethod: string) =>
    call<PaymentDto>(api.post<unknown>('/api/Payment/ProcessPayment', { orderId, amount, paymentMethod })),

  getOrderPayments: (orderId: string) =>
    call<PaymentDto[]>(api.get<unknown>(`/api/Payment/GetOrderPayments/${orderId}`)),
};
