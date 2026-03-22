/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { ShoeGallery } from './ShoesGallery';
import { TextV1 } from '@/app/(main)/page';
import { IColor, IShoe, ISize } from '@/types';
import { ButtonV2, ButtonV2OutLine } from './Button';
import { formatVND } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { addToCart, addToFavourite } from '@/app/(main)/action';
import { axiosInstance, createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductView({ shoe }: { shoe: any }) {
  const [currentColor, setCurrentColor] = useState<IColor>(shoe?.colors?.[0]);
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);
  const [selectSize, setSelectSize] = useState(Number || null);

  if (!shoe) {
    return <div className="w-full justify-center">Can not found any product</div>;
  }

  // handle add product to cart
  const handleAddProductToCart = async () => {
    try {
      const res = await addToCart({
        productId: shoe?._id,
        color: currentColor?.colorName,
        size: selectSize,
        quantity: 1,
        axiosJWT,
        accessToken: userInfo?.accessToken || '',
      });
      toast.success(res?.message);
    } catch (err: any) {
      toast?.error(err?.message || 'Add product to cart failed.');
    }
  };

  // handle add product to favourite
  const handleAddProductToFavourite = async () => {
    try {
      const res = await addToFavourite({ productId: shoe?._id, axiosJWT, accessToken: userInfo?.accessToken || '' });
      toast.success(res?.message);
    } catch (error: any) {
      toast?.error(error?.message || 'Something wrong!!');
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row pt-12 items-start md:px-0 md:gap-4 gap-8">
      <div className="md:w-1/2 sticky top-12">
        <ShoeGallery images={currentColor?.img} />
      </div>
      <div className="md:w-1/2 my-20 flex flex-col pr-90">
        <TextV1 className="text-4xl">{shoe?.name}</TextV1>
        <span className="text-gray-300 text-sm uppercase tracking-widest font-bold">{shoe?.brand}</span>
        <span className="font-bold text-md text-black]">{formatVND(Number(shoe?.price) || 0)}</span>

        {/* color change */}
        <div className="flex flex-row gap-2 my-3 mb-12">
          {shoe?.colors?.map((d: IColor, index: number) => (
            <button
              onClick={() => setCurrentColor(d)}
              key={index}
              className="w-10 h-10 rounded-md hover:scale-110 transition-all"
              style={{ backgroundColor: d?.color }}
            />
          ))}
        </div>

        {/* size guide */}
        <div className="flex flex-row">
          <TextV1 className="text-gray-400 mb-2 font-bold text-md">Select Size</TextV1>
          <TextV1 className="text-gray-400 mb-2 font-bold text-md hover:underline ml-auto">Size Guide</TextV1>
        </div>

        {/* shoes size */}
        <div className="grid grid-cols-3 gap-4">
          {currentColor?.sizes?.map((size: ISize, index: number) => (
            <ButtonV2OutLine key={index} onClick={() => setSelectSize(size?.size)}>
              {size?.size}
            </ButtonV2OutLine>
          ))}
        </div>

        {/* button add to cart, add to favourites */}
        <div className="w-full my-12 flex flex-col gap-4">
          <ButtonV2 className="w-full h-12 rounded-4xl" onClick={() => handleAddProductToCart()}>
            Add to Bag
          </ButtonV2>
          <ButtonV2OutLine className="w-full h-12 rounded-4xl relative" onClick={() => handleAddProductToFavourite()}>
            Favourite <Heart className="absolute right-2 top-1/4" size={22} />
          </ButtonV2OutLine>
        </div>

        {/* description */}
        <span className="text-gray-300 text-base leading-relaxed font-light">{shoe?.description}</span>
      </div>
    </div>
  );
}
