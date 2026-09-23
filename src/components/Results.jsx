"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2, MinusCircle, Star, Timer, Trophy, XCircle } from "lucide-react";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useRouter } from "next/navigation";
import axios from "axios";
import CryptoJS from "crypto-js";
//import mcqs from "/mcqs.json"; // Import the MCQs data

const Results = ({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  unattemptedQuestions,
  percentage,
  timeSpent,
  averageTimePerQuestion,
}) => {
  // Celebrate passing scores only
  const [showConfetti, setShowConfetti] = useState(percentage >= 50);
  const [saving, setSaving] = useState(false);
  const { width, height } = useWindowSize();
  const router = useRouter();

  // Disable confetti after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

const handleGoToDashboard = async () => {
  setSaving(true);
  const email = localStorage.getItem("email"); // Retrieve email from localStorage
  const decryptedBytes = CryptoJS.AES.decrypt(localStorage.getItem("mcqs"),  process.env.NEXT_PUBLIC_MCQSECRET);
  const mcqs = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  try {
    const response = await axios.post("/api/saveMcqs", {
      email,
      mcqs,
    });

    console.log("MCQs saved to MongoDB:", response.data.message);


    //not updated on vercel yet
    localStorage.removeItem("mcqs");
    localStorage.removeItem("testState");


    //redirect to dashboard
    router.replace("/dashboard");
  } catch (error) {
    console.error("Error in handleGoToDashboard:", error);
    alert("Failed to save MCQs. Please try again.");
    setSaving(false);
  }
};

  const verdict =
    percentage >= 80
      ? { title: "Outstanding!", text: "You've clearly mastered this material.", color: "text-emerald-600", ring: "#10b981" }
      : percentage >= 50
      ? { title: "Nice work!", text: "Solid effort — a quick review will push you higher.", color: "text-brand-600", ring: "#5f3ff0" }
      : { title: "Keep practicing", text: "Review the material and try again — you'll get there.", color: "text-amber-600", ring: "#f59e0b" };

  // Score ring geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percentage, 0), 100) / 100);

  const stats = [
    { label: "Correct", value: correctAnswers, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Wrong", value: wrongAnswers, icon: XCircle, tone: "bg-rose-50 text-rose-600" },
    { label: "Skipped", value: unattemptedQuestions, icon: MinusCircle, tone: "bg-amber-50 text-amber-600" },
    { label: "Points earned", value: correctAnswers * 4, icon: Star, tone: "bg-brand-50 text-brand-600" },
    { label: "Total time", value: `${timeSpent.toFixed(0)}s`, icon: Clock, tone: "bg-sky-50 text-sky-600" },
    { label: "Avg per question", value: `${averageTimePerQuestion}s`, icon: Timer, tone: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />}

      <div className="card animate-fade-up overflow-hidden">
        {/* Score hero */}
        <div className="flex flex-col items-center gap-8 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-6 py-10 sm:flex-row sm:justify-center sm:gap-12">
          <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={verdict.ring}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-[stroke-dashoffset] duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">{percentage}%</span>
              <span className="text-xs font-medium text-slate-500">accuracy</span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className={`inline-flex items-center gap-2 text-sm font-semibold ${verdict.color}`}>
              <Trophy className="h-4 w-4" />
              Quiz complete
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{verdict.title}</h1>
            <p className="mt-2 max-w-xs text-slate-600">{verdict.text}</p>
            <p className="mt-4 text-sm text-slate-500">
              You scored <span className="font-semibold text-slate-900">{correctAnswers * 4}</span> of{" "}
              {totalQuestions * 4} points
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="flex items-center gap-3 bg-white p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
                <p className="text-xs font-medium text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6">
          <button onClick={handleGoToDashboard} disabled={saving} className="btn-primary w-full py-3.5">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving your quiz…
              </>
            ) : (
              "Save & back to dashboard"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">
            This quiz will be saved to your history so you can review it later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
