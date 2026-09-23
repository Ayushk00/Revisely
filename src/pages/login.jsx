// "use client";

// import axios from "axios";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   useEffect(() => {
//     const manualToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (manualToken) router.push("/dashboard");
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg("");

//     try {
//       const response = await axios.post("/api/login", { email, password });
//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("email", email);
//       router.push("/dashboard");
//     } catch (error) {
//       setErrorMsg(error?.response?.data?.error || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
//         <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
//         <p className="text-sm text-center text-gray-500">Sign in to your account</p>

//         <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               autoComplete="email"
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               autoComplete="current-password"
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             />
//           </div>

//           {errorMsg && <p className="text-sm text-red-600 mt-1">{errorMsg}</p>}

//           <button
//             type="submit"
//             disabled={loading || !email || !password}
//             className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
//               loading || !email || !password
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700 shadow hover:shadow-md"
//             }`}
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
//           <span>Don&apos;t have an account?</span>
//           <Link href="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import AuthLayout from "@/components/AuthLayout";
import axios from "axios";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const manualToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (manualToken) router.push("/dashboard");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post("/api/login", { email, password });
      const { token, user } = response.data;
      //localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      if (user?.name) localStorage.setItem("name", user.name);
      else localStorage.removeItem("name");
      router.push("/dashboard");
    } catch (error) {
      setErrorMsg(error?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer="Protected with encrypted sessions and hashed passwords."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errorMsg && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`field-input pl-11 ${errorMsg ? "field-input-error" : ""}`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`field-input pl-11 pr-12 ${errorMsg ? "field-input-error" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading || !email || !password} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-600">
          New to Revisely?{" "}
          <Link href="/signup" className="font-semibold text-brand-600 transition-colors hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
