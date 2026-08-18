import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ContactModalProvider } from "@/components/ContactModal";
import { Layout } from "@/components/Layout";
import { LocaleRoute } from "@/components/LocaleRoute";
import { LandingPage } from "@/pages/LandingPage";
import { ContactPage } from "@/pages/ContactPage";
import { PrivacyPage } from "@/pages/legal/PrivacyPage";
import { TermsPage } from "@/pages/legal/TermsPage";
import { PerspectivesPage } from "@/pages/PerspectivesPage";

const DemoTaskPage = lazy(() =>
  import("@/pages/DemoTaskPage").then((m) => ({ default: m.DemoTaskPage })),
);
const DemoEventPage = lazy(() =>
  import("@/pages/DemoEventPage").then((m) => ({ default: m.DemoEventPage })),
);

function DemoFallback() {
  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center text-sm text-slate-500">
      데모 화면을 불러오는 중…
    </div>
  );
}

export default function App() {
  return (
    <ContactModalProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="legal/privacy" element={<PrivacyPage />} />
          <Route path="legal/terms" element={<TermsPage />} />
          <Route path="perspectives" element={<PerspectivesPage />} />
          <Route path="services" element={<Navigate to="/#choose" replace />} />
          <Route path="process" element={<Navigate to="/#journey" replace />} />
          <Route path="screens" element={<Navigate to="/#experience" replace />} />
          <Route
            path="demo/task"
            element={
              <Suspense fallback={<DemoFallback />}>
                <DemoTaskPage />
              </Suspense>
            }
          />
          <Route
            path="demo/event"
            element={
              <Suspense fallback={<DemoFallback />}>
                <DemoEventPage />
              </Suspense>
            }
          />
          <Route path="demo/report" element={<Navigate to="/demo/event?tab=reports" replace />} />

          <Route path=":locale" element={<LocaleRoute />}>
            <Route index element={<LandingPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="legal/privacy" element={<PrivacyPage />} />
            <Route path="legal/terms" element={<TermsPage />} />
            <Route path="perspectives" element={<PerspectivesPage />} />
            <Route
              path="demo/task"
              element={
                <Suspense fallback={<DemoFallback />}>
                  <DemoTaskPage />
                </Suspense>
              }
            />
            <Route
              path="demo/event"
              element={
                <Suspense fallback={<DemoFallback />}>
                  <DemoEventPage />
                </Suspense>
              }
            />
            <Route path="demo/report" element={<Navigate to="../event?tab=reports" replace />} />
          </Route>
        </Route>
      </Routes>
    </ContactModalProvider>
  );
}
