"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type ValidationResult = {
  verdict: string;
  emoji: string;
  summary: string;
  scores: { label: string; emoji: string; score: number; roast: string }[];
  buildability: { complexity: string; time: string; teamSize: string; roast: string };
  hackathonVersion: { buildThis: string[]; skipThis: string[]; architecture: string };
  techStack: string[];
  pitch: string;
};

function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idea = searchParams.get("idea") || "";
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setResult(data);
      } catch (err) {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    };
    if (idea) validate();
  }, [idea]);

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p className="text-5xl animate-bounce">⚡</p>
      <p className="text-yellow-400 font-black text-xl uppercase tracking-widest">Roasting your idea...</p>
      <p className="text-gray-500 text-sm">No sugarcoating incoming</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">😵</p>
      <p className="text-red-400 font-black text-xl">{error}</p>
      <button onClick={() => router.push("/")} className="bg-yellow-400 text-black font-black px-6 py-3 rounded-xl mt-4">
        Try Again
      </button>
    </main>
  );

  if (!result) return null;

  const verdictColor = result.verdict === "GOLD" ? "text-yellow-400" : result.verdict === "MID" ? "text-orange-400" : "text-red-500";
  const verdictBorder = result.verdict === "GOLD" ? "border-yellow-400" : result.verdict === "MID" ? "border-orange-400" : "border-red-500";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-black tracking-tight cursor-pointer" onClick={() => router.push("/")}>
          Build<span className="text-yellow-400">Wise</span>
        </h1>
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 text-xs hover:text-yellow-400 transition-colors uppercase tracking-widest"
        >
          ← Roast Another
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 w-full">

        {/* Idea */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 mb-8">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Your Idea</p>
          <p className="text-white text-sm leading-relaxed">{idea}</p>
        </div>

        {/* Verdict */}
        <div className={`bg-gray-950 border ${verdictBorder} rounded-2xl p-6 mb-8 text-center`}>
          <p className="text-6xl mb-3">{result.emoji}</p>
          <p className={`text-4xl font-black mb-3 ${verdictColor}`}>{result.verdict}</p>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">{result.summary}</p>
        </div>

        {/* Scores */}
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-yellow-400">🧪 Validation</h2>
          <div className="grid grid-cols-1 gap-4">
            {result.scores.map((s) => (
              <div key={s.label} className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-black text-sm">{s.emoji} {s.label}</p>
                  <p className="text-yellow-400 font-black text-lg">{s.score}/10</p>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{s.roast}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buildability */}
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-yellow-400">⚡ Buildability</h2>
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-yellow-400 font-black text-lg">{result.buildability.complexity}</p>
                <p className="text-gray-500 text-xs mt-1">Complexity</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-black text-lg">{result.buildability.time}</p>
                <p className="text-gray-500 text-xs mt-1">Build Time</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-black text-lg">{result.buildability.teamSize}</p>
                <p className="text-gray-500 text-xs mt-1">Team Size</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs border-t border-gray-800 pt-4">{result.buildability.roast}</p>
          </div>
        </div>

        {/* Hackathon Version */}
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-yellow-400">🔧 Hackathon Version</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
              <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-3">✅ Build This</p>
              <ul className="space-y-2">
                {result.hackathonVersion.buildThis.map((item) => (
                  <li key={item} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-green-400">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-3">❌ Skip This</p>
              <ul className="space-y-2">
                {result.hackathonVersion.skipThis.map((item) => (
                  <li key={item} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-red-400">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Architecture</p>
            <p className="text-white text-sm">{result.hackathonVersion.architecture}</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-yellow-400">🛠 Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {result.techStack.map((tech) => (
              <span key={tech} className="bg-gray-950 border border-gray-800 text-white text-sm font-bold px-4 py-2 rounded-xl">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Pitch */}
        <div className="mb-12">
          <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-yellow-400">🎤 30-Second Pitch</h2>
          <div className="bg-gray-950 border border-yellow-400 rounded-2xl p-6">
            <p className="text-white text-base leading-relaxed italic">"{result.pitch}"</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl hover:bg-yellow-300 transition-all uppercase tracking-widest text-sm"
        >
          Roast Another Idea ⚡
        </button>

      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <Results />
    </Suspense>
  );
}