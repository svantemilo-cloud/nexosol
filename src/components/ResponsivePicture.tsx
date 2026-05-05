/** Build comma-separated responsive srcsets for typed <picture> sources. */

export function responsiveSrcSet(
  basename: string,
  widths: readonly number[],
  extension: "avif" | "webp",
): string {
  return widths.map((w) => `${basename}-${w}.${extension} ${w}w`).join(", ");
}

type ResponsivePictureProps = {
  basename: string;
  /** Pixel widths matching generated filenames ({basename}-{w}.{fmt}). */
  widths: readonly number[];
  sizes: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  /** Universal fallback when <picture> sources are skipped (PNG). */
  pngSrc: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low";
};

/**
 * AVIF/WebP-first responsive stack; PNG on <img> for rare clients without modern decode.
 */
export function ResponsivePicture({
  basename,
  widths,
  sizes,
  alt,
  className,
  width,
  height,
  pngSrc,
  loading = "lazy",
  fetchPriority,
}: ResponsivePictureProps) {
  const avif = responsiveSrcSet(basename, widths, "avif");
  const webp = responsiveSrcSet(basename, widths, "webp");

  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={pngSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}

type EncodedPictureProps = {
  basename: string;
  pngSrc: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  sizes: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low";
};

/** Single-resolution pair: {basename}.avif and {basename}.webp (no width suffix). */
export function EncodedPicture({
  basename,
  pngSrc,
  alt,
  className,
  width,
  height,
  sizes,
  loading = "lazy",
  fetchPriority,
}: EncodedPictureProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${basename}.avif`} sizes={sizes} />
      <source type="image/webp" srcSet={`${basename}.webp`} sizes={sizes} />
      <img
        src={pngSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
