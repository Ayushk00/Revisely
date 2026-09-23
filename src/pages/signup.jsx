//*******without otp************** */

// "use client";

// import axios from "axios";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function Signup() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Check if password has been pwned using Have I Been Pwned API
//   async function checkPasswordBreach(pass) {
//     if (!pass) return false;
//     const sha1 = await crypto.subtle.digest(
//       "SHA-1",
//       new TextEncoder().encode(pass)
//     );
//     const hash = Array.from(new Uint8Array(sha1))
//       .map((b) => b.toString(16).padStart(2, "0"))
//       .join("")
//       .toUpperCase();

//     const prefix = hash.slice(0, 5);
//     const suffix = hash.slice(5);
//     try {
//       const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
//       if (!res.ok) return false;
//       const text = await res.text();
//       return text.split("\n").some(line => line.split(":")[0] === suffix);
//     } catch {
//       return false;
//     }
//   }

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password.length < 8) {
//       alert("Password must be at least 8 characters.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const breached = await checkPasswordBreach(password);
//       if (breached) {
//         alert(
//           "This password has been found in a data breach. Please choose a different one."
//         );
//         return;
//       }

//       // Call your own signup API
//       const { data } = await axios.post("/api/signup", {
//         name,
//         email,
//         password,
//       });

//       if (data.success) {
//         alert("Signup successful! Please log in.");
//         router.push("/login");
//       } else {
//         alert(data.message || "Signup failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       alert(err.response?.data?.error || "Unexpected error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-md font-sans text-center">
//       <h2 className="text-2xl font-semibold mb-8 text-gray-800">
//         Create an Account
//       </h2>

//       <form
//         onSubmit={handleSignup}
//         className="flex flex-col gap-6 text-left"
//         noValidate
//       >
//         <label className="text-sm font-medium text-gray-700">
//           Full Name
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border px-4 py-2"
//             placeholder="Your name"
//           />
//         </label>

//         <label className="text-sm font-medium text-gray-700">
//           Email Address
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border px-4 py-2"
//             placeholder="you@example.com"
//           />
//         </label>

//         <label className="text-sm font-medium text-gray-700">
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="mt-1 block w-full rounded-md border px-4 py-2"
//             placeholder="••••••••"
//           />
//           <span className="text-xs text-gray-500">Minimum 8 characters</span>
//         </label>

//         <button
//           type="submit"
//           disabled={loading || !name || !email || password.length < 8}
//           className={`mt-4 w-full rounded-md px-4 py-3 font-semibold text-white transition ${
//             loading || !name || !email || password.length < 8
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Processing..." : "Sign Up"}
//         </button>
//       </form>

//       <p className="mt-6 text-sm text-gray-600">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 hover:underline">
//           Log in
//         </Link>
//       </p>
//     </main>
//   );
// }

// ********************with otp and old ui*********************************
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function SignUp() {
//   const router = useRouter();

//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const [phase, setPhase] = useState('collect');
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [resendVisible, setResendVisible] = useState(false);

//   useEffect(() => {
//     if (phase === 'collect') {
//       setOtp('');
//       setOtpError('');
//       setResendVisible(false);
//     }
//   }, [phase]);

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = 'Name is required';
//     if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
//     if (!form.password || form.password.length < 6) e.password = 'Min 6 chars';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleChange = (e) => {
//     setForm(f => ({ ...f, [e.target.name]: e.target.value }));
//     setErrors(err => ({ ...err, [e.target.name]: '' }));
//   };

//   const sendOtp = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setIsLoading(true);
//     try {
//       const res = await fetch('/api/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: form.email }),
//       });
//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || 'Failed to send OTP');
//       }
//       setPhase('verify');
//       setResendVisible(true);
//     } catch (err) {
//       setErrors({ submit: err.message || 'Failed to send OTP' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp.trim()) {
//       setOtpError('Enter the OTP');
//       return;
//     }
//     setOtpLoading(true);
//     try {
//       const res1 = await fetch('/api/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: form.email, otp }),
//       });
//       if (!res1.ok) {
//         const data = await res1.json();
//         throw new Error(data.error || 'OTP verification failed');
//       }

//       const res2 = await fetch('/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });
//       if (!res2.ok) {
//         const data = await res2.json();
//         throw new Error(data.error || 'Signup failed');
//       }

//       router.push('/login');
//     } catch (err) {
//       setOtpError(err.message || 'OTP verification failed');
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const resend = async () => {
//     setOtpLoading(true);
//     try {
//       const res = await fetch('/api/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: form.email }),
//       });
//       if (!res.ok) throw new Error('Resend failed');
//     } catch {
//       setOtpError('Resend failed');
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   if (phase === 'verify') {
//     return (
//       <div className="max-w-md mx-auto p-8">
//         <h2 className="mb-4 text-xl">Verify {form.email}</h2>
//         <form onSubmit={verifyOtp} className="space-y-4">
//           <input
//             value={otp}
//             onChange={e => { setOtp(e.target.value); setOtpError(''); }}
//             placeholder="Enter OTP"
//             className="w-full px-4 py-2 border rounded"
//           />
//           {otpError && <p className="text-red-600">{otpError}</p>}

//           <button
//             type="submit"
//             disabled={otpLoading}
//             className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
//           >
//             {otpLoading ? 'Verifying…' : 'Verify'}
//           </button>

//           {resendVisible && (
//             <button
//               type="button"
//               onClick={resend}
//               disabled={otpLoading}
//               className="mt-2 text-sm text-blue-600 underline"
//             >
//               {otpLoading ? 'Resending…' : 'Resend Code'}
//             </button>
//           )}

//           <button
//             type="button"
//             onClick={() => setPhase('collect')}
//             className="mt-4 text-sm text-gray-600"
//           >
//             ← Back
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-8">
//       <h2 className="mb-4 text-xl">Create Account</h2>
//       <form onSubmit={sendOtp} className="space-y-4">
//         {errors.submit && <p className="text-red-600">{errors.submit}</p>}

//         {['name', 'email', 'password'].map(field => (
//           <div key={field}>
//             <label className="block mb-1 capitalize">{field}</label>
//             <input
//               name={field}
//               type={field === 'password' ? 'password' : 'text'}
//               value={form[field]}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded"
//             />
//             {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
//           </div>
//         ))}

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
//         >
//           {isLoading ? 'Sending OTP…' : 'Send OTP'}
//         </button>

//         <p className="mt-4 text-sm">
//           Already have an account?{' '}
//           <a href="/login" className="text-blue-600 underline">
//             Sign In
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


'use client';

import AuthLayout from '@/components/AuthLayout';
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Lock, Mail, MailCheck, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const fields = [
  { field: 'name', label: 'Full name', type: 'text', icon: User, placeholder: 'Jane Doe', autoComplete: 'name' },
  { field: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', autoComplete: 'email' },
  { field: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'At least 6 characters', autoComplete: 'new-password' },
];

function FieldError({ children }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-600">
      <AlertCircle className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

export default function SignUp() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [phase, setPhase] = useState('collect');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendVisible, setResendVisible] = useState(false);

  useEffect(() => {
    if (phase === 'collect') {
      setOtp('');
      setOtpError('');
      setResendVisible(false);
    }
  }, [phase]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send OTP');
      }
      setPhase('verify');
      setResendVisible(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError('Enter the OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const res1 = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      if (!res1.ok) {
        const data = await res1.json();
        throw new Error(data.error || 'OTP verification failed');
      }

      const res2 = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res2.ok) {
        const data = await res2.json();
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/login');
    } catch (err) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const resend = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      if (!res.ok) throw new Error('Resend failed');
    } catch {
      setOtpError('Resend failed');
    } finally {
      setOtpLoading(false);
    }
  };

  if (phase === 'verify') {
    return (
      <AuthLayout
        icon={MailCheck}
        title="Check your inbox"
        subtitle={
          <>
            We sent a 6-digit code to <span className="font-semibold text-slate-900">{form.email}</span>. It expires in 10 minutes.
          </>
        }
      >
        <form onSubmit={verifyOtp} className="space-y-5">
          <div>
            <label htmlFor="otp" className="field-label">
              Verification code
            </label>
            <input
              id="otp"
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              className={`field-input text-center font-mono text-2xl tracking-[0.5em] ${otpError ? 'field-input-error' : ''}`}
            />
            {otpError && <FieldError>{otpError}</FieldError>}
          </div>

          <button type="submit" disabled={otpLoading || otp.length < 6} className="btn-primary w-full">
            {otpLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify & create account'
            )}
          </button>

          {resendVisible && (
            <p className="text-center text-sm text-slate-600">
              Didn&apos;t get it? Check spam, or{' '}
              <button
                type="button"
                onClick={resend}
                disabled={otpLoading}
                className="font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:opacity-50"
              >
                resend the code
              </button>
            </p>
          )}

          <button type="button" onClick={() => setPhase('collect')} className="btn-ghost w-full">
            <ArrowLeft className="h-4 w-4" />
            Use a different email
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Start turning your notes into quizzes in under a minute."
      footer={
        <>
          By creating an account, you agree to our{' '}
          <a href="#" className="font-medium text-slate-700 underline-offset-2 hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="font-medium text-slate-700 underline-offset-2 hover:underline">Privacy Policy</a>.
        </>
      }
    >
      <form onSubmit={sendOtp} className="space-y-5" noValidate>
        {errors.submit && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        {fields.map(({ field, label, type, icon: Icon, placeholder, autoComplete }) => (
          <div key={field}>
            <label htmlFor={field} className="field-label">
              {label}
            </label>
            <div className="relative">
              <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id={field}
                name={field}
                type={type}
                value={form[field]}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`field-input pl-11 ${errors[field] ? 'field-input-error' : ''}`}
              />
            </div>
            {errors[field] && <FieldError>{errors[field]}</FieldError>}
          </div>
        ))}

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending code…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-600 transition-colors hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
