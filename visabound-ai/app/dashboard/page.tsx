
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  // =========================
  // PROFILE STATE
  // =========================
  const [userName, setUserName] = useState("");
  const [visaType, setVisaType] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");

  // =========================
  // TRACKER STATE
  // =========================
  const [authType, setAuthType] = useState("OPT");
  const [status, setStatus] = useState("Not Started");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // =========================
  // UI STATE
  // =========================
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingTracker, setIsEditingTracker] = useState(false);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // -------------------------
      // PROFILE LOAD
      // -------------------------
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

      // -------------------------
      // TRACKER LOAD (IMPORTANT FIX)
      // -------------------------
      const { data: tracker } = await supabase
        .from("work_auth_tracker")
        .select("*")
        .eq("user_id", user.id)
        .eq("auth_type", "OPT") // default focus (change if needed)
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
  }, []);

  // =========================
  // SAVE PROFILE
  // =========================
  async function saveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
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
        { onConflict: "user_id" }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setIsEditingProfile(false);
  }

  // =========================
  // SAVE TRACKER (FIXED + DEBUG SAFE)
  // =========================
  async function saveTracker() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      auth_type: authType,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
    };

    console.log("Saving tracker:", payload);

    const { data, error } = await supabase
      .from("work_auth_tracker")
      .upsert(payload, {
        onConflict: "user_id,auth_type",
      })
      .select();

    console.log("DB response:", data);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setIsEditingTracker(false);
  }

  // =========================
  // FAKE PERSONALIZED FEED
  // =========================
  function generateFeed() {
    const feed = [];

    if (visaType === "F-1 Student") {
      feed.push({
        title: "F-1 Status Reminder",
        desc: "Maintain full-time enrollment + update SEVIS within 10 days.",
      });
    }

    if (stage === "Applying for OPT/STEM OPT") {
      feed.push({
        title: "OPT Filing Window",
        desc: "You can apply up to 90 days before graduation.",
      });
    }

    if (visaType === "STEM OPT") {
      feed.push({
        title: "STEM OPT Reporting",
        desc: "You must report employment every 6 months.",
      });
    }

    if (visaType === "H-1B") {
      feed.push({
        title: "H-1B Season Alert",
        desc: "Employer registration typically opens in March.",
      });
    }

    if (country) {
      feed.push({
        title: "Country Insight",
        desc: `Students from ${country} may experience processing delays.`,
      });
    }

    feed.push({
      title: "Policy Watch",
      desc: "USCIS + DOL + State Department updates will appear here soon.",
    });

    return feed;
  }

  const feed = generateFeed();

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading dashboard...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="text-blue-400">{userName || "there"}</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Your immigration intelligence dashboard
          </p>
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
                <input className="w-full bg-black/30 p-2 rounded" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input className="w-full bg-black/30 p-2 rounded" value={visaType} onChange={(e) => setVisaType(e.target.value)} />
                <input className="w-full bg-black/30 p-2 rounded" value={stage} onChange={(e) => setStage(e.target.value)} />
                <input className="w-full bg-black/30 p-2 rounded" value={country} onChange={(e) => setCountry(e.target.value)} />

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

                <input type="date" className="w-full bg-black/30 p-2 rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" className="w-full bg-black/30 p-2 rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

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

            {feed.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <div className="text-blue-300 font-semibold">
                  {item.title}
                </div>
                <div className="text-gray-400 text-sm">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}