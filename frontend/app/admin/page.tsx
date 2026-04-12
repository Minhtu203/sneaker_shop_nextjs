'use client';

import { DataTable } from '@/components/ui/DataTable';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import React, { useEffect, useState } from 'react';
import { getAllShoes } from '../(main)/action';
import { IShoe } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatVND } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowDownUp, ToggleLeft, ToggleRight } from 'lucide-react';

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
      // header: 'Name',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Name
            <ArrowDownUp />
          </Button>
        );
      },
    },
    {
      accessorKey: 'brand',
      // header: 'Brand',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Brand
            <ArrowDownUp />
          </Button>
        );
      },
    },
    {
      accessorKey: 'price',
      // header: 'Price',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Price
            <ArrowDownUp />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('price'));
        return <div className="">{formatVND(amount)}</div>;
      },
    },
    {
      accessorKey: 'isFeatured',
      // header: 'Is Featured',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Is Featured
            <ArrowDownUp />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isFeatured = !!row.getValue('isFeatured');

        const handleToggle = () => {
          const shoeId = row.original._id;
        };

        return (
          <button onClick={() => handleToggle()} className="hover:opacity-80 transition-all flex items-center gap-2">
            {isFeatured ? (
              <ToggleRight className="text-(--secondary-color) fill-yellow-500/20" size={32} />
            ) : (
              <ToggleLeft className="text-slate-400" size={32} />
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div className="w-full p-10 ">
      <DataTable columns={columns} data={allShoes} />
    </div>
  );
}
