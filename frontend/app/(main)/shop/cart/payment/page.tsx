/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { formatVND } from '@/lib/utils';
import { ICart } from '@/types/cart';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import logo from '@/public/logoShoes.png';
import { useUserState } from '@/store/userState';
import { createAxios } from '@/lib/axios';
import { createOrderApi, deleteProductFromCart } from '@/app/(main)/action';
import { toast } from 'sonner';

export interface PaymentInterface {
  totalAmount: number;
  items?: ICart[];
}

function PaymentContent() {
  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);
  const router = useRouter();

  const searchParams = useSearchParams();
  const encodedData = searchParams.get('data');

  let checkoutData = null;
  if (encodedData) {
    try {
      checkoutData = JSON.parse(decodeURIComponent(encodedData));
    } catch (error) {
      console.error('Lỗi khi giải mã dữ liệu giỏ hàng:', error);
    }
  }

  const { items = [], totalAmount = 0 } = checkoutData || {};

  // info payment
  const BANK_ID = process.env.NEXT_PUBLIC_BANK_ID;
  const ACCOUNT_NO = process.env.NEXT_PUBLIC_ACCOUNT_NO;
  const ACCOUNT_NAME = process.env.NEXT_PUBLIC_ACCOUNT_NAME;

  // Transfer Description
  const [paymentCode, setPaymentCode] = useState('');
  useEffect(() => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const timer = setTimeout(() => {
      setPaymentCode(`SNEAKERT${randomDigits}`);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // api create order
  const handleOrder = async () => {
    try {
      const paramsOrder = {
        paymentCode: paymentCode,
        totalAmount: Number(checkoutData?.totalAmount),
        items: checkoutData?.items,
        shippingAddress: {
          fullName: userInfo?.fullName || userInfo?.username,
          phone: userInfo?.phone,
          address: userInfo?.address,
          city: userInfo?.city,
        },
        paymentMethod: 'BANK_TRANSFER',
        note: '',
      };

      const res = await createOrderApi({ axiosJWT, accessToken: userInfo?.accessToken || '', data: paramsOrder });
      toast.success(res?.message || 'Order successfull');
      if (res?.success === true) {
        router.push('/shop/cart');
        try {
          //  Duyệt qua toàn bộ danh sách sản phẩm vừa mua để gọi API xóa khỏi giỏ hàng
          await Promise.all(
            checkoutData.items.map((item: any) =>
              deleteProductFromCart({
                axiosJWT,
                accessToken: userInfo?.accessToken || '',
                params: {
                  productId: item.productId || item.id,
                  color: typeof item.color === 'object' ? item.color.colorName : item.color,
                  size: Number(item.size),
                },
              })
            )
          );
        } catch (deleteError) {
          console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', deleteError);
        }
      }
    } catch (error: any) {
      console.error('handleOrder failed.', error);
      toast.error('Order failed.');
    }
  };

  if (!checkoutData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Order information not found or invalid data provided.
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
      {/* LIST ITEMS */}
      <div className="md:w-2/3 bg-light rounded-2xl text-primary-color p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wide">Payment</h1>
        <div className="w-full flex flex-col gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary-color mb-4 border-b pb-2">List items ({items.length})</h2>

            <div className="flex flex-col gap-4 max-h-100 overflow-y-auto pr-2">
              {items.map((item: any, index: number) => (
                <div
                  key={item.id || index}
                  className="flex flex-row items-center justify-between border-b border-primary-color pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-row gap-4 items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
                      <Image
                        src={items?.[index]?.color?.img?.[0] || logo}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        width={50}
                        height={50}
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary-color line-clamp-1">{item.name}</span>
                      {item.size && <span className="text-xs text-gray-400">Size: {item.size}</span>}
                      <span className="text-sm text-gray-500 mt-1">Quantity: x{item.quantity}</span>
                    </div>
                  </div>

                  {/* price detail */}
                  <div className="text-right shrink-0">
                    <span className="font-medium text-primary-color block">
                      {formatVND(item.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-gray-400 block">{formatVND(item.price)} / 1</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total price */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>{formatVND(totalAmount)}</span>
            </div>

            <div className="flex justify-between text-gray-500 text-sm">
              <span>Shipping Fee</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr className="my-1 border-dashed" />
            <div className="flex justify-between items-center">
              <span className="text-primary-color font-semibold">Total</span>
              <span className="text-xl font-bold text-red-800">{formatVND(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* pPAYMENT */}
      <div className="md:w-1/3 rounded-2xl text-primary-color">
        <div className="bg-light rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold text-primary-color mb-2">Scan QR code to payment</h2>
          <p className="text-xs text-gray-400 mb-6 px-4">
            Use your banking app or e-wallet (MoMo, VNPAY) to scan the QR code.
          </p>

          {/* Box QR */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner mb-6 relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${totalAmount}&addInfo=${paymentCode}&accountName=${encodeURIComponent(ACCOUNT_NAME || '')}`}
              alt="MB Bank Automatic Payment QR Code"
              className="w-52 h-52 object-contain rounded-lg"
            />
          </div>

          {/* Thông tin chuyển khoản dự phòng */}
          <div className="w-full text-left bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-primary-color">Amount:</span>
              <span className="font-bold text-primary-color">{formatVND(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-color">Transfer Code:</span>
              <span className="font-bold text-primary-color uppercase">{paymentCode}</span>
            </div>
          </div>

          <button
            onClick={() => handleOrder()}
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl transition duration-200 active:scale-[0.98]"
          >
            I have successfully completed the payment.
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-500 bg-gray-50">
          <div className="animate-pulse">Loading payment page...</div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
