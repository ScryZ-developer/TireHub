'use client';

import Image from 'next/image';
import { isDataImage } from '@/lib/image';
import clsx from 'clsx';

interface ListingImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Renders next/image for URLs and plain <img> for data/blob uploads. */
export function ListingImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: ListingImageProps) {
  if (isDataImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={clsx(fill && 'absolute inset-0 h-full w-full', className)}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
