/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosInstance, postData } from '@/lib/axios';
import { AxiosInstance } from 'axios';

// LOG IN
export async function LoginAction(data: { username: string; password: string }) {
  try {
    const res = await postData('/api/auth/login', data);
    return res;
  } catch (error: any) {
    return error;
  }
}

// LOG OUT
export async function LogoutAction({
  userId,
  accessToken,
  axiosJWT,
}: {
  userId: string;
  accessToken: string;
  axiosJWT: AxiosInstance;
}) {
  try {
    const res = await axiosJWT.post('/api/auth/logout', { userId }, { headers: { token: `Bearer ${accessToken}` } });
    return { success: true, message: 'Logged out', res };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Something went wrong!',
    };
  }
}

// REGISTER
export async function RegisterAction(data: { username: string; password: string; email: string }) {
  try {
    const res = await axiosInstance.post('/api/auth/register', data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.message || 'Register account failed.';
  }
}

// FORGOT PASSWORD
export async function ForgottenPasswordAction(username: string) {
  try {
    const res = await axiosInstance.post('/api/auth/forgotPassword', username);
    return res.data;
  } catch (error: any) {
    throw error.response?.message || 'Something failed with function forgot password.';
  }
}
