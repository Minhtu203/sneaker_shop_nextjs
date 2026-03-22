'use client';

import { Linkz } from '@/components/layout/Header';
import React, { useState } from 'react';
import { Textz } from '../login/page';
import { ChevronLeft } from 'lucide-react';
import { InputField } from '@/components/ui/Inputz';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [togglePassword, setTogglePassword] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <form className="relative bg-(--light) w-1/3 rounded-4xl pt-15 pb-12 px-6 flex gap-4 flex-col">
        <div className="absolute top-3 left-3">
          <Linkz href="/auth/login">
            <Textz className="flex flex-row items-center">
              <ChevronLeft size={20} />
              Login
            </Textz>
          </Linkz>
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
        <InputField type="email" value={email} setValue={setEmail} inputName="Email" placeholder="Enter your email" />

        {/* submit btn */}
        <Button className="bg-(--primary-color) h-12">Log in</Button>
      </form>
    </div>
  );
}
