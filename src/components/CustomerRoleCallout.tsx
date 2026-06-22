/** 고객 역할 callout — 3막·8단계 공통 스타일 */
export function CustomerRoleCallout({ note }: { note: string }) {
  const body = note.replace(/^고객님이 하시는 일:?\s*/u, "");
  return (
    <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">고객님이 하시는 일</p>
      <p className="mt-1.5 text-sm leading-relaxed text-emerald-950">{body}</p>
    </div>
  );
}
