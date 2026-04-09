/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import React, { useEffect, useState } from 'react';
import { getItemsFavourite, UnFavouriteItemAction } from '../../action';
import { IShoe } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import CardShoes from '@/components/ui/CardShoes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Favourites() {
  // rename tab
  useEffect(() => {
    document.title = 'Favourite | SneakerT';
    return () => {
      document.title = 'SneakerT';
    };
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  const [allItems, setAllItems] = useState<IShoe[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.accessToken) {
        const res = await getItemsFavourite({ axiosJWT, accessToken: userInfo?.accessToken || '' });
        setAllItems(res?.fav);
      }
      // else {
      //   router.push('/');
      // }
    };
    fetchData();
  }, [userInfo]);

  const handleUnFavourite = async (shoeId: string) => {
    try {
      const res = await UnFavouriteItemAction({
        axiosJWT,
        accessToken: userInfo?.accessToken || '',
        productId: shoeId,
      });
      setIsLoading(true);
      toast.success(res?.message);
      console.log(res);
      if (res.success === true) {
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* list shoes */}
      <div className="w-full grid grid-cols-3">
        <AnimatePresence mode="popLayout">
          {allItems?.map((item, index) => {
            return (
              <motion.div
                key={index}
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
                className="p-4"
              >
                <CardShoes
                  shoeData={item?.productId}
                  isLoading={isLoading}
                  heart
                  heartClick={() => handleUnFavourite(item?.productId?._id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
