/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { toast } from 'sonner';

// GET SHOES
//get is featured shoes
export const getIsFeaturedShoes = async () => {
  try {
    const res = await axiosInstance.get('/api/shoes/getIsFeaturedShoes?isFeatured=true');
    return res.data;
  } catch (error: any) {
    return error.response.message || 'Get is featured shoes failed.';
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

// search shoes api
export const searchShoesApi = async (keyword: string) => {
  try {
    const res = await axiosInstance.get(`/api/shoes/search?keyword=${keyword}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Search shoes failed.' };
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

// get items from favourite
export const getItemsFavourite = async ({
  axiosJWT,
  accessToken,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
}) => {
  try {
    const res = await axiosJWT.get('/api/favourite/getUserFavourites', {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.message || 'Get items favourite failed.';
  }
};

// remove items from favourite
export const UnFavouriteItemAction = async ({
  axiosJWT,
  accessToken,
  productId,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  productId: string;
}) => {
  try {
    const res = await axiosJWT.post(
      '/api/favourite/delete',
      { productId },
      { headers: { token: `Bearer ${accessToken}` } }
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.message || 'Unfavourite product failed.';
  }
};

// get shoes with gender
export const getShoesWithGender = async ({ gender }: { gender: string }) => {
  try {
    const res = await axiosInstance.get(`/api/shoes/getShoesWithGender?gender=${gender}&gender=Unisex`);
    return res.data;
  } catch (error: any) {
    console.error('Get shoes with gender failed with error: ', error);
    return { success: false, message: 'Get shoes with gender failed.' };
  }
};

// PAYMENT

// create order
export const createOrderApi = async ({
  axiosJWT,
  accessToken,
  data,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  data: any;
}) => {
  try {
    const res = await axiosJWT.post('/api/order/createOrder', data, { headers: { token: `Bearer ${accessToken}` } });
    return res.data;
  } catch (error: any) {
    console.error('Create order failed.', error);
    return { success: false, message: 'Create order failed.' };
  }
};

// PROFILE
//upload avatar
export const uploadAvatarApi = async ({
  axiosJWT,
  accessToken,
  data,
}: {
  axiosJWT: AxiosInstance;
  accessToken: string;
  data: any;
}) => {
  try {
    const res = await axiosJWT.post('/api/user/avatar', data, {
      headers: { token: `Bearer ${accessToken}` },
    });

    return res;
  } catch (error: any) {
    console.error('Lỗi khi upload:', error);
    throw error;
  }
};
