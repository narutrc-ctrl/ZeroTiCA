import { Navigate, Outlet, useParams } from "react-router-dom";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/site-locales";

export function LocaleRoute() {
  const { locale } = useParams();

  if (!isSupportedLocale(locale)) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  return <Outlet />;
}
