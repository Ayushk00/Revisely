import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  History,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Timer,
  Upload,
} from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: Upload, title: "Upload a PDF", text: "Lecture notes, a textbook chapter or a paper — up to 10 MB." },
  { icon: ListChecks, title: "Pick a question count", text: "Choose how many MCQs you want, from a quick 5 to a full 50." },
  { icon: Timer, title: "Take the quiz", text: "20 seconds per question, instant feedback and a full score report." },
];

const features = [
  { icon: Sparkles, title: "AI-written questions", text: "Four options, one right answer, grounded in your document." },
  { icon: Timer, title: "Timed practice", text: "A per-question timer builds exam-day speed and focus." },
  { icon: BarChart3, title: "Instant results", text: "Accuracy, time per question and points the moment you finish." },
  { icon: History, title: "Review anytime", text: "Every quiz is saved so you can revisit questions and answers." },
  { icon: FileText, title: "Any subject", text: "Works with whatever you're studying — if it's in a PDF, it's in." },
  { icon: ShieldCheck, title: "Private by default", text: "Your quizzes are tied to your account and nobody else's." },
];

const sampleOptions = ["Mitochondria", "Chloroplast", "Ribosome", "Nucleus"];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center">
          <div className="h-[36rem] w-[60rem] rounded-full bg-gradient-to-br from-brand-200/60 via-fuchsia-100/50 to-sky-100/60 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-medium text-brand-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI-powered revision
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Turn any PDF into a{" "}
              <span className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent">
                quiz in seconds
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
              Upload your notes and Revisely writes multiple-choice questions for you. Practice with a timer, get instant
              feedback, and actually remember what you read.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/signup" className="btn-primary px-6 py-3.5">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-secondary px-6 py-3.5">
                I already have an account
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">Free to sign up · ₹100 for 30 quizzes when you’re ready</p>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:120ms]">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-500/20 to-fuchsia-400/20 blur-2xl" />
            <div className="card p-6 shadow-xl shadow-brand-900/5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-500">Question 3 of 10</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                  <Timer className="h-3.5 w-3.5" /> 14s
                </span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 w-[30%] rounded-full bg-brand-500" />
              </div>
              <p className="mt-6 text-lg font-semibold text-slate-900">
                Which organelle is responsible for photosynthesis in plant cells?
              </p>
              <div className="mt-5 space-y-2.5">
                {sampleOptions.map((option, i) => {
                  const correct = option === "Chloroplast";
                  return (
                    <div
                      key={option}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                        correct
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                          correct ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                      {correct && <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200/70 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From reading to recall in three steps
            </h2>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                <span className="absolute right-6 top-6 text-5xl font-extrabold text-slate-100">{i + 1}</span>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="relative mt-2 text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Why Revisely</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to study actively
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-14 text-center text-white shadow-xl shadow-brand-900/20 sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Your next exam starts with one upload</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
            Create an account, drop in a PDF and take your first quiz in under a minute.
          </p>
          <Link
            href="/signup"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            Get started with Revisely
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
