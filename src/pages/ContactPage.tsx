import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// TODO: 도입 문의 CTA — 요청 시 주석 해제
// import { useContactModal } from "@/components/ContactModal";

/** /contact — 모달을 연 뒤 소개 페이지로 돌아갑니다 (북마크·외부 링크 호환) */
export function ContactPage() {
  const navigate = useNavigate();
  // TODO: 도입 문의 CTA — 요청 시 주석 해제
  // const { openContactModal } = useContactModal();

  useEffect(() => {
    // TODO: 도입 문의 CTA — 요청 시 주석 해제
    // openContactModal();
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
