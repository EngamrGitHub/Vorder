import { api, call } from './client';
import type { ApiResult, ReviewDto } from './types';

export const reviewApi = {
  createReview: (productId: string, rating: number, customerReview?: string) =>
    call<ReviewDto>(api.post<unknown>('/api/Review/CreateReview', { productId, rating, customerReview })),

  getProductReviews: (productId: string) =>
    call<ReviewDto[]>(api.get<unknown>(`/api/Review/GetProductReviews/${productId}`)),
};
