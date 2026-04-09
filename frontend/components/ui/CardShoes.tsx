import { formatVND } from '@/lib/utils';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type CardShoesProps = {
  shoeData: {
    _id?: string;
    name?: string;
    price?: string;
    brand?: string;
    colors?: Array<{
      colorName: string;
      color: string;
      img: string[];
      sizes: Array<{ size: number; stock: number }>;
    }>;
    gender?: string;
    rating?: { average: string; count: number };
    sale?: { sales: boolean; newPrice: number };
  };
  heart?: boolean;
  heartClick?: () => void;
  className?: string;
  isLoading?: boolean;
};

const CardShoes = ({ shoeData, heart, heartClick, className, isLoading, ...props }: CardShoesProps) => {
  return (
    <Link
      href={`/shop/products/${shoeData?._id}`}
      className={`${className} flex flex-col gap-2 cursor-pointer bg-none rounded-2xl hover:scale-105 transition-all hover:z-10`}
      {...props}
    >
      <div className="relative h-90">
        <Image
          src={shoeData?.colors?.[0].img[0] ?? ''}
          fill
          alt={shoeData?.name || 'Shoe image'}
          className="object-cover rounded-2xl w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {heart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (heartClick) {
                heartClick();
              }
            }}
            disabled={isLoading}
            className="w-10 h-10 bg-white cursor-pointer absolute right-6 top-6 flex items-center justify-center rounded-[50%]"
          >
            <Heart className="text-(--primary-color)" fill="var(--primary-color)" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-0 z-1">
        <span className="font-bold text-xl">{shoeData?.name}</span>
        <span className="font-bold text-md text-gray-400">{shoeData?.gender}</span>
        <span className="font-bold text-md">{formatVND(Number(shoeData?.price) || 0)}</span>
      </div>
    </Link>
  );
};

export default CardShoes;
