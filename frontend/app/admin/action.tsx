/* eslint-disable @typescript-eslint/no-explicit-any */
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

// GET ALL USERS API
export const getAllUser = async ({ axiosJWT, accessToken }: { axiosJWT: AxiosInstance; accessToken: string }) => {
  try {
    const res = await axiosJWT.get('/api/user/allusers', { headers: { token: `Bearer ${accessToken}` } });
    return res.data;
  } catch (error: any) {
    throw error?.response?.messenge || 'Get all users failed.';
  }
};
