import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Upload any PDF — notes, chapters, research papers",
  "AI writes multiple-choice questions in seconds",
  "Timed quizzes with instant, detailed results",
];

// Split-screen shell shared by the login and signup pages
export default function AuthLayout({ icon: Icon, title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Revisely</p>
          <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight">
            Turn your study material into practice that sticks.
          </h2>
        </div>

        <ul className="relative space-y-4">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-brand-50">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="relative text-sm text-brand-200">Active recall beats re-reading. Every time.</p>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-slate-600">{subtitle}</p>
          </div>

          {children}

          {footer && <div className="mt-8 text-center text-xs text-slate-500">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
