'use client';

import { LogoutAction } from '@/app/auth/actions';
import { createAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import logo from '@/public/logoShoes.png';
import { CircleUserRound, LogIn, LogOut } from 'lucide-react';
import { LinkHeader, Linkz, PageName, TextCustomise } from './Header';
import { useRouter } from 'next/navigation';

// type PageName = '/admin' | '/user-management';

export default function HeaderAdmin() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { userInfo, setUserInfo, clearUserInfo } = useUserState();
  const axiosJWT = useMemo(() => createAxios(userInfo, setUserInfo), [userInfo, setUserInfo]);
  const router = useRouter();
  const [page, setPage] = useState<PageName>('/admin');

  const handleLogout = async () => {
    try {
      if (!userInfo) return;
      const res = await LogoutAction({ userId: userInfo._id, accessToken: userInfo?.accessToken, axiosJWT: axiosJWT });
      toast.success(res?.message, { position: 'bottom-right' });
      router.push('/auth/login');
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      clearUserInfo();
    }
  };
  return (
    <header className="px-4 h-20 flex items-center flex-row fixed top-0 left-0 w-full z-1000 bg-(--primary-color) shadow-2xs">
      <div className="w-3/10 h-full flex flex-row items-center pl-16">
        <Image src={logo} alt="Logo" width={60} height={60} className="object-contain w-auto h-auto" priority />
      </div>

      <div className="flex-1 h-full flex flex-row justify-center gap-8">
        <LinkHeader setToggleMenu={setToggleMenu} value="/admin" setPage={setPage} href="/admin">
          Dashboard
        </LinkHeader>
        <LinkHeader
          setToggleMenu={setToggleMenu}
          value="/admin/user-management"
          setPage={setPage}
          href="/admin/user-management"
        >
          User management
        </LinkHeader>
        <LinkHeader
          setToggleMenu={setToggleMenu}
          value="/admin/order-management"
          setPage={setPage}
          href="/admin/order-management"
        >
          Order management
        </LinkHeader>
      </div>

      <div className="w-3/10 flex flex-row items-center justify-end gap-6 h-full pr-12 ml-auto">
        <div className="relative">
          {userInfo?.avatar ? (
            <Image
              src={userInfo?.avatar || '/user_image_default.png'}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full w-auto h-auto"
              onClick={() => setToggleMenu(!toggleMenu)}
              priority
            />
          ) : (
            <CircleUserRound
              className="hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400"
              size={38}
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          )}

          {toggleMenu && (
            <div className="bg-white absolute top-8 right-0 p-4 flex flex-col gap-4 w-50 rounded-2xl">
              {/* {userInfo ? (
                <Linkz href={'/shop/profile'}>
                  <TextCustomise onClick={() => setToggleMenu(false)}>
                    <UserRoundPen /> Profile
                  </TextCustomise>
                </Linkz>
              ) : (
                <Linkz href={'/auth/login'} onClick={() => toast.info('Please sign in to continue')}>
                  <TextCustomise onClick={() => setToggleMenu(false)}>
                    <UserRoundPen /> Profile
                  </TextCustomise>
                </Linkz>
              )} */}

              {/* log in & log out */}
              {userInfo ? (
                <button onClick={handleLogout}>
                  <TextCustomise onClick={() => setToggleMenu(false)}>
                    <LogOut />
                    Log out
                  </TextCustomise>
                </button>
              ) : (
                <Linkz href="/auth/login">
                  <TextCustomise>
                    <LogIn /> Log in
                  </TextCustomise>
                </Linkz>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
