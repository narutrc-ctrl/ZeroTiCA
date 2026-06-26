import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContactModal } from "@/components/ContactModal";

/** /contact — 모달을 연 뒤 소개 페이지로 돌아갑니다 (북마크·외부 링크 호환) */
export function ContactPage() {
  const navigate = useNavigate();
  const { openContactModal } = useContactModal();

  useEffect(() => {
    openContactModal();
    navigate("/", { replace: true });
  }, [navigate, openContactModal]);

  return null;
}
