import { UserInfo, useUserState } from '@/store/userState';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: (status) => {
    return status < 500;
  },
});

export const postData = (url: string, params?: unknown) => {
  return axiosInstance.post(url, params);
};

const refreshToken = async () => {
  try {
    const res = await postData('/api/auth/refreshToken');
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Refresh failed:', err.response?.data?.message || err.message);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let refreshTokenPromise: Promise<any> | null = null;

export const createAxios = (userInfo: UserInfo | null, setUserInfo: (data: UserInfo | null) => void) => {
  const newInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  newInstance.interceptors.request.use(
    async (config) => {
      if (!userInfo?.accessToken) return config;

      const date = new Date();
      const decodedToken = jwtDecode<JwtPayload>(userInfo.accessToken);

      if (decodedToken.exp && decodedToken.exp < date.getTime() / 1000 + 10) {
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshToken();
        }

        const data = await refreshTokenPromise;
        refreshTokenPromise = null;

        if (data) {
          const refreshUser = {
            ...userInfo,
            accessToken: data.accessToken,
          };
          setUserInfo(refreshUser);
          config.headers['token'] = `Bearer ${data.accessToken}`;
        }
      } else {
        config.headers['token'] = `Bearer ${userInfo.accessToken}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  newInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        toast.warning('Please sign in to continue.');
        const { clearUserInfo } = useUserState.getState();
        clearUserInfo();
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );

  return newInstance;
};
