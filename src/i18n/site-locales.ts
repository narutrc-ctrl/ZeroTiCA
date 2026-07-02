export const SUPPORTED_LOCALES = ["ko-kr", "en-us"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "ko-kr";

export function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  if (!value) return false;
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}
