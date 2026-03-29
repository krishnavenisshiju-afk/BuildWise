"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedIdea = idea.trim();

    if (!trimmedIdea) {
      setError("Please describe your idea before submitting.");
      return;
    }

    setError("");
    router.push(`/results?idea=${encodeURIComponent(trimmedIdea)}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <header className="mb-10 text-center">
          <p className="text-sm text-yellow-400 uppercase tracking-widest mb-4">BuildWise</p>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Describe your idea</h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
            Paste your idea below and BuildWise will tell you whether it’s hackathon-ready, what to simplify, and how to build it fast.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-gray-400 uppercase text-xs tracking-widest">Your idea</span>
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="e.g. AI-powered marketplace that matches student projects with mentors"
              className="mt-4 w-full min-h-[240px] rounded-3xl border border-gray-800 bg-gray-950 px-5 py-5 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
            />
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-black uppercase tracking-widest rounded-3xl py-5 hover:bg-yellow-300 transition-colors"
          >
            Roast my idea ⚡
          </button>
        </form>
      </div>
    </main>
  );
}
