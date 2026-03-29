"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [idea, setIdea] = useState("");
  const router = useRouter();

  const handleValidate = () => {
    if (!idea.trim()) return;
    router.push(`/results?idea=${encodeURIComponent(idea)}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-black tracking-tight">
          Build<span className="text-yellow-400">Wise</span>
        </h1>
        <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Free
        </span>
      </nav>

      {/* Main */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 flex-1">

        <span className="border border-yellow-400 text-yellow-400 text-xs font-bold px-4 py-1 rounded-full mb-8 uppercase tracking-widest">
          Hackathon Idea Coach
        </span>

        <h2 className="text-5xl md:text-6xl font-black leading-tight mb-5">
          Your idea is either<br />
          <span className="text-yellow-400">gold or garbage.</span><br />
          Lets find out.
        </h2>

        <p className="text-gray-400 text-base max-w-lg mb-10 leading-relaxed">
          No sugarcoating. No fluff. Just a brutally honest breakdown —
          validation, feasibility, hackathon scope, tech stack, and a pitch.
          All in seconds.
        </p>

        {/* Input Card */}
        <div className="w-full max-w-xl bg-gray-950 rounded-2xl p-5 border border-gray-800 mb-8">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-600 text-sm resize-none outline-none leading-relaxed"
            rows={3}
            placeholder="Describe your idea... e.g. An app that uses AI to match students with internships based on their GitHub projects"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <p className="text-gray-700 text-xs">{idea.length} chars</p>
            <button
              onClick={handleValidate}
              disabled={!idea.trim()}
              className="bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
            >
              Roast My Idea ⚡
            </button>
          </div>
        </div>

      </section>

    </main>
  );
}