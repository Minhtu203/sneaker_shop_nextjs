import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import logo from '@/public/logoShoes.png';
import { isValidImageSrc } from '@/lib/utils';

interface ShoeGalleryProps {
  images?: string[];
}

export function ShoeGallery({ images }: ShoeGalleryProps) {
  if (!images || images.length === 0) {
    // eslint-disable-next-line react/no-unescaped-entities
    return <div className="text-muted-foreground w-full flex -mt-12">Don't have any data.</div>;
  }

  return (
    <Carousel className="w-full max-w-md md:mx-auto">
      <CarouselContent>
        {images?.map((url, index) => (
          <CarouselItem key={index}>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border-none">
              <Image
                src={isValidImageSrc(url) ? url : logo}
                alt={`Shoe image ${index + 1}`}
                width={1000}
                height={1000}
                className="object-cover transition-transform duration-300 rounded-2xl"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <div className="">
          <CarouselPrevious className="-left-12 border-none text-white bg-seconary-color" />
          <CarouselNext className="-right-12 border-none text-white bg-seconary-color" />
        </div>
      )}
    </Carousel>
  );
}
