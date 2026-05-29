'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';

import logo from '@/public/logoShoes.png';
import Link from 'next/link';

export const CardShoesSearch = ({ item }: any) => {
  //   console.log(2222, item.colors);

  return (
    <Link href={`/shop/products/${item?._id}`} className="flex flex-row gap-2 hover:bg-gray-300 py-2 px-3 rounded-xl">
      <Image
        priority
        className="w-auto h-auto object-cover rounded-xl"
        src={item?.colors?.[0]?.img?.[0] || logo}
        alt="Shoes"
        width={40}
        height={40}
      />
      <div className="flex flex-col gap-1">
        <span className="text-primary-color text-sm">{item?.name}</span>
        <div className="flex flex-row gap-1">
          {item.colors.map((c: any) => (
            <div key={c?._id} className={`w-2 h-3 rounded-2xl`} style={{ backgroundColor: c?.color || '#ccc' }} />
          ))}
        </div>
      </div>
    </Link>
  );
};
