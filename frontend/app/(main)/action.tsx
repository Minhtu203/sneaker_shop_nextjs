/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { toast } from 'sonner';

// GET SHOES
//get is featured shoes
export const getIsFeaturedShoes = async () => {
  try {
    const res = await axiosInstance.get('/api/shoes/getIsFeaturedShoes');
    return res?.data;
  } catch (error: any) {
    return error.response.message || 'get is featured shoes failed.';
  }
};

//get all shoes
export const getAllShoes = async () => {
  try {
    const res = await axiosInstance.get('/api/shoes/getAllShoes');
    return res.data;
  } catch (error) {
    return error;
  }
};
// get Nike shoes
export const getNikeShoes = async ({
  axiosJWT,
  accessToken,
  userId,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  userId: string;
}) => {
  try {
    const res = await axiosJWT.get('/api/shoes/getNikeShoes', {
      params: { userId },
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
// get shoes by id
export const getShoesById = async (id: string) => {
  try {
    const res = await axiosInstance.post('/api/shoes/getShoesById', { id });
    return res.data;
  } catch (error) {
    return error;
  }
};

//
// CART
// add product to cart
export const addToCart = async ({
  productId,
  color,
  size,
  quantity,
  axiosJWT,
  accessToken,
}: {
  productId: string;
  color: string;
  size: number;
  quantity: number;
  axiosJWT: AxiosInstance;
  accessToken: string;
}) => {
  try {
    const res = await axiosJWT.post(
      '/api/cart/add',
      {
        productId,
        color,
        size,
        quantity,
      },
      { headers: { token: `Bearer ${accessToken}` } }
    );
    return res?.data;
  } catch (error: any) {
    throw error.response?.message || 'Add product to cart failed.';
  }
};
//get product from cart
export const getProductInCart = async ({ axiosJWT, accessToken }: { axiosJWT: AxiosInstance; accessToken: string }) => {
  try {
    const res = await axiosJWT.get('/api/cart/getAllItems', { headers: { token: `Bearer ${accessToken}` } });
    return res?.data;
  } catch (error: any) {
    throw error.response?.message || 'Get product in bag failed.';
  }
};
//remove product from cart
export const deleteProductFromCart = async ({
  axiosJWT,
  accessToken,
  params,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  params: {
    productId: string;
    color: string;
    size: number;
  };
}) => {
  try {
    console.log(2222, params);

    const res = await axiosJWT.post('/api/cart/deleteItem', params, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.message || 'Delete product from cart failed.';
  }
};

//FAVOURITE
// add product to favourite
export const addToFavourite = async ({
  productId,
  axiosJWT,
  accessToken,
}: {
  productId: string;
  axiosJWT: AxiosInstance;
  accessToken: string;
}) => {
  try {
    const res = await axiosJWT.post(
      '/api/favourite/add',
      {
        productId,
      },
      { headers: { token: `Bearer ${accessToken}` } }
    );
    return res?.data;
  } catch (error: any) {
    throw error.response?.data || 'Something wrong!';
  }
};
