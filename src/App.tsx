import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { DemoTaskPage } from "@/pages/DemoTaskPage";
import { DemoEventPage } from "@/pages/DemoEventPage";
import { ContactPage } from "@/pages/ContactPage";
import { PrivacyPage } from "@/pages/legal/PrivacyPage";
import { TermsPage } from "@/pages/legal/TermsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="legal/privacy" element={<PrivacyPage />} />
        <Route path="legal/terms" element={<TermsPage />} />
        <Route path="services" element={<Navigate to="/#services" replace />} />
        <Route path="process" element={<Navigate to="/#flow" replace />} />
        <Route path="screens" element={<Navigate to="/#experience" replace />} />
        <Route path="demo/task" element={<DemoTaskPage />} />
        <Route path="demo/event" element={<DemoEventPage />} />
        <Route path="demo/report" element={<Navigate to="/demo/event?tab=reports" replace />} />
      </Route>
    </Routes>
  );
}
