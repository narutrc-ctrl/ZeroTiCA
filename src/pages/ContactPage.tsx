import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// TODO: 도입 문의 CTA — 요청 시 주석 해제
// import { useContactModal } from "@/components/ContactModal";

/** /contact — 문의 섹션으로 이동 (북마크·외부 링크 호환) */
export function ContactPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ pathname: "/", hash: "contact" }, { replace: true });
  }, [navigate]);

  return null;
}
