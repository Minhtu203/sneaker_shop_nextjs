'use client';

import Header from '@/components/layout/Header';
import React from 'react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="">
      <main className="">{children}</main>
    </section>
  );
}
