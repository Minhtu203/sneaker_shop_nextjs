'use client';

import { Linkz } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Inputz';
import { ChevronLeft, ShieldQuestionMark, UserPlus, Footprints, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { LoginAction } from '../actions';
import { useRouter } from 'next/navigation';
import { useUserState } from '@/store/userState';
import { toast } from 'sonner';

function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [togglePassword, setTogglePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUserInfo } = useUserState();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = { username, password };
      const res = await LoginAction(payload);

      if (res.data.success === true) {
        // console.log(11111, res.data?.data);

        if (res.data?.data?.role === 'user') {
          setUserInfo(res.data?.data);
          router.push('/');
          toast.success(res.data.message);
        } else if (res.data?.data?.role === 'admin') {
          setUserInfo(res.data?.data);
          router.push('/admin');
          toast.success(res.data.message);
        }
      } else {
        setIsLoading(false);
        toast.error(res.data.message);
      }
    } finally {
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="relative bg-(--light) w-1/3 rounded-4xl pt-15 pb-12 px-6 flex gap-4 flex-col"
      >
        <div className="absolute top-3 left-3">
          <Linkz href="/">
            <Textz className="flex flex-row items-center">
              <ChevronLeft size={20} /> Dashboard
            </Textz>
          </Linkz>
        </div>

        <div className="w-full flex justify-center items-center">
          <header className="text-(--primary-color) text-4xl flex flex-row font-bold tracking-widest">Login</header>
        </div>

        {/* input */}
        <InputField value={username} setValue={setUsername} inputName="Username" placeholder="Enter your username" />
        <InputField
          type={togglePassword ? 'type' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          password={true}
          togglePassword={togglePassword}
          setTogglePassword={setTogglePassword}
          inputName="Password"
          placeholder="Enter your password"
        />

        <div className="flex flex-row">
          <Linkz href="/auth/forgot-password">
            <Textz className="flex flex-row gap-1">
              <ShieldQuestionMark size={18} />
              Forgotten password
            </Textz>
          </Linkz>

          <Linkz href="/auth/register" className="ml-auto">
            <Textz className="flex flex-row gap-1">
              <UserPlus size={18} /> Register
            </Textz>
          </Linkz>
        </div>

        {/* submit btn */}
        <Button type="submit" className="bg-(--primary-color) h-12">
          {isLoading ? (
            <span className="flex items-center gap-2">
              Please wait...
              <LoaderCircle className="animate-spin" />
            </span>
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;

export const Textz = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <span className={`text-(--primary-color) text-[0.9rem] hover:underline ${className}`}>{children}</span>;
};
