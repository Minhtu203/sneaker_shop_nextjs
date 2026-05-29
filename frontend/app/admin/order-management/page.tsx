/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getAllOrders, updateOrderApi } from '../action';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ArrowDownUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { IOrder } from '@/types/order';
import { formatVND } from '@/lib/utils';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrderManagement() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);
  const queryClient = useQueryClient();

  // fetch data
  const {
    data: allOrders = [],
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ['order'],
    queryFn: async () => {
      const res = await getAllOrders({ axiosJWT, accessToken: userInfo?.accessToken || '' });
      console.log(2222, res);

      return res.data;
    },
    enabled: !!userInfo?._id,
  });

  // console.log(1111, allOrders);

  const statuses = ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'];

  const handleStatusChange = async (newStatus: string, orderId: string) => {
    try {
      const res = await updateOrderApi({
        axiosJWT,
        accessToken: userInfo?.accessToken || '',
        orderId,
        data: { status: newStatus },
      });

      if (res.data?.success) {
        toast.success(`Đơn hàng đã chuyển sang trạng thái: ${newStatus}`);
        // Trigger cho React Query tải lại dữ liệu mới nhất để cập nhật màu sắc cột
        queryClient.invalidateQueries({ queryKey: ['order'] });
      }
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  const handleToggleIsPaid = async (orderId: string, isPaid: boolean) => {
    try {
      // Gọi API update đơn hàng (sử dụng API update order đã viết bằng POST ở câu trước)
      // Bạn truyền vào đúng ID đơn hàng và giá trị phủ định !isPaid
      const res = await updateOrderApi({
        axiosJWT,
        accessToken: userInfo?.accessToken || '',
        orderId,
        data: { isPaid: !isPaid },
      });

      if (res?.success === true) {
        toast.success(`Order status changed to: ${!isPaid ? 'Paid' : 'Unpaid'}`);
        queryClient.invalidateQueries({ queryKey: ['order'] });
      } else {
        toast.error(res?.message || 'Cập nhật thanh toán thất bại!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thanh toán thất bại!');
    }
  };

  const columns: ColumnDef<IOrder>[] = [
    {
      id: 'paymentCode',
      accessorFn: (row) => row.paymentCode,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 font-semibold"
        >
          Payment Code
          <ArrowDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.paymentCode}</div>,
    },
    {
      id: 'fullName',
      accessorFn: (row) => row.shippingAddress?.fullName,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 font-semibold"
        >
          Customer
          <ArrowDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.shippingAddress?.fullName}</div>,
    },

    {
      id: 'phone',
      accessorFn: (row) => row.shippingAddress?.phone,
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.original.shippingAddress?.phone}</div>,
    },

    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 font-semibold"
        >
          Amount
          <ArrowDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalAmount'));
        return <div>{formatVND(amount)}</div>;
      },
    },

    {
      id: 'itemsCount',
      header: 'Quantity',
      cell: ({ row }) => <div className="text-center w-16">{row.original.items?.length || 0}</div>,
    },

    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const orderId = row.original._id;

        // Định nghĩa màu sắc tương ứng cho từng trạng thái đơn hàng
        const statusStyles: Record<string, string> = {
          Pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          Confirmed: 'bg-purple-50 text-purple-800 border-purple-200',
          Shipping: 'bg-blue-50 text-blue-800 border-blue-200',
          Delivered: 'bg-green-50 text-green-800 border-green-200',
          Cancelled: 'bg-red-50 text-red-800 border-red-200',
        };

        return (
          <Select defaultValue={status} onValueChange={(value) => handleStatusChange(value, orderId || '')}>
            <SelectTrigger
              className={`w-32.5 h-8 rounded-full text-xs font-semibold border transition-colors ${statusStyles[status] || 'bg-gray-50'}`}
            >
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-light">
              {statuses.map((item: any) => (
                <SelectItem key={item} value={item} className="text-xs font-medium text-primary-color hover:bg-white">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'isPaid',
      header: 'Payment Info',
      cell: ({ row }) => {
        const isPaid = row.getValue('isPaid') as boolean;
        const orderId = row.original._id;
        return (
          <button
            onClick={() => handleToggleIsPaid(orderId || '', isPaid)}
            className="hover:opacity-80 transition-all flex items-center gap-2"
            title={isPaid ? 'Click để đánh dấu Chưa thanh toán' : 'Click để đánh dấu Đã thanh toán'}
          >
            {isPaid ? (
              <div className="flex items-center gap-1.5">
                <ToggleRight className="text-emerald-500 fill-emerald-500/10" size={32} />
                {/* <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Paid</span> */}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <ToggleLeft className="text-slate-400" size={32} />
                {/* <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700">Unpaid</span> */}
              </div>
            )}
          </button>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 font-semibold"
        >
          Order Date
          <ArrowDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateStr = row.getValue('createdAt') as string;
        const date = new Date(dateStr);
        return <div className="text-gray-500 text-sm">{date.toLocaleString('vi-VN')}</div>;
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
    <div className={`w-full p-10 flex flex-col gap-4`}>
      <DataTable columns={columns} data={allOrders} filterKey="paymentCode" />
    </div>
  );
}
