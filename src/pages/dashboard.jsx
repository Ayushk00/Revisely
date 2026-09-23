// 'use client';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import Script from 'next/script';
// import { useEffect, useState } from 'react';

// export default function Dashboard() {
//   const router = useRouter();

//   const [file, setFile] = useState(null);
//   const [mcqCount, setMcqCount] = useState('');
//   const [authorized, setAuthorized] = useState(true); // assumed already authenticated via middleware
//   const [tickets, setTickets] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [email, setEmail] = useState(null);
//   const [storageLoaded, setStorageLoaded] = useState(false);

//   // Load email from localStorage
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('email');
//     setEmail(storedEmail);
//     setStorageLoaded(true);
//   }, []);

//   // Redirect if email is missing
//   useEffect(() => {
//     if (storageLoaded && !email) {
//       router.replace('/login');
//     }
//   }, [storageLoaded, email]);

//   // Fetch user's ticket count
//   useEffect(() => {
//     if (!storageLoaded || !email) return;

//     axios
//       .get(`/api/getUserTickets?email=${email}`)
//       .then(({ data }) => setTickets(data.tickets))
//       .catch(err => console.error('Error fetching tickets:', err));
//   }, [storageLoaded, email]);

//  useEffect(() => {
//     // Push current page to history stack
//     window.history.pushState(null, null, window.location.pathname)
    
//     const handleBackButton = () => {
//       // When back is pressed, push forward again
//       window.history.pushState(null, null, window.location.pathname)
//     }

//     // Listen for back button press
//     window.addEventListener('popstate', handleBackButton)

//     // Cleanup
//     return () => {
//       window.removeEventListener('popstate', handleBackButton)
//     }
//   }, [])

//   const handleFileChange = e => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile?.type === 'application/pdf') {
//       setFile(selectedFile);
//     } else {
//       alert('Please upload a valid PDF file.');
//       setFile(null);
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (tickets <= 0) return alert('You need tickets to generate MCQs!');
//     if (!file || !mcqCount || isNaN(mcqCount) || mcqCount <= 0) return alert('Invalid inputs.');

//     if (!email) {
//       alert('Please log in again.');
//       return router.replace('/login');
//     }

//     setGenerating(true);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('mcqCount', mcqCount);

//     try {
//       const { data } = await axios.post('/api/generateMcq', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       await axios.post(`/api/deductTicket?email=${email}`);
//       localStorage.setItem('mcqs', JSON.stringify(data.mcqs));
//       router.replace('/test');
//     } catch (err) {
//       console.error('MCQ error:', err);
//       alert(err.response?.data?.error || 'Failed to generate MCQs.');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleBuyTickets = async () => {
//     if (!email) {
//       alert('Please log in again.');
//       return router.replace('/login');
//     }

//     setLoading(true);
//     try {
//       const { data: order } = await axios.post('/api/createOrder');
//       new window.Razorpay({
//         key: order.key_id,
//         amount: order.amount,
//         currency: order.currency,
//         name: 'QuizMaster',
//         description: '30 Tickets Package',
//         order_id: order.id,
//         handler: async resp => {
//           try {
//             const { data: verify } = await axios.post('/api/verifyPayment', { ...resp, email });
//             setTickets(verify.tickets);
//             alert('Payment successful!');
//           } catch {
//             alert('Payment verification failed.');
//           }
//         },
//         prefill: { email },
//         theme: { color: '#6366f1' },
//       }).open();
//     } catch (err) {
//       console.error('Payment error:', err);
//       alert('Failed to initiate payment.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewHistory = () => router.push('/history');

//   // Show loading while checking authentication
//   if (authorized === null) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
//         <div className="text-center">
//           <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // If not authorized, don't render anything (will redirect)
//   if (authorized === false) {
//     return null;
//   }

