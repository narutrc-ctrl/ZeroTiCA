import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ContactModalProvider } from "@/components/ContactModal";
import { DemoTourBar } from "@/components/DemoTourBar";
import { DemoTourPrompt } from "@/components/DemoTourPrompt";
import { GlobalTour } from "@/components/GlobalTour";
import { DemoEventPage } from "@/views/DemoEventPage";
import { DemoTaskPage } from "@/views/DemoTaskPage";
import { trackDemoStartIfNeeded } from "@/lib/analytics";

/**
 * Astro 데모 페이지용 클라이언트 섬.
 * SiteShell(헤더/푸터) 없이 SPA Layout의 데모 전용 크롬 + 라우트를 그대로 옮긴다.
 */
export function DemoIsland() {
  return (
    <BrowserRouter>
      <ContactModalProvider>
        <DemoChrome />
      </ContactModalProvider>
    </BrowserRouter>
  );
}

function DemoChrome() {
  const location = useLocation();

  useEffect(() => {
    trackDemoStartIfNeeded(location.pathname);
  }, [location.pathname]);

  return (
    <div className="h-screen overflow-hidden bg-white">
      <DemoTourBar />
      <div className="h-[calc(100vh-40px)]">
        <Routes>
          <Route path="/demo/task" element={<DemoTaskPage />} />
          <Route path="/demo/event" element={<DemoEventPage />} />
          <Route path="/demo/report" element={<Navigate to="/demo/event?tab=reports" replace />} />
          <Route path="*" element={<Navigate to="/demo/task" replace />} />
        </Routes>
      </div>
      <DemoTourPrompt />
      <GlobalTour />
    </div>
  );
}
