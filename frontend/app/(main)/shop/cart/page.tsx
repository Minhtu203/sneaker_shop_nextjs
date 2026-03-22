/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useUserState } from '@/store/userState';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { deleteProductFromCart, getProductInCart } from '../../action';
import { createAxios } from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { formatVND } from '@/lib/utils';
import { ICart } from '@/types/cart';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  // rename tab
  useEffect(() => {
    document.title = 'Cart | SneakerT';
    return () => {
      document.title = 'SneakerT';
    };
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);
  const { cartItems, setCartItems, removeLocal } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) {
        const res = await getProductInCart({ axiosJWT, accessToken: userInfo?.accessToken || '' });
        setCartItems(res?.cartItems?.items);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  //remove item from cart
  const handleRemoveItem = async ({ productId, color, size }: { productId: string; color: string; size: number }) => {
    try {
      const params = { productId, color, size };
      const res = await deleteProductFromCart({
        axiosJWT,
        accessToken: userInfo?.accessToken || '',
        params,
      });
      removeLocal(params); // reload all items in cart when remove
      toast.success(res?.message);
    } catch (error: any) {
      toast.error('Remove item failed.');
      console.error('Remove item failed.', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-12 py-4">
      {/* animation cart page */}
      <AnimatePresence mode="popLayout">
        {cartItems?.map((item, index) => {
          const uniqueKey = ` ${item?.productId?._id}-${item?.size}`;
          return (
            <motion.div
              key={uniqueKey}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                x: -100,
                height: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                overflow: 'hidden',
              }}
              transition={{ duration: 0.3 }}
            >
              <CardCart
                data={item}
                key={index}
                handleRemoveItem={() =>
                  handleRemoveItem({ productId: item?.productId?._id, color: item?.color?.colorName, size: item?.size })
                }
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

type CardCartProps = {
  className?: string;
  data: ICart;
  handleRemoveItem: () => void;
  // setCheckout?: Dispatch<SetStateAction<IShoe[]>>;
};
const CardCart = ({ className, data, handleRemoveItem, setCheckout }: CardCartProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // const onClickRemove = async () => {
  //   setIsDeleting(true);
  //   setTimeout(() => {
  //     handleRemoveItem();
  //   }, 300);
  // };

  return (
    <div
      className={`${className} md:h-42 w-full bg-white rounded-2xl grid grid-cols-9 items-center px-4 py-4 md:py-2 gap-4 transition-all duration-300 ease-in-out 
      `}
      // ${
      //   isDeleting
      //     ? 'opacity-0 -translate-x-full scale-95 h-0 mb-0 overflow-hidden'
      //     : 'opacity-100 translate-x-0 h-auto mb-4'
      // }
    >
      <Link href={`/shop/products/${data?.productId?._id ? data?.productId?._id : data?.productId}`}>
        <Image
          alt="Shoes"
          src={data?.color?.img?.[0]}
          width={100}
          height={100}
          className="col-span-2 object-cover rounded-2xl cursor-pointer"
        />
      </Link>
      <div className="flex flex-col">
        <Textz>{data?.name}</Textz>
        <Textz className="text-xs">{data?.brand}</Textz>
      </div>
      <Textz className="text-[0.9rem] col-span-2">
        Price: {` `}
        {formatVND(Number(data?.price))}
      </Textz>
      <Textz className="text-[0.9rem]">Size: {data?.size}</Textz>
      <Textz className="text-[0.9rem] ml-2 hidden md:flex">Quantity: {data?.quantity}</Textz>
      <Textz className="text-[0.9rem] ml-2 md:hidden">Q: {data?.quantity}</Textz>
      {/* <span className="text-[0.9rem] ml-2 flex">Date added: {formattedDate(data?.createdAt, 'day/month')}</span> */}

      <br className="md:hidden flex" />
      <div className="flex flex-row md:flex-col md:col-span-1 col-span-4 gap-2">
        <ButtonCustom
          // onClick={() => setCheckout((prev) => [...prev, data])}
          className="bg-(--primary-color)"
          label="Checkout"
        />
        <ButtonCustom
          onClick={() => {
            handleRemoveItem();
            // handleRemoveItem();
          }}
          className="bg-red-800"
          label={isDeleting ? 'Deleting...' : 'Remove'}
          disabled={isDeleting}
        />
      </div>
    </div>
  );
};

const ButtonCustom = ({ className, label, ...props }: any) => {
  return (
    <button
      className={`${className} w-20 h-10 outline-none border-none flex items-center justify-center text-xs font-bold rounded-md`}
      {...props}
    >
      {label}
    </button>
  );
};

const Textz = ({ className, ...props }: any) => {
  return (
    <span className={`${className} text-md text-(--primary-color)`} {...props}>
      {props.children}
    </span>
  );
};
