import type { FlowVisualKey } from "@/data/content";
import type { JourneyVisualId } from "@/data/journey-steps";
import { MethodologyCapture, type MethodologyScreenId } from "@/components/MethodologyCapture";
import { ProductCapture } from "@/components/ProductCapture";
import { SensorIngestionPreview } from "@/components/SensorIngestionPreview";

const RUNA_SCREENS = {
  "event-detail-agent": true,
  "long-session": true,
  "ioc-batch": true,
  "task-whitelist": true,
  "event-dashboard": true,
} as const;

const PRODUCT_VISUALS: Record<string, FlowVisualKey> = {
  notify: "notify",
  interact: "interact",
  verify: "verify",
  action: "action",
  report: "report",
};

export function JourneyVisual({ id, large = true }: { id: JourneyVisualId; large?: boolean }) {
  if (id === "sensor") {
    return <SensorIngestionPreview />;
  }

  if (id in RUNA_SCREENS) {
    const captureId = id === "task-whitelist" ? "task-and-whitelist" : id;
    return <MethodologyCapture id={captureId as MethodologyScreenId} />;
  }

  const productKey = PRODUCT_VISUALS[id];
  if (productKey) {
    return <ProductCapture visual={productKey} large={large} />;
  }

  return <SensorIngestionPreview />;
}
