import { api, call } from './client';
import type { ApiResult, JwtTokenModel, RefreshTokenResult, UserDto } from './types';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export const authApi = {
  register: (p: RegisterPayload) =>
    call<UserDto>(api.post<unknown>('/api/Authentication/Register', p)),

  confirmEmail: (userId: string, confirmationToken: string) =>
    call<string>(api.post<unknown>('/api/Authentication/ConfirmEmail', { userId, confirmationToken })),

  login: (email: string, password: string) =>
    call<JwtTokenModel>(api.post<unknown>('/api/Authentication/Login', { email, password })),

  googleLogin: (googleToken: string) =>
    call<JwtTokenModel>(api.post<unknown>(`/api/Authentication/GoogleLogin?token=${encodeURIComponent(googleToken)}`)),

  refreshToken: (userId: string, refreshToken: string) =>
    call<RefreshTokenResult>(api.post<unknown>('/api/Authentication/RefreshToken', { userId, refreshToken })),

  forgotPassword: (email: string) =>
    call<string>(api.post<unknown>(`/api/Authentication/ForgotPassword?Email=${encodeURIComponent(email)}`)),

  resetPassword: (email: string, resetToken: string, newPassword: string) =>
    call<string>(api.post<unknown>('/api/Authentication/ResetPassword', { email, resetToken, newPassword })),

  resendConfirmation: (email: string) =>
    call<string>(api.get<unknown>(`/api/Authentication/ResendConfirmationEmail?Email=${encodeURIComponent(email)}`)),
};
