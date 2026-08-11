const logLines = [
  "14:22:01 conn 10.24.18.52 → 203.0.113.44 :443",
  "14:22:18 long_session outbound · duration 4h12m",
  "14:23:05 ioc match · tag=c2_candidate",
  "14:23:41 task created · ZT-2026-0512",
  "14:24:02 notify customer · context required",
];

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_50%,rgba(6,182,212,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />

      <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full text-cyan-400/20"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          [180, 120, 420, 280],
          [420, 280, 680, 200],
          [680, 200, 920, 340],
          [320, 420, 560, 520],
          [560, 520, 840, 480],
          [180, 120, 320, 420],
          [920, 340, 1040, 560],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#hero-line)" strokeWidth="1" />
        ))}
        {[
          [180, 120],
          [420, 280],
          [680, 200],
          [920, 340],
          [320, 420],
          [560, 520],
          [840, 480],
          [1040, 560],
        ].map(([cx, cy], i) => (
          <g key={`n-${i}`}>
            <circle cx={cx} cy={cy} r="5" fill="currentColor" fillOpacity="0.15" />
            <circle cx={cx} cy={cy} r="2" fill="currentColor" fillOpacity="0.45" />
          </g>
        ))}
      </svg>

      <div className="absolute right-[4%] top-[18%] hidden max-w-xs space-y-2 font-mono text-[10px] leading-relaxed text-cyan-300/25 lg:block xl:right-[8%]">
        {logLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
}
