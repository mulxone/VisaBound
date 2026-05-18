
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [visaType, setVisaType] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // 🚀 CHECK IF USER ALREADY HAS PROFILE
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      const { data } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // if profile exists → skip onboarding
      if (data) {
        router.push("/dashboard");
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, [router]);

  async function saveProfile() {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Authentication error. Please login again.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from("user_profile")
        .upsert({
          user_id: user.id,
          username,
          visa_type: visaType,
          stage,
          country,
        });

      if (profileError) {
        console.error(profileError);
        alert(profileError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Checking your profile...
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6">

      {/* Glow */}
      <div className="absolute top-[-200px] left-[-150px] h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-[-200px] right-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10">

        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs text-blue-300 mb-6">
          AI-Powered Immigration Intelligence
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              WorkStatus.ai
            </span>
          </h1>

          <p className="text-gray-400">
            Let’s personalize your dashboard in under 30 seconds.
          </p>
        </div>

        <div className="space-y-5">

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Username
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. visaKing, thomas2026"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white"
            />
          </div>

          {/* Visa Type */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Immigration Status
            </label>

            <select
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white"
            >
              <option value="">Select your status</option>
              <option>F-1 Student</option>
              <option>OPT</option>
              <option>STEM OPT</option>
              <option>H-1B</option>
              <option>Preparing to Apply</option>
              <option>Other</option>
            </select>
          </div>

          {/* Stage */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Current Situation
            </label>

            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white"
            >
              <option value="">Select your stage</option>
              <option>Studying</option>
              <option>Graduating Soon</option>
              <option>Looking for Work</option>
              <option>Applying for OPT/STEM OPT</option>
              <option>Working</option>
              <option>Waiting for USCIS Decision</option>
              <option>Exploring Options</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Country of Origin
            </label>

            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Zambia, India, Brazil"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white"
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold"
          >
            {loading ? "Setting up..." : "Continue to Dashboard"}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          WorkStatus.ai provides guidance, not legal advice.
        </div>
      </div>
    </div>
  );
}