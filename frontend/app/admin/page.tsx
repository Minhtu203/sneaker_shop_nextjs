'use client';

import { DataTable } from '@/components/ui/DataTable';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import React, { useEffect, useState } from 'react';
import { getAllShoes } from '../(main)/action';
import { IShoe } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export default function AdminDashboard() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  const [allShoes, setAllShoes] = useState<IShoe[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllShoes();
        // const res1 = await getIsFeaturedShoes();
        // console.log(3333, res1);

        setAllShoes(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userInfo?._id]);

  const columns: ColumnDef<IShoe>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
    },
    {
      accessorKey: 'price',
      header: 'Price',
    },
    {
      accessorKey: 'isFeatured',
      header: 'Is Featured',
    },
  ];

  return (
    <div>
      Admin page
      {/* <DataTable columns={columns} data={allShoes} /> */}
    </div>
  );
}
