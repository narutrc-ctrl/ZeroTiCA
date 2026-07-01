import type { FlowVisualKey } from "@/data/content";

/** 스크롤 스토리용 확대 UI 캡처 — 데모 링크 없이 시각 전달 */
export function ProductCapture({ visual, large }: { visual: FlowVisualKey; large?: boolean }) {
  const scale = large ? "scale-100" : "scale-[0.92]";

  if (visual === "detect") {
    return (
      <CaptureFrame title="네트워크 탐지 · 이벤트 스트림" large={large}>
        <div className={cnWrap(scale)}>
          <div className="space-y-2 font-mono text-[11px]">
            {[
              { t: "14:22:01", level: "warn", msg: "long session outbound · 10.88.12.5 → 203.0.113.44" },
              { t: "14:22:18", level: "alert", msg: "response failure rate abnormal · 10.24.18.52" },
              { t: "14:23:05", level: "warn", msg: "conn dst reject outlier · SSH burst 10.200.10.15" },
            ].map((row) => (
              <div
                key={row.t}
                className={`rounded-lg border px-3 py-2 ${
                  row.level === "alert"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <span className="text-slate-400">{row.t}</span> {row.msg}
              </div>
            ))}
          </div>
        </div>
      </CaptureFrame>
    );
  }

  if (visual === "notify") {
    const bodyText = large ? "text-sm" : "text-xs";
    return (
      <CaptureFrame title="RUNA · 확인 요청" large={large}>
        <div className={cnWrap(large ? "scale-100" : scale)}>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <p className={`font-semibold text-blue-700 ${large ? "text-sm" : "text-xs"}`}>새 확인 요청</p>
            <p className={`mt-2 font-bold text-slate-900 ${large ? "text-base" : "text-sm"}`}>
              폐쇄망 IP (10.24.18.52) 기계적 통신 식별
            </p>
            <p className={`mt-2 text-slate-600 ${bodyText}`}>
              분석팀이 의심 통신을 검토했습니다. 업무 맥락 확인이 필요합니다.
            </p>
            <span className={`mt-3 inline-block rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white ${bodyText}`}>
              확인하기
            </span>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 opacity-60">
            <p className={bodyText + " text-slate-500"}>다수의 내부 IP 대상 SSH 연결 시도 · 검증 중</p>
          </div>
        </div>
      </CaptureFrame>
    );
  }

  if (visual === "interact") {
    const bodyText = large ? "text-sm" : "text-xs";
    const titleText = large ? "text-base" : "text-sm";
    return (
      <CaptureFrame title="이슈 상세 · 고객 협업" large={large}>
        <div className={cnWrap(large ? "scale-100" : scale)}>
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 px-4 py-3.5">
              <p className={`font-bold text-slate-900 ${titleText}`}>폐쇄망 IP 기계적 통신 문의</p>
              <span className="mt-1.5 inline-block rounded-lg border border-blue-300 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
                확인 요청
              </span>
            </div>
            <div className={`space-y-2.5 p-4 ${bodyText}`}>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium text-slate-700">분석팀 · 11:20</p>
                <p className="mt-1 leading-relaxed text-slate-600">정기 배포 통신인지 확인 부탁드립니다.</p>
              </div>
              <div className="rounded-lg bg-sky-50 p-3">
                <p className="font-medium text-slate-700">demo_admin · 09:40</p>
                <p className="mt-1 leading-relaxed text-slate-600">정기 패치 미러 서버 통신입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </CaptureFrame>
    );
  }

  if (visual === "verify") {
    return (
      <CaptureFrame title="전문가 검증 · 위험도 판단" large={large}>
        <div className={cnWrap(scale)}>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: "정상", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { label: "주의", color: "bg-amber-50 text-amber-700 border-amber-200" },
              { label: "위협", color: "bg-red-50 text-red-700 border-red-200" },
            ].map((b) => (
              <div key={b.label} className={`rounded-xl border px-2 py-3 font-semibold ${b.color}`}>
                {b.label}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-900">검증 결과 요약</p>
            <p className="mt-2 text-slate-600">
              탐지 데이터 + 고객 응답 + 전문가 분석을 결합해 「주의」등급으로 분류. 추가 모니터링
              및 화이트리스트 검토 권고.
            </p>
          </div>
        </div>
      </CaptureFrame>
    );
  }

  if (visual === "action") {
    return (
      <CaptureFrame title="조치 타임라인" large={large}>
        <div className={cnWrap(scale)}>
          <ol className="relative space-y-4 border-l-2 border-blue-200 pl-5 text-sm">
            {[
              { t: "05-12 10:55", l: "의심 통신 탐지" },
              { t: "05-12 11:20", l: "고객 확인 요청" },
              { t: "05-13 09:40", l: "고객 응답 · 정상 업무 확인" },
              { t: "05-13 14:00", l: "화이트리스트 반영 권고" },
              { t: "05-14 10:00", l: "완료 · 이슈 종결" },
            ].map((item) => (
              <li key={item.t} className="relative">
                <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                <p className="text-xs text-slate-400">{item.t}</p>
                <p className="font-medium text-slate-800">{item.l}</p>
              </li>
            ))}
          </ol>
        </div>
      </CaptureFrame>
    );
  }

  return (
    <CaptureFrame title="침해 평가 보고서" large={large}>
      <div className={cnWrap(scale)}>
        <div
          className="mx-auto overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel"
          style={{ aspectRatio: "210/297", maxHeight: large ? 420 : 320 }}
        >
          <div className="p-5 text-[10px]">
            <p className="text-blue-600">침해 평가 보고서</p>
            <h3 className="mt-1 text-lg font-extrabold text-slate-900">ZeroTica Watch</h3>
            <div className="my-3 h-px bg-blue-500" />
            <p className="font-semibold">01. 침해 평가 개요</p>
            <p className="mt-1 text-slate-600">평가 기간 위협 12건 · 검증 완료 3건</p>
            <p className="mt-4 font-semibold">03. 위협 분석 결과 요약</p>
            <p className="mt-1 text-slate-600">사건별 원인·조치·상태가 날짜순으로 정리됩니다.</p>
          </div>
        </div>
      </div>
    </CaptureFrame>
  );
}

function CaptureFrame({
  title,
  children,
  large,
}: {
  title: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl ${
        large ? "p-5" : "p-4"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className={`ml-2 text-slate-400 ${large ? "text-sm" : "text-xs"}`}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function cnWrap(scale: string) {
  return `origin-top transition-transform ${scale}`;
}
