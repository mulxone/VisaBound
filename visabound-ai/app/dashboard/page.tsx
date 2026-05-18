
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // ================= PROFILE =================
  const [userName, setUserName] = useState("");
  const [visaType, setVisaType] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");

  // ================= TRACKER =================
  const [authType, setAuthType] = useState("OPT");
  const [status, setStatus] = useState("Not Started");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ================= UI =================
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingTracker, setIsEditingTracker] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // PROFILE LOAD
      const { data: profile } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setUserName(profile.username || "");
        setVisaType(profile.visa_type || "");
        setStage(profile.stage || "");
        setCountry(profile.country || "");
      }

      // TRACKER LOAD
      const { data: tracker } = await supabase
        .from("work_auth_tracker")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (tracker) {
        setAuthType(tracker.auth_type || "OPT");
        setStatus(tracker.status || "Not Started");
        setStartDate(tracker.start_date || "");
        setEndDate(tracker.end_date || "");
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  // ================= LOGOUT =================
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // ================= PROFILE SAVE (FIXED - NO DUPLICATES EVER) =================
  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("user_profile")
      .upsert(
        {
          user_id: user.id,
          username: userName,
          visa_type: visaType,
          stage,
          country,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setIsEditingProfile(false);
  }

  // ================= TRACKER SAVE =================
  async function saveTracker() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("work_auth_tracker")
      .upsert(
        {
          user_id: user.id,
          auth_type: authType,
          status,
          start_date: startDate || null,
          end_date: endDate || null,
        },
        {
          onConflict: "user_id,auth_type",
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setIsEditingTracker(false);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back,{" "}
              <span className="text-blue-400">{userName || "there"}</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Your immigration intelligence dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* ================= PROFILE ================= */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>

            {!isEditingProfile ? (
              <>
                <div className="space-y-2 text-sm">
                  <p>Username: {userName}</p>
                  <p>Visa: {visaType}</p>
                  <p>Stage: {stage}</p>
                  <p>Country: {country}</p>
                </div>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="mt-4 text-blue-400 text-sm"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="space-y-2">

                <input
                  className="w-full bg-black/30 p-2 rounded"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Username"
                />

                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full bg-black/30 p-2 rounded"
                >
                  <option value="">Visa Type</option>
                  <option>F-1 Student</option>
                  <option>OPT</option>
                  <option>STEM OPT</option>
                  <option>H-1B</option>
                  <option>Preparing to Apply</option>
                  <option>Other</option>
                </select>

                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-black/30 p-2 rounded"
                >
                  <option value="">Stage</option>
                  <option>Studying</option>
                  <option>Graduating Soon</option>
                  <option>Looking for Work</option>
                  <option>Applying for OPT/STEM OPT</option>
                  <option>Working</option>
                  <option>Waiting for USCIS Decision</option>
                  <option>Exploring Options</option>
                </select>

                <input
                  className="w-full bg-black/30 p-2 rounded"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />

                <button
                  onClick={saveProfile}
                  className="w-full bg-blue-600 py-2 rounded"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>

          {/* ================= TRACKER ================= */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Work Tracker</h2>

              <button
                onClick={() => setIsEditingTracker(!isEditingTracker)}
                className="text-blue-400 text-sm"
              >
                {isEditingTracker ? "Cancel" : "Edit"}
              </button>
            </div>

            {!isEditingTracker ? (
              <div className="space-y-2 text-sm">
                <p>Type: {authType}</p>
                <p>Status: {status}</p>
                <p>Start: {startDate || "—"}</p>
                <p>End: {endDate || "—"}</p>
              </div>
            ) : (
              <div className="space-y-3">

                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value)}
                  className="w-full bg-black/30 p-2 rounded"
                >
                  <option>OPT</option>
                  <option>STEM OPT</option>
                  <option>H-1B</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-black/30 p-2 rounded"
                >
                  <option>Not Started</option>
                  <option>Applied</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Denied</option>
                </select>

                <input
                  type="date"
                  className="w-full bg-black/30 p-2 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                  type="date"
                  className="w-full bg-black/30 p-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />

                <button
                  onClick={saveTracker}
                  className="w-full bg-blue-600 py-2 rounded"
                >
                  Save Tracker
                </button>
              </div>
            )}
          </div>

          {/* ================= FEED ================= */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Feed</h2>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-gray-400 text-sm">
              Personalized immigration updates will appear here.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}