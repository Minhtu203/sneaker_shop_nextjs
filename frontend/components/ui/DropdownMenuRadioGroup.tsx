'use client';

import * as React from 'react';
import { Button } from './Button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DropdownMenuRadioGroupDemoProps {
  label: string; // Tên nhãn (Ví dụ: "Brand")
  options: string[]; // Mảng các chuỗi đơn giản ['Nike', 'Adidas',...]
  selectedValue: string; // Giá trị string đang chọn từ formData.brand
  onValueChange: (value: string) => void; // Hàm để set lại giá trị cho formData
}

export function DropdownMenuRadioGroupDemo({
  label,
  options,
  selectedValue,
  onValueChange,
}: DropdownMenuRadioGroupDemoProps) {
  const currentLabel = selectedValue || `Select ${label}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal bg-slate-50/50 text-primary-color">
          {currentLabel}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50 text-primary-color" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-100 bg-light border border-slate-200 shadow-md p-1 text-primary-color w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Choose {label}</DropdownMenuLabel>

          <DropdownMenuRadioGroup value={selectedValue} onValueChange={onValueChange} className="w-full">
            {options?.map((option) => (
              <DropdownMenuRadioItem key={option} value={option} className="cursor-pointer capitalize">
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
