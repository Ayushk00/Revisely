"use client";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

const QuestionTimer = ({ onTimeUp, setTimePerQuestion, isAnswered, resetTimer }) => {
  const [seconds, setSeconds] = useState(20); // 20 seconds for each question

  useEffect(() => {
    if (!isAnswered && seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds((prev) => prev - 1);
        setTimePerQuestion(20 - seconds);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && !isAnswered) {
      onTimeUp();
    }
  }, [seconds, isAnswered]);

  // Reset the timer whenever a new question is loaded
  useEffect(() => {
    setSeconds(20); // Reset the timer to 20 seconds
  }, [resetTimer]); // `resetTimer` is a prop that changes when a new question is loaded

  const remainingPercentage = (seconds / 20) * 100;
  const tone =
    seconds <= 5
      ? { pill: "bg-rose-50 text-rose-700 ring-rose-200", bar: "bg-rose-500" }
      : seconds <= 10
      ? { pill: "bg-amber-50 text-amber-700 ring-amber-200", bar: "bg-amber-500" }
      : { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500" };

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {isAnswered ? "Answered" : seconds <= 5 ? "Hurry up!" : "Choose your answer"}
        </span>
        <span
          role="timer"
          aria-live="off"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums ring-1 ${tone.pill} ${
            seconds <= 5 && !isAnswered ? "animate-pulse" : ""
          }`}
        >
          <Timer className="h-4 w-4" />
          {seconds}s
        </span>
      </div>

      {/* Time remaining bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${tone.bar}`}
          style={{ width: `${remainingPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionTimer;