//   // Show loading while storage is being loaded
//   if (!storageLoaded) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
//         <div className="text-center">
//           <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12">
//         <main className="max-w-3xl mx-auto px-6">
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-3xl font-semibold text-indigo-700">📄 Upload PDF to Generate MCQs</h1>
//               {/* <button
//                 onClick={handleLogout}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
//               >
//                 Logout
//               </button> */}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={handleFileChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Number of MCQs</label>
//                 <input
//                   type="number"
//                   value={mcqCount}
//                   onChange={(e) => setMcqCount(e.target.value)}
//                   placeholder="e.g. 20"
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={generating}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
//               >
//                 {generating ? 'Generating MCQs...' : 'Generate MCQs'}
//               </button>
//             </form>

//             <div className="mt-8 border-t pt-6 space-y-4">
//               <p className="text-gray-700 text-lg">
//                 🎫 Tickets Remaining: <span className="font-bold">{tickets}</span>
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={handleBuyTickets}
//                   disabled={loading}
//                   className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50"
//                 >
//                   {loading ? 'Processing...' : 'Buy More Tickets'}
//                 </button>
//                 <button
//                   onClick={handleViewHistory}
//                   className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition"
//                 >
//                   View Test History
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

'use client';
import axios from 'axios';
import { AlertTriangle, ArrowRight, CheckCircle, CreditCard, FileText, History, Lightbulb, Loader2, Sparkles, Ticket, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import CryptoJS from "crypto-js";

export default function Dashboard() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [mcqCount, setMcqCount] = useState('');
  const [authorized, setAuthorized] = useState(true); // assumed already authenticated via middleware
  const [tickets, setTickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState(null);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
    setStorageLoaded(true);
  }, []);

  // Redirect if email is missing
  useEffect(() => {
    if (storageLoaded && !email) {
      router.replace('/login');
    }
  }, [storageLoaded, email]);

  // Fetch user's ticket count
  useEffect(() => {
    if (!storageLoaded || !email) return;

    axios
      .get(`/api/getUserTickets?email=${email}`)
      .then(({ data }) => setTickets(data.tickets))
      .catch(err => console.error('Error fetching tickets:', err));
  }, [storageLoaded, email]);

  useEffect(() => {
    // Push current page to history stack
    window.history.pushState(null, null, window.location.pathname)
    
    const handleBackButton = () => {
      // When back is pressed, push forward again
      window.history.pushState(null, null, window.location.pathname)
    }

    // Listen for back button press
    window.addEventListener('popstate', handleBackButton)

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleBackButton)
    }
  }, [])

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        alert('Please upload a valid PDF file.');
        setFile(null);
      }
    }
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid PDF file.');
      setFile(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (tickets <= 0) return alert('You need tickets to generate MCQs!');
    if (!file || !mcqCount || isNaN(mcqCount) || mcqCount <= 0) return alert('Invalid inputs.');

    if (!email) {
      alert('Please log in again.');
      return router.replace('/login');
    }

    setGenerating(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mcqCount', mcqCount);

    try {
      const { data } = await axios.post('/api/generateMcq', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await axios.post(`/api/deductTicket?email=${email}`);
      const encryptedMcqs = CryptoJS.AES.encrypt(JSON.stringify(data.mcqs), process.env.NEXT_PUBLIC_MCQSECRET).toString();
      localStorage.setItem("mcqs", encryptedMcqs);
      //localStorage.setItem('mcqs', JSON.stringify(data.mcqs));
      router.replace('/test');
    } catch (err) {
      console.error('MCQ error:', err);
      alert(err.response?.data?.error || 'Failed to generate MCQs.');
    } finally {
      setGenerating(false);
    }
  };

  const handleBuyTickets = async () => {
    if (!email) {
      alert('Please log in again.');
      return router.replace('/login');
    }

    setLoading(true);
    try {
      const { data: order } = await axios.post('/api/createOrder');
      new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Revisely',
        description: '30 Tickets Package',
        order_id: order.id,
        handler: async resp => {
          try {
            const { data: verify } = await axios.post('/api/verifyPayment', { ...resp, email });
            setTickets(verify.tickets);
            alert('Payment successful!');
          } catch {
            alert('Payment verification failed.');
          }
        },
        prefill: { email },
        theme: { color: '#5f3ff0' },
      }).open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => router.push('/history');

  const quickCounts = [5, 10, 20, 30];
  const displayName = email ? email.split('@')[0] : '';
  const canGenerate = Boolean(file) && Number(mcqCount) > 0 && tickets > 0 && !generating;

  const Loader = ({ label }) => (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-600" />
        <p className="text-slate-600">{label}</p>
      </div>
    </div>
  );

  // Show loading while checking authentication
  if (authorized === null) return <Loader label="Checking authentication…" />;

  // If not authorized, don't render anything (will redirect)
  if (authorized === false) {
    return null;
  }

  // Show loading while storage is being loaded
  if (!storageLoaded) return <Loader label="Loading…" />;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <p className="text-sm font-medium text-brand-600">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back{displayName && <span className="text-slate-500">, {displayName}</span>}
          </h1>
          <p className="mt-2 text-slate-600">Upload a PDF and we&apos;ll turn it into a timed quiz.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Create quiz */}
          <section className="card overflow-hidden lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Create a new quiz</h2>
                <p className="text-sm text-slate-500">Two quick steps and you&apos;re ready to go</p>
              </div>
            </div>

            {generating ? (
              <div className="flex flex-col items-center px-6 py-16 text-center" aria-live="polite">
                <div className="relative mb-6">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Writing your questions…</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-600">
                  Reading <span className="font-medium text-slate-800">{file?.name}</span> and generating {mcqCount} questions.
                  This usually takes 15–40 seconds — please keep this tab open.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 p-6">
                {/* Step 1: upload */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">1</span>
                    <span className="text-sm font-semibold text-slate-900">Upload your PDF</span>
                  </div>

                  {file ? (
                    <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">{file.name}</p>
                        <p className="text-sm text-emerald-700">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        aria-label="Remove file"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                        dragActive
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-slate-900">
                        <span className="text-brand-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="mt-1 text-sm text-slate-500">PDF only, up to 10 MB</p>
                    </label>
                  )}
                </div>

                {/* Step 2: question count */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span>
                    <label htmlFor="mcqCount" className="text-sm font-semibold text-slate-900">
                      How many questions?
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {quickCounts.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMcqCount(String(n))}
                        aria-pressed={mcqCount === String(n)}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          mcqCount === String(n)
                            ? 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <input
                      id="mcqCount"
                      type="number"
                      value={mcqCount}
                      onChange={(e) => setMcqCount(e.target.value)}
                      placeholder="Custom"
                      min="1"
                      max="100"
                      className="field-input w-28 py-2.5"
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Each question gets 20 seconds. 10–30 is a good session length.</p>
                </div>

                {tickets <= 0 && (
                  <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <p className="flex-1 text-sm text-amber-900">
                      You&apos;re out of tickets. Each quiz uses one ticket.
                    </p>
                    <button
                      type="button"
                      onClick={handleBuyTickets}
                      disabled={loading}
                      className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                    >
                      Buy tickets
                    </button>
                  </div>
                )}

                <button type="submit" disabled={!canGenerate} className="btn-primary w-full py-3.5 text-base">
                  <Sparkles className="h-5 w-5" />
                  Generate quiz
                  {canGenerate && <span className="font-normal text-brand-200">· uses 1 ticket</span>}
                </button>
              </form>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tickets */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 text-white shadow-lg shadow-brand-900/15">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center gap-2 text-sm font-medium text-brand-100">
                <Ticket className="h-4 w-4" />
                Your tickets
              </div>
              <p className="relative mt-3 text-5xl font-extrabold tracking-tight">{tickets}</p>
              <p className="relative mt-1 text-sm text-brand-200">1 ticket = 1 quiz</p>

              <button
                onClick={handleBuyTickets}
                disabled={loading}
                className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Buy 30 tickets · ₹100
                  </>
                )}
              </button>
            </div>

            {/* History */}
            <button
              onClick={handleViewHistory}
              className="card group flex w-full items-center gap-4 p-5 text-left transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-brand-50 group-hover:text-brand-600">
                <History className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Quiz history</p>
                <p className="text-sm text-slate-500">Review past questions and answers</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </button>

            {/* Tips */}
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Tips for better quizzes
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Use text-based PDFs — scanned images can&apos;t be read.
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Upload one chapter at a time for focused questions.
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  Retake quizzes a few days later to lock it in.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
