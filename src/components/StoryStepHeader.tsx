export function StoryStepHeader({
  step,
  eyebrow,
  title,
  titleAccent,
  lead,
  dark,
}: {
  step: string;
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <p
        className={
          dark
            ? "text-sm font-bold tracking-widest text-cyan-400"
            : "text-sm font-bold tracking-widest text-blue-600"
        }
      >
        {eyebrow ?? `STEP ${step}`}
      </p>
      <h2
        className={`mt-3 max-w-3xl text-balance text-3xl font-bold sm:text-4xl [word-break:keep-all] ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
        {titleAccent ? (
          <>
            <br />
            <span className={dark ? "text-cyan-300" : "text-blue-600"}>{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {lead ? (
        <p className={`mt-5 max-w-3xl text-lg leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
