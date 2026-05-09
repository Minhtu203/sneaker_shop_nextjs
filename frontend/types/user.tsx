export interface IUser {
  _id?: string;
  username: string;
  email: string;
  avatar?: string;
  password?: string;
  role: 'user' | 'admin' | string;
  shopping_cart: string;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
