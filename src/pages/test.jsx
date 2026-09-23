"use client";
import QuestionTimer from "@/components/QuestionTimer";
import Results from "@/components/Results";
import { usePoints } from "@/context/PointContext";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, LogOut, XCircle } from "lucide-react";

export default function TestPage() {
  const [mcqs, setMcqs] = useState([]);
  const { points, setPoints } = usePoints();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(0);

  // Save test state to localStorage
  const saveTestState = () => {
    const testState = {
      currentQuestionIndex,
      selectedOption,
      isAnswered,
      showResults,
      correctAnswers,
      wrongAnswers,
      unattemptedQuestions,
      totalTimeSpent,
      timePerQuestion
    };
    localStorage.setItem("testState", JSON.stringify(testState));
  };

  // Load test state from localStorage
  const loadTestState = () => {
    const stored = localStorage.getItem("testState");
    if (stored) {
      const testState = JSON.parse(stored);
      setCurrentQuestionIndex(testState.currentQuestionIndex || 0);
      setSelectedOption(testState.selectedOption || null);
      setIsAnswered(testState.isAnswered || false);
      setShowResults(testState.showResults || false);
      setCorrectAnswers(testState.correctAnswers || 0);
      setWrongAnswers(testState.wrongAnswers || 0);
      setUnattemptedQuestions(testState.unattemptedQuestions || 0);
      setTotalTimeSpent(testState.totalTimeSpent || 0);
      setTimePerQuestion(testState.timePerQuestion || 0);
    }
  };

  useEffect(() => {
    const xx = localStorage.getItem("mcqs");
    if(!xx){
    alert("Unfair means detected.. closing the test");
    localStorage.removeItem("testState");
    
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setUnattemptedQuestions(0);
    setTotalTimeSpent(0);
    setTimePerQuestion(0);
    setPoints(0);
    console.log("Test ended and returned to dashboard.");
    router.replace("/dashboard");
    return;
    }
    const decryptedBytes = CryptoJS.AES.decrypt(localStorage.getItem("mcqs"),  process.env.NEXT_PUBLIC_MCQSECRET);
    const stored = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    if(!stored){
      alert("No questions found. Please start a new test.");
      router.replace("/dashboard");
      return;
    }
    if (stored) {
      //setQuestions(JSON.parse(stored));
      setQuestions(stored);
      // Load test state after setting questions
      loadTestState();
    }
  }, []);

  // Save test state whenever it changes
  useEffect(() => {
    if (questions.length > 0) {
      saveTestState();
    }
  }, [currentQuestionIndex, selectedOption, isAnswered, showResults, correctAnswers, wrongAnswers, unattemptedQuestions, totalTimeSpent, timePerQuestion]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handleBackButton = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setTotalTimeSpent(totalTimeSpent + timePerQuestion);

    if (option === questions[currentQuestionIndex].answer) {
      setPoints(points + 4);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setUnattemptedQuestions(unattemptedQuestions + 1);
    setTotalTimeSpent(totalTimeSpent + 20);
    handleNext();
  };

  const handleNext = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimePerQuestion(0);
    } else {
      setShowResults(true);
    }
  };

  const handleEndTest = () => {
     const confirmEnd = window.confirm("Are you sure you want to end the test and return to the dashboard?");
    if (!confirmEnd) return;
    
    // Clear both mcqs and test state when ending test
    localStorage.removeItem("mcqs");
    localStorage.removeItem("testState");
    
    router.push("/dashboard");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setUnattemptedQuestions(0);
    setTotalTimeSpent(0);
    setTimePerQuestion(0);
    setPoints(0);
    console.log("Test ended and returned to dashboard.");
  };

  const percentage = Math.round((correctAnswers / questions.length) * 100);
  const averageTimePerQuestion = (totalTimeSpent / questions.length).toFixed(2);

  // Keyboard shortcuts: 1-4 / A-D to answer, Enter to continue
  useEffect(() => {
    const onKeyDown = (e) => {
      if (showResults || e.ctrlKey || e.metaKey || e.altKey) return;
      const options = questions[currentQuestionIndex]?.options || [];
      const key = e.key.toLowerCase();
      const index = "1234".includes(key) ? Number(key) - 1 : "abcd".indexOf(key);
      if (!isAnswered && key.length === 1 && index >= 0 && index < options.length) {
        handleAnswer(options[index]);
      } else if (isAnswered && e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const current = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === questions.length - 1;
  const timedOut = isAnswered && selectedOption === null;

  if (showResults) {
    return (
      <Results
        score={points}
        totalQuestions={questions.length}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        unattemptedQuestions={unattemptedQuestions}
        percentage={percentage}
        timeSpent={totalTimeSpent}
        averageTimePerQuestion={averageTimePerQuestion}
      />
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          Question <span className="text-slate-900">{currentQuestionIndex + 1}</span> of {questions.length}
        </p>
        <button
          onClick={handleEndTest}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" />
          End quiz
        </button>
      </div>

      {/* Segmented progress */}
      <div className="mb-6 flex gap-1" aria-hidden="true">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < currentQuestionIndex ? "bg-brand-600" : i === currentQuestionIndex ? "bg-brand-300" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div key={currentQuestionIndex} className="card animate-fade-up p-6 sm:p-8">
        <QuestionTimer
          onTimeUp={handleTimeUp}
          setTimePerQuestion={setTimePerQuestion}
          isAnswered={isAnswered}
          resetTimer={currentQuestionIndex}
        />

        <h1 className="mt-6 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">{current.question}</h1>

        <div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer options">
          {current.options.map((option, i) => {
            const isCorrect = option === current.answer;
            const isPicked = option === selectedOption;
            let state = "border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/40";
            let badge = "bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700";
            if (isAnswered && isCorrect) {
              state = "border-emerald-400 bg-emerald-50";
              badge = "bg-emerald-500 text-white";
            } else if (isAnswered && isPicked) {
              state = "border-rose-400 bg-rose-50";
              badge = "bg-rose-500 text-white";
            } else if (isAnswered) {
              state = "border-slate-200 bg-white opacity-50";
            }

            return (
              <button
                key={option}
                role="radio"
                aria-checked={isPicked}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`group flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left font-medium text-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-default ${state}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${badge}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
                {isAnswered && isPicked && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-rose-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 animate-fade-up space-y-4">
            <div
              role="status"
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                timedOut
                  ? "bg-amber-50 text-amber-800"
                  : selectedOption === current.answer
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-rose-50 text-rose-800"
              }`}
            >
              {timedOut
                ? `Time's up! The answer was "${current.answer}".`
                : selectedOption === current.answer
                ? "Correct! +4 points"
                : `Not quite — the answer is "${current.answer}".`}
            </div>
            <button onClick={handleNext} autoFocus className="btn-primary w-full py-3.5">
              {isLast ? "See results" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 hidden text-center text-xs text-slate-400 sm:block">
        Tip: press <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans">1</kbd>–
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans">4</kbd> to answer,{" "}
        <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-sans">Enter</kbd> to continue
      </p>
    </div>
  );
}
