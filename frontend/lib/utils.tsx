import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const maskEmail = (email: string) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 5 ? '*****' + localPart.slice(7) : '*****';
  return `${maskedLocal}@${domain}`;
};
