'use client';

import * as React from 'react';

import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  options: string[] | number[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export function DropdownMenuRadioGroupDemo({ label, options, selectedValue, onValueChange }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-primary-color bg-slate-50/50">
          {selectedValue ? `${label}: ${selectedValue}` : label}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-100">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            className="bg-light text-primary-color w-full"
            value={selectedValue}
            onValueChange={onValueChange}
          >
            {options.map((item) => (
              <DropdownMenuRadioItem key={item} value={String(item)}>
                {item}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
