'use client';

import logo from '@/public/logoShoes.png';
import Image from 'next/image';
import React, { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import Link, { LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CircleUserRound,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRoundPen,
  X,
} from 'lucide-react';
import { useUserState } from '@/store/userState';
import { LogoutAction } from '@/app/auth/actions';
import { createAxios } from '@/lib/axios';
import { toast } from 'sonner';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function Header() {
  const [page, setPage] = useState<PageName>('/');

  const [toggleMenu, setToggleMenu] = useState(false);
  const { userInfo, setUserInfo, clearUserInfo } = useUserState();
  const axiosJWT = useMemo(() => createAxios(userInfo, setUserInfo), [userInfo, setUserInfo]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // toggle menu mobile
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (!userInfo) return;
      const res = await LogoutAction({ userId: userInfo._id, accessToken: userInfo?.accessToken, axiosJWT: axiosJWT });

      toast.success(res?.message, { position: 'bottom-right' });
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      clearUserInfo();
    }
  };

  const menuRef = useClickOutside(() => {
    setToggleMenu(false);
    setMobileNavOpen(false);
  });

  return (
    <header className="px-4 h-20 flex items-center flex-row justify-between fixed top-0 left-0 w-full z-1000 bg-(--primary-color) shadow-2xs">
      <div className="h-full flex flex-row items-center px-4 md:px-8">
        <Image
          src={logo}
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
          priority
          onClick={() => router.push('/')}
        />
      </div>

      <div className="hidden md:flex flex-1 h-full flex-row justify-center gap-8">
        <LinkHeader setToggleMenu={setToggleMenu} value="/" setPage={setPage} href="/">
          Dashboard
        </LinkHeader>
        <LinkHeader setToggleMenu={setToggleMenu} value="/shop/men" setPage={setPage} href="/shop/men">
          Men
        </LinkHeader>
        <LinkHeader setToggleMenu={setToggleMenu} value="/shop/women" setPage={setPage} href="/shop/women">
          Women
        </LinkHeader>
        <LinkHeader setToggleMenu={setToggleMenu} value="/shop/kids" setPage={setPage} href="/shop/kids">
          Kids
        </LinkHeader>
        <LinkHeader setToggleMenu={setToggleMenu} value="/shop/collections" setPage={setPage} href="/shop/collections">
          Collections
        </LinkHeader>
      </div>

      <div className="flex flex-row items-center justify-end gap-6 h-full pr-12">
        <Search
          className="hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400"
          size={40}
          onClick={() => {
            console.log(123132131);
          }}
        />

        {!userInfo || !userInfo.accessToken ? (
          <Link href={'/auth/login'} onClick={() => toast.info('Please sign in to continue')}>
            <ShoppingCart
              className="hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400"
              size={38}
            />
          </Link>
        ) : (
          <Link href={'/shop/cart'}>
            <ShoppingCart
              className="hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400"
              size={38}
            />
          </Link>
        )}

        <div className="relative">
          {userInfo?.avatar ? (
            <Image
              priority
              src={userInfo?.avatar || '/user_image_default.png'}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full w-full h-auto"
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          ) : (
            <CircleUserRound
              className="hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400"
              size={38}
              onClick={() => setToggleMenu(!toggleMenu)}
            />
          )}

          {toggleMenu && (
            <div
              ref={menuRef}
              className="bg-white absolute top-8 md:right-0 p-4 flex flex-col gap-4 md:w-50 rounded-2xl"
            >
              {userInfo ? (
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
              )}

              <Linkz href={'/shop/favourites'}>
                <TextCustomise onClick={() => setToggleMenu(false)}>
                  <Heart /> Favourites
                </TextCustomise>
              </Linkz>

              <Linkz href={'/shop/orders'}>
                <TextCustomise onClick={() => setToggleMenu(false)}>
                  <ShoppingBag /> Your orders
                </TextCustomise>
              </Linkz>

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

        {/* mobile navigate */}
        <button
          className="block md:hidden text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {mobileNavOpen && (
          <div
            ref={menuRef}
            className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 flex flex-col p-4 gap-2 shadow-md md:hidden z-40 animate-in fade-in slide-in-from-top-5 duration-200"
          >
            <LinkHeader
              setToggleMenu={setToggleMenu}
              value="/"
              setPage={setPage}
              href="/"
              onClick={() => setMobileNavOpen(false)}
            >
              Dashboard
            </LinkHeader>
            <LinkHeader
              setToggleMenu={setToggleMenu}
              value="/shop/men"
              setPage={setPage}
              href="/shop/men"
              onClick={() => setMobileNavOpen(false)}
            >
              Men
            </LinkHeader>
            <LinkHeader
              setToggleMenu={setToggleMenu}
              value="/shop/women"
              setPage={setPage}
              href="/shop/women"
              onClick={() => setMobileNavOpen(false)}
            >
              Women
            </LinkHeader>
            <LinkHeader
              setToggleMenu={setToggleMenu}
              value="/shop/kids"
              setPage={setPage}
              href="/shop/kids"
              onClick={() => setMobileNavOpen(false)}
            >
              Kids
            </LinkHeader>
            <LinkHeader
              setToggleMenu={setToggleMenu}
              value="/shop/collections"
              setPage={setPage}
              href="/shop/collections"
              onClick={() => setMobileNavOpen(false)}
            >
              Collections
            </LinkHeader>
          </div>
        )}
      </div>
    </header>
  );
}

export type PageName =
  | '/'
  | '/shop/men'
  | '/shop/women'
  | '/shop/kids'
  | '/shop/collections'
  | '/admin'
  | '/admin/user-management'
  | '/admin/order-management';

interface LinkHeaderProps extends LinkProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  value: PageName;
  setPage: Dispatch<SetStateAction<PageName>>;
  setToggleMenu: Dispatch<SetStateAction<boolean>>;
}

export const LinkHeader = ({
  className,
  children,
  width,
  height,
  value,
  setPage,
  setToggleMenu,
  ...props
}: LinkHeaderProps) => {
  const pathName = usePathname();

  return (
    <Link
      className={`${className} px-2 text-md ${value === pathName ? ' underline underline-offset-4' : ' text-gray-400 font-normal'} hover:scale-120 transition-all duration-300 h-full flex items-center`}
      style={{ width: width, height: height }}
      onClick={() => {
        setPage(value);
        setToggleMenu(false);
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export const TextCustomise = ({ children, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      {...props}
      className="flex flex-row gap-2 text-(--primary-color) hover:scale-105 transition-all duration-300 hover:bg-(--primary-color) hover:text-(--secondary-color) w-full pl-3 rounded-2xl py-2"
    >
      {children}
    </span>
  );
};

export const Linkz = ({
  children,
  href,
  className,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Link href={href} className={className} onClick={onClick} {...props}>
      {children}
    </Link>
  );
};
