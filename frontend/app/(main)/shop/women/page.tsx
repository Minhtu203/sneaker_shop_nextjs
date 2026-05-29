'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from '@/components/layout/Footer';
import CardShoes from '@/components/ui/CardShoes';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getShoesWithGender } from '../../action';
import { useUserState } from '@/store/userState';

export default function Women() {
  const { userInfo, setUserInfo } = useUserState();

  const { data: womenShoes = [], isLoading } = useQuery({
    queryKey: ['shoes'],
    queryFn: async () => {
      const res = await getShoesWithGender({ gender: 'Women' });
      return res.data;
    },
    enabled: !!userInfo?._id,
  });

  return (
    <div className="flex flex-col px-6 md:px-18 md:py-8">
      {/* list shoes */}
      <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-4">
        {womenShoes?.slice(0, 90).map((shoe: any) => (
          <CardShoes key={shoe?._id} shoeData={shoe} />
        ))}
      </div>

      {/* footer */}
      <Footer className="md:flex hidden" />
    </div>
  );
}
