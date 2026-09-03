import Image from 'next/image';
import type { FC } from 'react';

interface IPostImageProps {
  src: string;
}

export const PostImage: FC<IPostImageProps> = ({ src }) => (
  <div className="mt-3 rounded-2xl w-full overflow-hidden bg-gray-900 border border-gray-700 aspect-video relative">
    <Image
      fill
      src={src}
      className="object-cover blur-xl scale-110 opacity-50"
      alt=""
      aria-hidden
    />
    <Image
      fill
      src={src}
      className="object-contain"
      alt="post image"
      sizes="(max-width: 600px) 100vw, 600px"
    />
  </div>
);
