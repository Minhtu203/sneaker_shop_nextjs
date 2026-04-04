/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ButtonV2, ButtonV2OutLine } from '@/components/ui/Button';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import dynamic from 'next/dynamic';
import { getIsFeaturedShoes } from './action';
import React, { useEffect, useState } from 'react';
import CardShoes from '@/components/ui/CardShoes';
import Footer from '@/components/layout/Footer';

const ShoeViewerNoSSR = dynamic(() => import('@/components/ui/ShoesViewer').then((mod) => mod.ShoeViewer), {
  ssr: false,
});

export default function Home() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  //all shoes
  const [allShoes, setAllShoes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getIsFeaturedShoes();

        setAllShoes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="flex flex-col px-18 py-8">
      <div className="h-140 w-full flex flex-row">
        {/* background */}
        <h1 className="absolute font-black text-[10rem] pr-45 right-0 [text-stroke:2px_white] text-transparent [-webkit-text-stroke:2px_gray] rotate-270">
          NIKE
        </h1>

        <div className="w-3/10 h-full flex flex-col justify-center text-6xl gap-4">
          <TextV1>
            Nike Air Max
            <br /> Pre-Day
          </TextV1>
          <h2 className="text-[1.3rem]">(4.5)</h2>
          <h2 className="text-2xl font-bold flex flex-row gap-4">
            $143.99 <span className="text-gray-400 line-through">$163.99</span>
          </h2>
          <div className="flex flex-row gap-4">
            <ButtonV2 onClick={() => console.log(11111)}>Add to Cart</ButtonV2>
            <ButtonV2OutLine>View Details</ButtonV2OutLine>
          </div>
        </div>

        <div className="w-7/10 h-full">
          <ShoeViewerNoSSR />
        </div>
      </div>

      {/* list shoes */}
      <div className="w-full grid grid-cols-3 gap-4">
        {allShoes?.slice(0, 90).map((shoe: any) => (
          <CardShoes key={shoe?._id} shoeData={shoe} />
        ))}
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export const TextV1 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`${className} font-bold italic text-(--secondary-color)`}>{children}</h2>;
};
