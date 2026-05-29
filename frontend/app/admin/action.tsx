/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import { AxiosInstance } from 'axios';

// update featured shoes
export const UpdateIsFeaturedShoes = async ({
  axiosJWT,
  accessToken,
  shoeId,
  isFeatured,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  shoeId: string;
  isFeatured: boolean;
}) => {
  try {
    const res = await axiosJWT.put(
      `/api/shoes/updateShoes/${shoeId}`,
      { isFeatured: isFeatured },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.message || 'Update shoes featured failed.';
  }
};

// CREATE SHOES API
export const createShoesApi = async ({
  axiosJWT,
  accessToken,
  data,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  data: any;
}) => {
  try {
    const res = await axiosJWT.post('/api/shoes/createShoes', data, { headers: { token: `Bearer ${accessToken}` } });
    console.log(2222, data);

    return res.data;
  } catch (error: any) {
    throw error?.response?.messenge || 'Create new shoes failed.';
  }
};

// DELETE SHOES API
export async function deleteShoeApi({
  axiosJWT,
  accessToken,
  shoeId,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  shoeId: string;
}) {
  try {
    const res = await axiosJWT.delete(`/api/shoes/deleteShoes/${shoeId}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.error('Delete shoe API error:', error);
    return { success: false, error };
  }
}

// === USER API ===

// GET ALL USERS API
export const getAllUser = async ({ axiosJWT, accessToken }: { axiosJWT: AxiosInstance; accessToken: string }) => {
  try {
    const res = await axiosJWT.get('/api/user/allusers', { headers: { token: `Bearer ${accessToken}` } });
    return res.data;
  } catch (error: any) {
    throw error?.response?.messenge || 'Get all users failed.';
  }
};

// DELETE USER API
export const deleteUserById = async ({
  axiosJWT,
  accessToken,
  userId,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  userId: string;
}) => {
  try {
    const res = await axiosJWT.delete(`/api/user/${userId}`, { headers: { token: `Bearer ${accessToken}` } });
    return res.data;
  } catch (error) {
    console.error('Delete user failed.', error);
    return { success: false, error };
  }
};

// ORDER ADMIN

// get all order
export const getAllOrders = async ({ axiosJWT, accessToken }: { axiosJWT: AxiosInstance; accessToken: string }) => {
  try {
    const res = await axiosJWT.get(`/api/order/getAllOrders`, { headers: { token: `Bearer ${accessToken}` } });
    // console.log(33333, res.data);

    return res.data;
  } catch (error) {
    console.error('Get all orders failed.', error);
    return { success: false, error };
  }
};

// update order
export const updateOrderApi = async ({
  axiosJWT,
  accessToken,
  orderId,
  data,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  orderId: string;
  data: object;
}) => {
  try {
    const res = await axiosJWT.post(`/api/order/update/${orderId}`, data, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.error('Get all orders failed.', error);
    return { success: false, error };
  }
};
