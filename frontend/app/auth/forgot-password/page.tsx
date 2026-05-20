'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { maskEmail } from '@/lib/utils';

// icons
import { ChevronLeft, X, RefreshCwIcon, LoaderCircle } from 'lucide-react';

// components
import { Textz } from '../login/page';
import { Linkz } from '@/components/layout/Header';
import { InputField } from '@/components/ui/Inputz';
import { Button, ButtonV2OutLine } from '@/components/ui/Button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// api
import { ForgottenPasswordAction, ResetPasswordAction } from '../actions';

export default function ForgottenPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('chua lam cho nay');
  const [toggleOTP, setToggleOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [togglePassword, setTogglePassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) {
      toast.warning('Please enter your username');
      return;
    }
    setIsLoading(true);
    try {
      const res = await ForgottenPasswordAction(String(username));
      if (res.success === true) {
        setEmail(res?.email);
        setToggleOTP(true);
      } else {
        toast.warning(res?.message || "Can't not find your username");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const handleSendOTP = async () => {
    try {
      if (otp === '' || password === '') {
        toast.warning('No fields should be left blank.');
      }
      setIsLoading(true);
      const res = await ResetPasswordAction({ username, otp, newPassword: password });
      console.log(111, res);
      if (res.success === false) {
        toast.warning(res?.message);
      } else {
        toast.success(res?.message);
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
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
        <Button type="submit" disabled={isLoading} className="bg-(--primary-color) h-12">
          {!isLoading ? (
            'Submit'
          ) : (
            <span>
              {' '}
              <span className="flex items-center gap-2">
                Loading...
                <LoaderCircle className="animate-spin" />
              </span>
            </span>
          )}
        </Button>
      </form>

      {/* Dialog OTP */}
      {toggleOTP && (
        <Card className="mx-auto max-w-md bg-(--light) fixed">
          {/* button close dialog OTP */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-amber-300"
            onClick={() => setToggleOTP(false)}
          >
            <X className="h-4 w-4 text-(--primary-color)" />
            <span className="sr-only">Close</span>
          </Button>
          <CardHeader>
            <CardTitle>Verify your account</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{' '}
              <span className="font-medium">{maskEmail(email)}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
                <Button variant="outline" size="xs" className="bg-(--secondary-color)">
                  <RefreshCwIcon />
                  Resend Code
                </Button>
              </div>
              <InputOTP value={otp} onChange={setOtp} maxLength={6} id="otp-verification" required>
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2 text-(--primary-color)" />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <InputField
                type={togglePassword ? 'type' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                password={true}
                togglePassword={togglePassword}
                setTogglePassword={setTogglePassword}
                inputName="New password"
                placeholder="Enter your new password"
              />
              <FieldDescription>
                <a href="#">I no longer have access to this email address.</a>
              </FieldDescription>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <ButtonV2OutLine
                disabled={isLoading}
                onClick={() => handleSendOTP()}
                className="w-full text-(--primary-color)"
              >
                {!isLoading ? (
                  'Verify'
                ) : (
                  <span className="flex items-center gap-2">
                    Verifying...
                    <LoaderCircle className="animate-spin" />
                  </span>
                )}
              </ButtonV2OutLine>
              <div className="text-sm text-(--primary-color)">
                Having trouble signing in?{' '}
                <a href="#" className="underline underline-offset-4 transition-colors hover:text-primary">
                  Contact support
                </a>
              </div>
            </Field>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
