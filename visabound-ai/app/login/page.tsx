
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm signup");
    }
  }

  async function signIn() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/onboarding");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 overflow-hidden">

      {/* Glow Background (matches onboarding) */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(59,130,246,0.15)] p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            WorkStatus<span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text">.ai</span>
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Stay ahead on immigration rules & work authorization
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.01] transition font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            onClick={signUp}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-white font-medium border border-white/10"
          >
            Create account
          </button>

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6 border-t border-white/10 pt-4">
          WorkStatus.ai provides guidance, not legal advice.
        </p>
      </div>
    </div>
  );
}