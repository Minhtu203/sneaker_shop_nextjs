/* eslint-disable @typescript-eslint/no-explicit-any */
// types/shoe.ts

export interface IShoe {
  productId: any;
  category: string;
  brand: string;
  colors: IColor[];
  createAt: Date;
  description?: string;
  gender: string;
  isFeatured: boolean;
  name: string;
  price: number;
  rating: { average: string; count: number };
  sale: { sales: boolean; newPrice: number };
  updateAt: Date;
  _id: string;
}

export interface IColor {
  color: string;
  colorName: string;
  img: string[];
  sizes: ISize[];
}

export interface ISize {
  size: number;
  stock: number;
  _id: string;
}
