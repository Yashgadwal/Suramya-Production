'use client';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}: ImageWithSkeletonProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
