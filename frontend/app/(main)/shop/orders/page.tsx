'use client';

import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Orders() {
  // rename tab
  useEffect(() => {
    document.title = 'Cart | SneakerT';
    return () => {
      document.title = 'SneakerT';
    };
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);
  const router = useRouter();

  // call api get user's order
  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) {
        // api get orders
      } else {
        router.push('/');
      }
    };
    fetchData();
  }, [userInfo]);

  return <div>Orders page</div>;
}
