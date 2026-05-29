'use client';

import React, { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import logo from '@/public/logoShoes.png';

import {
  CircleUserRound,
  Heart,
  LoaderCircle,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRoundPen,
  X,
} from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';
import { createAxios } from '@/lib/axios';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useUserState } from '@/store/userState';
import { IShoe } from '@/types';
import { InputField } from '../ui/Inputz';

import { LogoutAction } from '@/app/auth/actions';
import { getIsFeaturedShoes, searchShoesApi } from '@/app/(main)/action';
import { CardShoesSearch } from '../ui/CardShoesSearch';

export default function Header() {
  const [page, setPage] = useState<PageName>('/');

  const { userInfo, setUserInfo, clearUserInfo } = useUserState();
  const axiosJWT = useMemo(() => createAxios(userInfo, setUserInfo), [userInfo, setUserInfo]);
  const [toggleMenu, setToggleMenu] = useState(false); // toggle box when click avatar
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // toggle menu mobile

  const [isOpenSearch, setIsOpenSearch] = useState(false); // toggle input search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchTerm = useDebounce<string>(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(false); // debounce api
  const [isTyping, setIsTyping] = useState(false); // debounce user typing

  const [allShoes, setAllShoes] = useState([]);
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

  useEffect(() => {
    if (searchQuery) {
      setIsTyping(true);
    }
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // waiting when search item
  useEffect(() => {
    if (debouncedSearchTerm) {
      callSearchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const callSearchAPI = async (keyword: string) => {
    try {
      setIsLoading(true);

      const res = await searchShoesApi(keyword);

      setAllShoes(res?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredShoes = allShoes.filter((shoe: IShoe) => {
    return shoe.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const menuRef = useClickOutside(() => {
    setToggleMenu(false);
    setMobileNavOpen(false);
    setIsOpenSearch(false);
    setSearchQuery('');
  });

  return (
    <header className="px-4 h-20 flex items-center flex-row justify-between fixed top-0 left-0 w-full z-1000 bg-(--primary-color) shadow-2xs">
      <div className="h-full flex flex-row items-center px-4 md:px-8">
        {/* Logo */}
        <Image
          priority
          src={logo}
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
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
        {/* Input search */}
        {!isOpenSearch ? (
          <Search
            className="hidden md:flex hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400 cursor-pointer"
            size={40}
            onClick={() => setIsOpenSearch(true)}
          />
        ) : (
          <X
            className="hidden md:flex hover:bg-gray-300 hover:text-(--primary-color) p-2 rounded-2xl text-gray-400 cursor-pointer"
            size={40}
            onClick={() => {
              setIsOpenSearch(false);
              setSearchQuery('');
            }}
          />
        )}

        <AnimatePresence>
          {isOpenSearch && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 50 }}
              className="absolute right-64 md:w-60 z-50"
            >
              <InputField
                placeholder="Shoes name..."
                value={searchQuery}
                setValue={(e) => setSearchQuery(e)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-light bg-primary-color"
                autoFocus
                secondColorDelete={true}
              />

              {(isLoading || isTyping) && (
                <LoaderCircle className="absolute top-3 right-8 animate-spin duration-1500" size={20} />
              )}

              {/* Chỉ hiện danh sách khi người dùng bắt đầu nhập chữ */}
              {searchQuery && (
                <div className="absolute flex flex-col gap-2 top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto p-2 z-50 bg-light rounded-2xl">
                  {filteredShoes.length > 0 ? (
                    filteredShoes.map((shoe: IShoe) => <CardShoesSearch item={shoe} key={shoe?._id} />)
                  ) : (
                    <div className="text-primary-color text-sm p-2">No product found!</div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
