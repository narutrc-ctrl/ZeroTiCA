import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { ContactForm, type ContactModalView } from "@/components/ContactForm";

type ContactModalContextValue = {
  open: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

const OPEN_EVENT = "zerotica:open-contact";
const CLOSE_EVENT = "zerotica:close-contact";

/** Astro island 경계에서도 동작 — Provider가 있으면 Context, 없으면 window 이벤트 */
export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (ctx) return ctx;
  return {
    open: false,
    openContactModal: () => window.dispatchEvent(new Event(OPEN_EVENT)),
    closeContactModal: () => window.dispatchEvent(new Event(CLOSE_EVENT)),
  };
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openContactModal = useCallback(() => setOpen(true), []);
  const closeContactModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener(CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener(CLOSE_EVENT, onClose);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContactModal();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeContactModal]);

  /** /contact 또는 /?inquiry=1 북마크 호환 */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    const shouldOpen = path === "/contact" || params.get("inquiry") === "1";
    if (!shouldOpen) return;
    openContactModal();
    if (params.get("inquiry") === "1") {
      params.delete("inquiry");
      const qs = params.toString();
      const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
      window.history.replaceState(null, "", next);
    }
  }, [openContactModal]);

  return (
    <ContactModalContext.Provider value={{ open, openContactModal, closeContactModal }}>
      {children}
      {open ? <ContactModalDialog onClose={closeContactModal} /> : null}
    </ContactModalContext.Provider>
  );
}

function ContactModalDialog({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<ContactModalView>("form");

  return (
    <div
      className="contact-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="contact-modal-dialog flex w-full max-w-lg shrink-0 flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-1 pt-5 sm:px-7 sm:pt-7">
          <div className="min-w-0 pr-2">
            <h2
              id="contact-modal-title"
              className="min-h-[1.75rem] text-[22px] font-extrabold leading-snug tracking-tight text-zinc-900 [word-break:keep-all] sm:min-h-8 sm:text-2xl"
            >
              {view === "privacy" ? "개인정보 수집·이용 안내" : "ZeroTiCA 도입 문의"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden px-5 py-5 sm:px-7 sm:pb-7">
          <ContactForm
            onSubmitted={onClose}
            view={view}
            onShowPrivacy={() => setView("privacy")}
            onContinueInquiry={() => setView("form")}
          />
        </div>
      </div>
    </div>
  );
}
