/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DataTable } from '@/components/ui/DataTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { deleteUserById, getAllUser } from '../action';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { ColumnDef } from '@tanstack/react-table';
import { IUser } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { ArrowDownUp, LockKeyhole, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function UserManagement() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);

  const queryClient = useQueryClient();
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

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

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    queryClient.setQueryData(['user'], (oldData: any) => {
      if (!oldData) return;
      return oldData.filter((user: any) => user._id !== userToDelete.id);
    });

    setUserToDelete(null);
    await handleDeleteUser(userToDelete.id, userToDelete.name);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const res = await deleteUserById({ axiosJWT, accessToken: userInfo?.accessToken ?? '', userId });
    if (res?.success === true) {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(`Delete user '${userName}' success.`);
    } else {
      toast.error('Delete user failed!');
    }
  };

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
        const userInfo = row.original;
        return (
          <div className="flex gap-2">
            <Button
              className="bg-red-400"
              onClick={() => setUserToDelete({ id: userInfo._id, name: userInfo.username })}
            >
              <Trash2 />
            </Button>

            <Button onClick={() => console.log('lock id: ', userInfo?._id)} className="bg-primary-color">
              <LockKeyhole />
            </Button>
          </div>
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
    <div className="w-full p-10">
      <DataTable columns={columns} data={allUsers} filterKey="username" />

      {userToDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm transition-opacity"
            onClick={() => setUserToDelete(null)}
          />

          <Card className="fixed w-[90%] max-w-105 bg-white border border-slate-200 shadow-2xl z-70 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col gap-4 rounded-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="text-red-500" size={20} />
                Delete Item
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-800">{userToDelete.name}</span>?
              </p>
            </div>

            {/* Button Cancel, Confirm */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 h-9 text-sm font-medium border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDeleteUser} // show dialog delete user
                className="px-4 h-9 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
