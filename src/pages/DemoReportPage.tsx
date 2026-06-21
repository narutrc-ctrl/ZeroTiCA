import { Navigate } from "react-router-dom";

/** @deprecated /demo/event?tab=reports 로 통합 */
export function DemoReportPage() {
  return <Navigate to="/demo/event?tab=reports" replace />;
}
