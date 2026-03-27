import React from "react";
import { motion } from "framer-motion";
import { Trophy, ChevronRight, RotateCcw } from "lucide-react";
import { getPerformanceFeedback, getDifficultyLabel } from "../utils/quizUtils";

export default function QuizResults({ score, totalQuestions, topic, difficulty, onNewQuiz, onRetake }) {
  const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const feedback = getPerformanceFeedback(score, totalQuestions);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-6 sm:py-10 md:py-12 space-y-6 sm:space-y-10 md:space-y-12 w-full"
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#0071e3] dark:bg-[#0071e3]/20 rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-2xl shadow-[#0071e3]/30"
      >
        <Trophy size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white dark:text-[#4fa3ff]" />
      </motion.div>

      {/* Title & Feedback */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
          Quiz Complete!
        </h2>
        <p className="text-sm sm:text-base md:text-[19px] text-slate-500 dark:text-slate-400 font-medium">
          {feedback.emoji}{" "}
          <span className="text-[#1d1d1f] dark:text-slate-200 font-semibold">{feedback.message}</span>
        </p>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
          Topic: <span className="text-[#0071e3] dark:text-[#4fa3ff]">{topic}</span> ·{" "}
          <span
            className={`${
              difficulty === "Easy"
                ? "text-emerald-500"
                : difficulty === "Hard"
                ? "text-rose-500"
                : "text-amber-500"
            }`}
          >
            {difficulty}
          </span>{" "}
          · {getDifficultyLabel(difficulty)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[32px] shadow-sm dark:shadow-lg dark:shadow-slate-900/30"
        >
          <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Score
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#0071e3] dark:text-[#4fa3ff] tracking-tighter">
            {score}/{totalQuestions}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[32px] shadow-sm dark:shadow-lg dark:shadow-slate-900/30"
        >
          <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Accuracy
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1d1d1f] dark:text-white tracking-tighter">
            {pct}%
          </p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 md:pt-8 lg:pt-10">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onNewQuiz}
          className="bg-[#0071e3] text-white px-7 py-3 rounded-full font-semibold text-[15px] tracking-tight transition-all flex items-center justify-center gap-2 hover:bg-[#0077ed] h-10 sm:h-11 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-[17px] cursor-pointer"
        >
          New Quiz <ChevronRight size={18} />
        </motion.button>
        <button
          onClick={onRetake}
          className="px-6 py-3 rounded-full font-semibold text-[15px] tracking-tight text-slate-600 dark:text-slate-300 hover:text-[#0071e3] dark:hover:text-[#4fa3ff] transition-all h-10 sm:h-11 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-[17px] cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} /> Retake Quiz
        </button>
      </div>
    </motion.div>
  );
}
