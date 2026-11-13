import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="zt-container zt-section max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-800">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        요청하신 주소에 해당하는 페이지가 없습니다.
      </p>
      <Link to="/" className="zt-btn-ghost mt-10">
        홈으로
      </Link>
    </div>
  );
}
