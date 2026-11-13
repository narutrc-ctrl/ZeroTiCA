import type { ReactNode } from "react";
import { ContactModalProvider } from "@/components/ContactModal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type Props = {
  currentPath: string;
  children: ReactNode;
};

/** Astro 마케팅 페이지 공통 껍데기 — 헤더/푸터 + 문의 모달 Provider */
export function SiteShell({ currentPath, children }: Props) {
  return (
    <ContactModalProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader currentPath={currentPath} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </ContactModalProvider>
  );
}
