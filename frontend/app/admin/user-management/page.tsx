'use client';

import { DataTable } from '@/components/ui/DataTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getAllUser } from '../action';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { ColumnDef } from '@tanstack/react-table';
import { IUser } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { ArrowDownUp, LockKeyhole, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  const queryClient = useQueryClient();

  const {
    data: allUsers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await getAllUser({ axiosJWT, accessToken: userInfo?.accessToken || '' });
      return res.data;
    },
    enabled: !!userInfo?._id,
  });

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Username
            <ArrowDownUp />
          </Button>
        );
      },
    },

    // email
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Email
            <ArrowDownUp />
          </Button>
        );
      },
    },

    // role

    // full name

    // status

    // Last Login

    // actions
    {
      accessorKey: 'actions',
      header: ({ column }) => {
        return (
          <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
            Actions
            <ArrowDownUp />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => console.log('delete id: ', user?._id)} className="bg-red-400">
              <Trash2 />
            </Button>

            <Button onClick={() => console.log('lock id: ', user?._id)} className="bg-primary-color">
              <LockKeyhole />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full p-10">
      <DataTable columns={columns} data={allUsers} filterKey="username" />
    </div>
  );
}
