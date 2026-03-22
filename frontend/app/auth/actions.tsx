// 'use server';

import { postData } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { AxiosInstance } from 'axios';

// LOG IN
interface LoginPayload {
  username: string;
  password: string;
}

export async function LoginAction(data: LoginPayload) {
  try {
    const res = await postData('/api/auth/login', data);
    // console.log(222, res.data.data.data);

    return res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      asdf: 'asdfasdf',
      success: false,
      message: error.message || 'Something went wrong!',
    };
  }
}

// REGISTER

// FORGOT PASSWORD
