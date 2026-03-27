import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Gauge, Hash } from "lucide-react";
import { DIFFICULTY_OPTIONS, QUESTION_COUNT_OPTIONS, getDifficultyLabel } from "../utils/quizUtils";

const DIFFICULTY_COLORS = {
  Easy: {
    active: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
    inactive: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/40",
  },
  Medium: {
    active: "bg-amber-500 text-white shadow-lg shadow-amber-500/25",
    inactive: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/40",
  },
  Hard: {
    active: "bg-rose-500 text-white shadow-lg shadow-rose-500/25",
    inactive: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/40",
  },
};

export default function QuizSetup({ topic, setTopic, difficulty, setDifficulty, questionCount, setQuestionCount, onStart, loading }) {
  const canStart = topic.trim().length > 0 && !loading;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.08]">
            <span className="text-[#1d1d1f] dark:text-white">Quiz Master</span>{" "}
            <span className="text-[#0071e3]">Pro</span>
          </h1>
          <p className="text-base sm:text-lg md:text-[19px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-md">
            Generate custom quizzes on any topic instantly.
          </p>
        </div>

        {/* Topic Input */}
        <div className="flex flex-col gap-5 max-w-sm">
          <input
            id="hero-input"
            type="text"
            placeholder="e.g., Python, Biology, History..."
            className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-[#0071e3] outline-none text-base sm:text-[17px] font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canStart && onStart()}
          />

          {/* Difficulty Selector */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
              <Gauge size={13} /> Difficulty
            </label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((d) => (
                <motion.button
                  key={d}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-[13px] font-semibold tracking-tight transition-all cursor-pointer ${
                    difficulty === d ? DIFFICULTY_COLORS[d].active : DIFFICULTY_COLORS[d].inactive
                  }`}
                >
                  {d}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Question Count Selector */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
              <Hash size={13} /> Questions
            </label>
            <div className="flex gap-2">
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-[13px] font-semibold tracking-tight transition-all cursor-pointer ${
                    questionCount === n
                      ? "bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/25"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0071e3]/40 dark:hover:border-[#0071e3]/40"
                  }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={canStart ? { scale: 1.01 } : {}}
            whileTap={canStart ? { scale: 0.99 } : {}}
            onClick={onStart}
            disabled={!canStart}
            className="bg-[#0071e3] text-white px-7 py-3.5 rounded-full font-semibold text-[15px] tracking-tight transition-all flex items-center justify-center gap-2 hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed h-12 sm:h-14 text-base sm:text-[17px] cursor-pointer"
          >
            {loading ? (
              <>Generating...</>
            ) : (
              <>
                Start Quiz <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="hidden md:block relative">
        <div className="aspect-square bg-white dark:bg-slate-800 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex items-center justify-center p-12 overflow-hidden">
          <div className="w-full h-full space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-1/4 bg-slate-100 dark:bg-slate-700 rounded-full" />
              <div className={`h-5 px-2 rounded-md text-[9px] font-bold flex items-center ${
                difficulty === "Easy" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : difficulty === "Hard" ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}>
                {difficulty}
              </div>
            </div>
            <div className="h-8 w-full bg-slate-50 dark:bg-slate-700 rounded-xl" />
            <div className="space-y-3 pt-6">
              <div className="h-12 w-full border border-slate-100 dark:border-slate-700 rounded-2xl" />
              <div className="h-12 w-full bg-[#0071e3]/5 dark:bg-[#0071e3]/10 border border-[#0071e3]/20 dark:border-[#0071e3]/30 rounded-2xl flex items-center px-4">
                <div className="w-4 h-4 rounded-full bg-[#0071e3]" />
              </div>
              <div className="h-12 w-full border border-slate-100 dark:border-slate-700 rounded-2xl" />
              <div className="h-12 w-full border border-slate-100 dark:border-slate-700 rounded-2xl" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600">{questionCount} questions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
