import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Mail, Phone, X } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/data/content";

type ContactModalContextValue = {
  open: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openContactModal = useCallback(() => setOpen(true), []);
  const closeContactModal = useCallback(() => setOpen(false), []);

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

  return (
    <ContactModalContext.Provider value={{ open, openContactModal, closeContactModal }}>
      {children}
      {open ? <ContactModalDialog onClose={closeContactModal} /> : null}
    </ContactModalContext.Provider>
  );
}

function ContactModalDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">문의</p>
            <h2 id="contact-modal-title" className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              도입·상담 문의
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              인사이트·와치 도입, PoC, 견적 문의를 남겨 주시면 담당자가 연락드립니다.
            </p>
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
            <ContactForm onSubmitted={onClose} />
            <aside className="space-y-4 lg:pt-1">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">연락처</p>
                <ul className="mt-3 space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <a href={`mailto:${site.contactEmail}`} className="hover:text-blue-600 hover:underline">
                      {site.contactEmail}
                    </a>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <div>
                      <a
                        href={`tel:${site.contactPhone.replace(/-/g, "")}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {site.contactPhone}
                      </a>
                      <p className="mt-0.5 text-xs text-slate-500">평일 09:00–18:00</p>
                    </div>
                  </li>
                </ul>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                소개 페이지를 먼저 읽으신 뒤 문의해 주시면 상담이 더 수월합니다.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
