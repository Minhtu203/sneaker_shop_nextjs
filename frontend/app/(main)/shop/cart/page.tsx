/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useUserState } from '@/store/userState';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { deleteProductFromCart, getProductInCart } from '../../action';
import { createAxios } from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { formatVND } from '@/lib/utils';
import { ICart } from '@/types/cart';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IShoe } from '@/types';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

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
  const [checkout, setCheckout] = useState<ICart[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // get all items from cart
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
      setIsDeleting(true);
      const params = { productId, color, size };
      const res = await deleteProductFromCart({
        axiosJWT,
        accessToken: userInfo?.accessToken || '',
        params,
      });
      removeLocal(params); // reload all items in cart when remove
      toast.success(res?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // total price checkout
  const totalPrice = useMemo(() => {
    return checkout.reduce((sum, item) => sum + Number(item.price), 0);
  }, [checkout]);

  console.log(2222, checkout);

  return (
    <div className="flex flex-row p-4 gap-4">
      <div className="flex flex-col gap-4 w-2/3">
        <AnimatePresence mode="popLayout">
          {cartItems?.map((item, index) => {
            const uniqueKey = `${item?.productId?._id}-${item?.size}`;
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
                    handleRemoveItem({
                      productId: item?.productId?._id,
                      color: item?.color?.colorName,
                      size: item?.size,
                    })
                  }
                  checkout={checkout}
                  setCheckout={setCheckout}
                  isDeleting={isDeleting}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* check out */}
      <div className="w-1/3 pt-4">
        <div className="w-full bg-light rounded-2xl p-4 flex flex-col gap-3">
          <Textz className="text-3xl font-bold mb-6">Check out</Textz>
          <AnimatePresence mode="popLayout">
            {checkout?.map((item, index) => {
              const uniqueKey = `${item?.productId?._id}-${item?.size}`;

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
                  <CardShoesCheckout data={item} key={item?.productId?._id} setCheckout={setCheckout} />
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="w-full flex items-center justify-center my-8">
            <i className="w-4/5 bg-(--gray) rounded-2xl h-px"></i>
          </div>

          <Textz className="text-xl font-bold">Total: {formatVND(totalPrice)}</Textz>
        </div>
      </div>
    </div>
  );
}

interface CardCartProps {
  className?: string;
  data: ICart;
  handleRemoveItem: () => void;
  checkout: ICart[];
  setCheckout: React.Dispatch<React.SetStateAction<ICart[]>>;
  isDeleting: boolean;
}
const CardCart = ({ className, data, handleRemoveItem, checkout, setCheckout, isDeleting }: CardCartProps) => {
  return (
    <div
      className={`${className} md:h-42 w-full bg-(--light) rounded-2xl grid grid-cols-7 items-center px-4 py-4 md:py-2 gap-4 transition-all duration-300 ease-in-out`}
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
      <div className="flex flex-row md:flex-col md:col-span-1 col-span-4 gap-2 w-full">
        <ButtonCustom
          onClick={() => setCheckout((prev: ICart[]) => [...prev, data])}
          className="bg-(--primary-color)"
          label="Checkout"
        />
        <ButtonCustom
          onClick={() => {
            handleRemoveItem();
          }}
          className="bg-red-800"
          label={'Remove'}
          disabled={isDeleting}
        />
      </div>
    </div>
  );
};

interface CardShoesCheckoutProps {
  className?: string;
  data: ICart;
  handleRemoveItemFromCheckout?: () => void;
  setCheckout: React.Dispatch<React.SetStateAction<ICart[]>>;
}
const CardShoesCheckout = ({ className, data, setCheckout }: CardShoesCheckoutProps) => {
  return (
    <div
      className={`${className} md:h-42 w-full bg-(--light) rounded-2xl grid grid-cols-7 items-center relative group
        px-4 py-4 md:py-2 gap-4 transition-all duration-300 ease-in-out border border-(--primary-color) hover:scale-105`}
    >
      <Button
        className="text-(--primary-color) absolute right-0 top-0 hidden group-hover:block"
        onClick={() =>
          setCheckout((prev: ICart[]) =>
            prev.filter((item) => {
              return item?.productId?._id !== data?.productId?._id || item?.size !== data?.size;
            })
          )
        }
      >
        <X />
      </Button>
      <Image
        alt="Shoes"
        src={data?.color?.img?.[0]}
        width={100}
        height={100}
        className="col-span-2 object-cover rounded-2xl cursor-pointer"
      />
      <Textz className="text-[0.9rem] col-span-2">
        Price: {` `}
        {formatVND(Number(data?.price))}
      </Textz>
      <Textz className="text-[0.9rem]">Size: {data?.size}</Textz>
      <Textz className="text-[0.9rem] ml-2 hidden md:flex">Quantity: {data?.quantity}</Textz>
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
