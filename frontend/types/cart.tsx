export interface ICart {
  _id?: string;
  name: string;
  brand: string;
  price: string | number;
  size: number;
  quantity: number;
  color: {
    colorName: string;
    color: string;
    img: string[];
  };
  productId: {
    _id: string;
    image?: string;
  };
}
