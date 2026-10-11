import { imageUrl, type ImageAsset } from '../data/images';

interface Props {
  image: ImageAsset;
  alt: string;
  sizes: string;
  /** Subset of the generated widths to offer; defaults to all of them. */
  widths?: number[];
  /** Above-the-fold image: load eagerly with high priority. */
  priority?: boolean;
}

/** <picture> with AVIF and WebP sources and a JPEG fallback, from scripts/build-images.mjs. */
export default function Picture({ image, alt, sizes, widths = image.widths, priority = false }: Props) {
  const usable = widths.filter((w) => image.widths.includes(w));
  const set = (format: 'avif' | 'webp' | 'jpg') => usable.map((w) => `${imageUrl(image, w, format)} ${w}w`).join(', ');
  const fallback = usable.find((w) => w >= 1200) ?? usable[usable.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={imageUrl(image, fallback, 'jpg')}
        srcSet={set('jpg')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}
