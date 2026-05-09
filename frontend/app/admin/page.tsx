'use client';

import { DataTable } from '@/components/ui/DataTable';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import React, { useEffect, useState, useTransition } from 'react';
import { getAllShoes } from '../(main)/action';
import { IShoe } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatVND } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowDownUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { UpdateIsFeaturedShoes } from './action';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  const {
    data: allShoes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['shoes'],
    queryFn: async () => {
      const res = await getAllShoes();
      return res.data;
    },
    enabled: !!userInfo?._id,
  });

  const queryClient = useQueryClient();

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

        const handleToggleIsFeatured = async () => {
          const shoeId = row.original._id;

          // api update is featured shoes
          const res = await UpdateIsFeaturedShoes({
            axiosJWT,
            accessToken: userInfo?.accessToken || '',
            shoeId,
            isFeatured: !isFeatured,
          });
          // console.log(11111, res);
          if (res?.success === true) {
            queryClient.invalidateQueries({ queryKey: ['shoes'] });
          }

          // console.log(1111, res?.data?.isFeatured);
        };

        return (
          <button
            onClick={() => handleToggleIsFeatured()}
            className="hover:opacity-80 transition-all flex items-center gap-2"
          >
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

  if (isLoading) {
    return (
      <div className="w-full p-10 ">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full p-10 ">
      <DataTable columns={columns} data={allShoes} filterKey="name" />
    </div>
  );
}
