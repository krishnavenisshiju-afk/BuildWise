import { NextRequest, NextResponse } from "next/server";

function analyzeIdea(idea: string) {
  const text = idea.toLowerCase();

  // Keywords for scoring
  const problemKeywords = ["problem", "issue", "struggle", "pain", "fail", "lose", "waste", "broken", "lack", "need"];
  const techKeywords = ["ai", "blockchain", "ml", "machine learning", "app", "platform", "system", "api", "data", "cloud"];
  const marketKeywords = ["market", "billion", "million", "industry", "consumer", "business", "startup", "revenue", "customer", "user"];
  const uniqueKeywords = ["unique", "first", "novel", "new", "innovative", "never", "unlike", "different", "original"];
  const complexKeywords = ["hardware", "sensor", "iot", "robot", "physical", "device", "spectroscopy", "molecular", "blockchain", "decentralized"];

  const countMatches = (keywords: string[]) =>
    keywords.filter((k) => text.includes(k)).length;

  const problemScore = Math.min(10, 4 + countMatches(problemKeywords));
  const uniqueScore = Math.min(10, 4 + countMatches(uniqueKeywords) * 2);
  const relevanceScore = Math.min(10, 4 + countMatches(marketKeywords));
  const businessScore = Math.min(10, 4 + countMatches(marketKeywords) + countMatches(techKeywords));
  const complexityScore = countMatches(complexKeywords);

  const avgScore = (problemScore + uniqueScore + relevanceScore + businessScore) / 4;
  const verdict = avgScore >= 8 ? "GOLD" : avgScore >= 6 ? "MID" : "TRASH";
  const emoji = verdict === "GOLD" ? "🥇" : verdict === "MID" ? "📦" : "🗑️";

  const complexity = complexityScore >= 3 ? "High" : complexityScore >= 1 ? "Medium" : "Low";
  const time = complexity === "High" ? "40-48 hours" : complexity === "Medium" ? "24-36 hours" : "12-20 hours";
  const teamSize = complexity === "High" ? "4-5 members" : complexity === "Medium" ? "3 members" : "2 members";

  const summaries: Record<string, string> = {
    GOLD: "Solid idea with real market potential. The problem is clear, the solution is differentiated, and people will actually pay for this. Don't overcomplicate it — strip it down and ship it.",
    MID: "There's something here but it's buried under complexity and vague execution. The problem exists but your solution needs sharper focus. Cut the fluff and get specific.",
    TRASH: "Right now this is more of a thought than an idea. The problem isn't clear enough and the solution is too vague. Go back to basics — who has this problem and why can't they solve it today?",
  };

  const roasts: Record<string, string[]> = {
    GOLD: [
      "Problem is crystal clear — judges will get it in 10 seconds.",
      "Actually differentiated. Hard to copy. That's rare.",
      "Real people have this problem every single day.",
      "Multiple ways to make money here. Smart.",
    ],
    MID: [
      "Problem exists but your explanation took too long. Trim it.",
      "Three similar apps exist. What makes yours different? Answer that first.",
      "Real world relevance is there but buried in jargon.",
      "Business model is vibes right now. Pick one revenue stream and commit.",
    ],
    TRASH: [
      "What problem exactly? Be specific or go home.",
      "This idea exists already and nobody uses it. That's a signal.",
      "Who actually has this problem? Name one real person.",
      "No clear way to make money. Ideas without revenue models are hobbies.",
    ],
  };

  return {
    verdict,
    emoji,
    summary: summaries[verdict],
    scores: [
      { label: "Problem Clarity", emoji: "🎯", score: problemScore, roast: roasts[verdict][0] },
      { label: "Uniqueness", emoji: "💡", score: uniqueScore, roast: roasts[verdict][1] },
      { label: "Real World Relevance", emoji: "🌍", score: relevanceScore, roast: roasts[verdict][2] },
      { label: "Business Potential", emoji: "💰", score: businessScore, roast: roasts[verdict][3] },
    ],
    buildability: {
      complexity,
      time,
      teamSize,
      roast: complexity === "High"
        ? "This is NOT a hackathon idea. This is a 6-month startup. Strip it down or you're cooked."
        : complexity === "Medium"
        ? "Buildable but only if you stop adding features every 20 minutes."
        : "Totally buildable in a hackathon. No excuses.",
    },
    hackathonVersion: {
      buildThis: [
        "Core input/output flow only",
        "Simple clean UI with key feature",
        "One working demo that judges can try",
      ],
      skipThis: [
        "User accounts and authentication",
        "Database and history features",
        "Mobile app version",
      ],
      architecture: "Next.js frontend + simple API logic. No database needed. Deploy on Vercel in 2 minutes.",
    },
    techStack: ["Next.js", "Tailwind CSS", "Vercel"],
    pitch: `Most people face this problem daily and current solutions are broken. We built a tool that solves it in seconds — no complexity, no fluff. In a hackathon setting, we can demo a working version that judges can actually use. This isn't a concept. It's a product.`,
  };
}

export async function POST(req: NextRequest) {
  const { idea } = await req.json();
  const result = analyzeIdea(idea);
  return NextResponse.json(result);
}