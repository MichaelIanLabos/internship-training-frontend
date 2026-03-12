export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden items-center py-10 lg:flex">
          <div className="max-w-xl text-slate-100">
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Internship Platform
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Build production-ready engineering skills
            </h1>
            <p className="mt-5 text-base text-slate-300">
              Track your learning path, review practical tasks, and move from
              onboarding to real project contribution with confidence.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                Structured modules for Git, APIs, and testing fundamentals.
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                Clean progress tracking to keep your weekly goals visible.
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                A focused workspace designed for practical engineering growth.
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center py-6 sm:py-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </div>
  );
}
