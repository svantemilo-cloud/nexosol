/**
 * Filenames public/{basename}-{w}.avif|.webp måste matcha utdata från
 * npm run images:responsive (scripts/generate-responsive-images.mjs).
 */
export const HERO_PIC_WIDTHS = [640, 828, 1024] as const;
export const COMPARE_PIC_WIDTHS = [640, 828, 1024] as const;
export const PRODUCT_CARD_STANDARD_WIDTHS = [480, 640, 828, 1024] as const;
export const PRODUCT_CARD_LADDBOX_WIDTHS = [360, 480, 640, 768] as const;
export const INSTALLER_LOGO_WIDTHS = [128, 176, 256] as const;
