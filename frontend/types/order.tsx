/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IOrder {
  _id?: string;
  paymentCode: string;
  createdAt: string;
  isPaid: boolean;
  items: any[];
  note: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  status: 'Pending' | 'Confirmed' | 'Shipping' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  updatedAt: string;
  userId: string;
}
