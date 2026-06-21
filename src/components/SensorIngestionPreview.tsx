import { CheckCircle2 } from "lucide-react";
import { demoSensorIngestion } from "@/data/demo-runa-data";

/** front SensorIngestionStatusCard UI 구조 — 데모 데이터 */
export function SensorIngestionPreview() {
  const d = demoSensorIngestion;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            데이터 수집 상태
          </h3>
          <p className="mt-0.5 text-xs text-emerald-800/85">{d.subtitle}</p>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-300 bg-emerald-100 px-2.5 py-2 text-xs font-medium text-emerald-950 shadow-sm">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {d.summaryLabel}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {d.sensors.map((s) => (
          <li key={s.id} className="flex items-center justify-between text-xs text-gray-800">
            <span className="flex items-center gap-2 font-medium">
              <span className="block h-2 w-2 rounded-full bg-emerald-500" />
              {s.id}
            </span>
            <span className="text-gray-500 tabular-nums">{s.detail}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-3 space-y-1 pl-1">
        {d.daySensors.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-xs leading-4 text-gray-700">
            <span className="flex h-4 w-4 items-center justify-center">
              <span className="block h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>
              <span className="font-medium">{s.id}</span>
              <span className="text-gray-500"> · conn {s.connRows}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[10px] leading-relaxed text-gray-500">
        RUNA 대시보드 · SensorIngestionStatusCard — conn gz·parquet 수집 여부를 날짜·센서별로 표시
      </p>
    </div>
  );
}
