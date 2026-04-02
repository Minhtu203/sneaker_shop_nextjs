'use client';

import { Linkz } from '@/components/layout/Header';
import React, { FormEvent, useState } from 'react';
import { Textz } from '../login/page';
import { ChevronLeft } from 'lucide-react';
import { InputField } from '@/components/ui/Inputz';
import { Button } from '@/components/ui/Button';
import { ForgottenPasswordAction } from '../actions';

export default function ForgottenPassword() {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await ForgottenPasswordAction(String(username));
    console.log(res);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="relative bg-(--light) w-1/3 rounded-4xl pt-15 pb-12 px-6 flex gap-4 flex-col"
      >
        <div className="absolute top-3 left-3">
          <Linkz href="/auth/login">
            <Textz className="flex flex-row items-center">
              <ChevronLeft size={20} /> Log in
            </Textz>
          </Linkz>
        </div>

        {/* input */}
        <InputField value={username} setValue={setUsername} inputName="Username" placeholder="Enter your username" />

        {/* submit btn */}
        <Button type="submit" className="bg-(--primary-color) h-12">
          Log in
        </Button>
      </form>
    </div>
  );
}
