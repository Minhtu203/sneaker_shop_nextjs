import { getShoesById } from '@/app/(main)/action';
import { TextV1 } from '@/app/(main)/page';
import ProductView from '@/components/ui/ProductView';
import { ShoeGallery } from '@/components/ui/ShoesGallery';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shoeData = await getShoesById(id);

  return {
    title: shoeData?.data?.name ? `${shoeData?.data?.name} | SneakerT` : 'Product Detail',
    description: shoeData?.description || 'Chi tiết sản phẩm giày',
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const shoeData = await getShoesById(id);

  if (!shoeData) {
    return <div>Can not found any product</div>;
  }

  return (
    <>
      <ProductView shoe={shoeData?.data} />
    </>
  );
}
