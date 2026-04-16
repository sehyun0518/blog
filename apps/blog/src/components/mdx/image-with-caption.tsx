import NextImage from "next/image";

interface ImageWithCaptionProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

export function ImageWithCaption({ src, alt = "", width, height }: ImageWithCaptionProps) {
  if (!src) return null;

  const isExternal = /^https?:\/\//.test(src);

  return (
    <figure className="my-6">
      <NextImage
        src={src}
        alt={alt}
        width={Number(width) || 800}
        height={Number(height) || 450}
        sizes="(max-width: 768px) 100vw, 800px"
        className="h-auto w-full rounded-lg"
        unoptimized={isExternal}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
