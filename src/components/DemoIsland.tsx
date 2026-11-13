import { useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ContactModalProvider } from "@/components/ContactModal";
import { DemoTourBar } from "@/components/DemoTourBar";
import { DemoTourPrompt } from "@/components/DemoTourPrompt";
import { GlobalTour } from "@/components/GlobalTour";
import { DemoEventPage } from "@/views/DemoEventPage";
import { DemoTaskPage } from "@/views/DemoTaskPage";
import { trackDemoStartIfNeeded } from "@/lib/analytics";

type Props = {
  /** SSR·첫 hydrate용 위치. 예: "/demo/task?tour=full&step=0" */
  url: string;
};

/** build.format=file 이면 Astro.url.pathname 이 `/demo/task.html` 이라 라우트와 맞춤 */
function normalizeDemoUrl(url: string): string {
  const parsed = new URL(url, "https://zerotica.narusec.com");
  let path = parsed.pathname.replace(/\/$/, "") || "/";
  if (path.endsWith(".html")) path = path.slice(0, -5);
  return `${path}${parsed.search}`;
}

/**
 * Astro 데모 섬.
 * - SSR/첫 페인트: MemoryRouter → HTML에 데모 UI 포함 (진입 깜빡임 완화)
 * - hydrate 이후: BrowserRouter → 주소창·투어 라우팅 동기화
 */
export function DemoIsland({ url }: Props) {
  const locationUrl = normalizeDemoUrl(url);
  return (
    <DemoRouter url={locationUrl}>
      <ContactModalProvider>
        <DemoChrome />
      </ContactModalProvider>
    </DemoRouter>
  );
}

function DemoRouter({ url, children }: { url: string; children: ReactNode }) {
  // 서버·클라 첫 렌더를 MemoryRouter로 맞춰 hydrate mismatch를 피한다.
  // (StaticRouter는 react-router-dom/server 전용이라 클라 번들에 넣지 않음)
  const [useBrowser, setUseBrowser] = useState(false);
  useEffect(() => {
    setUseBrowser(true);
  }, []);

  if (!useBrowser) {
    return (
      <MemoryRouter initialEntries={[url]} initialIndex={0}>
        {children}
      </MemoryRouter>
    );
  }
  return <BrowserRouter>{children}</BrowserRouter>;
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
