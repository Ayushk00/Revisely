// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function McqsCards() {
//   const [mcqsDocs, setMcqsDocs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const email = localStorage.getItem("email");
//     if (!email) {
//       setError("No email found in localStorage");
//       setLoading(false);
//       return;
//     }

//     axios
//       .get("/api/getMcqsbyEmail", { params: { email } })
//       .then((res) => {
//         setMcqsDocs(res.data.mcqs || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.error || "Failed to fetch MCQs");
//         setLoading(false);
//       });
//   }, []);

//   const openMcqsInNewWindow = (doc) => {
//     const newWindow = window.open("", "_blank", "width=800,height=600");
//     const dateString = new Date(doc.createdAt).toLocaleDateString();

//     const html = `
//       <html>
//         <head>
//           <title>MCQs from ${dateString}</title>
//           <style>
//             body { font-family: sans-serif; padding: 20px; }
//             h2 { color: #333; }
//             .question { background: #f5f5f5; padding: 10px; margin-bottom: 15px; border-radius: 6px; }
//             ul { padding-left: 20px; }
//             em { color: green; }
//           </style>
//         </head>
//         <body>
//           <h2>MCQs from ${dateString}</h2>
//           ${doc.mcqs
//             .map(
//               (q, i) => `
//             <div class="question">
//               <p><strong>Q${i + 1}:</strong> ${q.question}</p>
//               <ul>
//                 ${q.options.map((opt) => `<li>${opt}</li>`).join("")}
//               </ul>
//               <p><em>Answer: ${q.answer}</em></p>
//             </div>
//           `
//             )
//             .join("")}
//         </body>
//       </html>
//     `;

//     newWindow.document.write(html);
//     newWindow.document.close();
//   };

//   if (loading) return <p>Loading data...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!mcqsDocs.length) return <p>No MCQs found.</p>;

//   return (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
//       {mcqsDocs.map(({ _id, createdAt, mcqs }) => {
//         const dateString = new Date(createdAt).toLocaleDateString();

//         return (
//           <div
//             key={_id}
//             onClick={() => openMcqsInNewWindow({ _id, createdAt, mcqs })}
//             style={{
//               cursor: "pointer",
//               border: "1px solid #ddd",
//               borderRadius: "10px",
//               padding: "16px",
//               width: "300px",
//               boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//               backgroundColor: "#fff",
//               transition: "0.2s ease",
//             }}
//           >
//             <h3 style={{ marginBottom: "10px", color: "#333" }}>
//               MCQs from {dateString}
//             </h3>
//             <p style={{ color: "#888" }}>Click to view questions</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


import { AlertCircle, ArrowRight, Calendar, CheckCircle2, ChevronRight, FileText, Layers, Loader2, Search, Sparkles, X } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function McqsCards() {
  const [mcqsDocs, setMcqsDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      setError("No email found");
      setLoading(false);
      return;
    }

    fetch(`/api/getMcqsbyEmail?email=${email}`)
      .then(res => res.json())
      .then((data) => {
        setMcqsDocs(data.mcqs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch MCQs");
        setLoading(false);
      });
  }, []);

  // Close the review panel with Escape and lock page scroll while it's open
  useEffect(() => {
    if (!selectedDoc) return;
    const onKey = (e) => e.key === "Escape" && setSelectedDoc(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedDoc]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  // Newest first; match on date or any question text
  const term = searchTerm.trim().toLowerCase();
  const filteredMcqs = [...mcqsDocs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(doc => {
      if (!term) return true;
      const dateString = `${new Date(doc.createdAt).toLocaleDateString()} ${formatDate(doc.createdAt)}`.toLowerCase();
      return dateString.includes(term) || doc.mcqs.some(q => q.question.toLowerCase().includes(term));
    });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-600" />
          <p className="text-slate-600">Loading your quizzes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="card max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
          <h2 className="text-lg font-semibold text-slate-900">Couldn&apos;t load your history</h2>
          <p className="mt-2 text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!mcqsDocs.length) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="card max-w-md p-10 text-center animate-fade-up">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <FileText className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No quizzes yet</h2>
          <p className="mt-2 text-slate-600">
            Finish your first quiz and it&apos;ll show up here for review.
          </p>
          <Link href="/dashboard" className="btn-primary mt-6">
            <Sparkles className="h-4 w-4" />
            Create a quiz
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = mcqsDocs.reduce((total, doc) => total + doc.mcqs.length, 0);
  const latest = new Date(Math.max(...mcqsDocs.map(doc => new Date(doc.createdAt))));

  const stats = [
    { label: "Quizzes taken", value: mcqsDocs.length, icon: Layers, tone: "bg-brand-50 text-brand-600" },
    { label: "Questions practiced", value: totalQuestions, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Last quiz", value: formatDate(latest), icon: Calendar, tone: "bg-sky-50 text-sky-600" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">History</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Your quizzes</h1>
          <p className="mt-2 text-slate-600">Open any quiz to review its questions and answers.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search by date or question…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field-input pl-11"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMcqs.map((doc) => {
          const { _id, createdAt, mcqs } = doc;
          const timeString = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <button
              key={_id}
              onClick={() => setSelectedDoc(doc)}
              className="card group flex flex-col p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(createdAt)} · {timeString}
                </span>
                <span className="text-xs font-semibold text-brand-600">{mcqs.length} Qs</span>
              </div>

              {mcqs.length > 0 && (
                <p className="mt-4 line-clamp-2 font-medium text-slate-900">{mcqs[0].question}</p>
              )}

              <div className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-brand-600">
                Review questions
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* No results found */}
      {filteredMcqs.length === 0 && term && (
        <div className="card mx-auto mt-4 max-w-md p-8 text-center">
          <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <h3 className="font-semibold text-slate-900">No matches</h3>
          <p className="mt-1 text-slate-600">Nothing matches &ldquo;{searchTerm}&rdquo;. Try a different date or keyword.</p>
        </div>
      )}

      {/* Review panel */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedDoc(null)} />
          <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 id="review-title" className="font-semibold text-slate-900">Quiz from {formatDate(selectedDoc.createdAt)}</h2>
                <p className="text-sm text-slate-500">{selectedDoc.mcqs.length} questions · correct answers highlighted</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                aria-label="Close"
                autoFocus
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ol className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {selectedDoc.mcqs.map((q, i) => (
                <li key={i} className="rounded-2xl border border-slate-200 p-5">
                  <p className="font-semibold text-slate-900">
                    <span className="mr-2 text-brand-600">Q{i + 1}.</span>
                    {q.question}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {q.options.map((opt, j) => {
                      const correct = opt === q.answer;
                      return (
                        <li
                          key={j}
                          className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                            correct ? "border-emerald-300 bg-emerald-50 font-medium text-emerald-800" : "border-slate-200 text-slate-700"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                              correct ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {String.fromCharCode(65 + j)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {correct && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>

            <div className="border-t border-slate-100 p-4">
              <Link href="/dashboard" className="btn-secondary w-full">
                Create a new quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
