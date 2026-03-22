'use client';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Delete, Eye, EyeOff } from 'lucide-react';
import React from 'react';

interface InputFieldProps extends React.ComponentPropsWithoutRef<'input'> {
  inputName: string;
  placeholder: string;
  des?: string;
  value?: string;
  setValue?: (val: string) => void;
  password?: boolean; // true with password input
  togglePassword?: boolean; // toggle eye in password input
  setTogglePassword?: (val: boolean) => void;
}

export function InputField({
  inputName,
  placeholder,
  des,
  value,
  setValue,
  password,
  togglePassword,
  setTogglePassword,
  ...props
}: InputFieldProps) {
  return (
    <Field className="flex gap-1">
      <FieldLabel htmlFor="input-field-username" className="text-(--primary-color) pl-2">
        {inputName}
      </FieldLabel>
      <div className="relative">
        <Input
          id="input-field-username"
          type="text"
          placeholder={placeholder}
          className="border border-gray-400 text-gray-700 pr-8"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue?.(e.target.value)}
          {...props}
        />
        {value && !password && (
          <Delete
            className="absolute right-2 top-1/2 -translate-y-1/2 text-(--primary-color) hover:text-(--secondary-color)"
            size={18}
            onClick={() => setValue?.('')}
          />
        )}

        {/* show/hide password */}
        {password &&
          (togglePassword ? (
            <Eye
              className="absolute right-2 top-1/2 -translate-y-1/2 text-(--primary-color) hover:text-(--secondary-color)"
              size={18}
              onClick={() => setTogglePassword?.(!togglePassword)}
            />
          ) : (
            <EyeOff
              className="absolute right-2 top-1/2 -translate-y-1/2 text-(--primary-color) hover:text-(--secondary-color)"
              size={18}
              onClick={() => setTogglePassword?.(!togglePassword)}
            />
          ))}
      </div>

      {des && <FieldDescription>{des}</FieldDescription>}
    </Field>
  );
}
