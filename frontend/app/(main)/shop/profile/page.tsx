/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';

import { InputField } from '@/components/ui/Inputz';
import { useUserState } from '@/store/userState';
import { createAxios } from '@/lib/axios';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { uploadAvatarApi } from '../../action';
import { toast } from 'sonner';

export default function Profile() {
  // rename tab
  useEffect(() => {
    document.title = 'Profile | SneakerT';
    return () => {
      document.title = 'SneakerT';
    };
  });

  const { userInfo, setUserInfo } = useUserState();
  const axiosJWT = createAxios(userInfo, setUserInfo);
  const router = useRouter();

  // back to dashboard when log out
  useEffect(() => {
    if (!userInfo) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleSetAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn, vui lòng chọn file < 5MB');
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsUploading(true);
      const res = await uploadAvatarApi({ axiosJWT, accessToken: userInfo?.accessToken || '', data: formData });
      console.log(3333333, res);

      const newAvatarUrl = res?.data?.avatar;
      setUserInfo({ avatar: newAvatarUrl });
      toast.success('Upload avatar successfully!');
    } catch (error: any) {
      console.error('handleFileChange error:', error);
      toast.warning('Error when upload image.');
    } finally {
      setIsUploading(false);
      // Reset input để nếu user chọn lại cùng 1 file, nó vẫn trigger onChange
      event.target.value = '';
    }
  };

  return (
    <div className="p-8">
      <div className="bg-light min-h-100 rounded-2xl p-4 pb-8 flex flex-col gap-4">
        {/* avatar */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />
        <button className="w-full flex justify-center my-4" disabled={isUploading}>
          <div className="relative group w-37.5 h-37.5 rounded-3xl overflow-hidden">
            <Image
              fill
              src={userInfo?.avatar || '/user_image_default.png'}
              className="rounded-3xl absolute"
              alt="avatar"
            />
            {/* Overlay hiện khi hover */}
            <div className="absolute inset-0 bg-gray-400/0 group-hover:bg-gray-400/50 transition-colors rounded-3xl" />

            {/* Icon Upload nằm giữa, chỉ hiện khi hover cả khối */}
            <Upload
              className="absolute inset-0 m-auto opacity-0 group-hover:opacity-70 transition-opacity"
              size={60}
              onClick={handleSetAvatar}
            />
          </div>
        </button>
        <InputField
          value={fullName}
          setValue={setFullName}
          inputName="Full name"
          placeholder={userInfo?.fullName || 'Enter your full name.'}
        />
        <InputField
          value={phone}
          setValue={setPhone}
          inputName="Phone number"
          placeholder={userInfo?.phone || 'Enter your phone number.'}
        />
        <InputField
          value={address}
          setValue={setAddress}
          inputName="Address"
          placeholder={userInfo?.address || 'Enter your address.'}
        />
        <InputField
          value={city}
          setValue={setCity}
          inputName="City"
          placeholder={userInfo?.city || 'Enter your city.'}
        />
      </div>
    </div>
  );
}
