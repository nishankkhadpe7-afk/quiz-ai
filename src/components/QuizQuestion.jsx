import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Info } from "lucide-react";

/**
 * Returns Tailwind classes for an option based on its state.
 * All states have explicit light + dark variants for WCAG-friendly contrast.
 */
const getOptionStyles = ({ isRevealed, isCorrect, isSelected }) => {
  if (!isRevealed) {
    // Default state
    return {
      container:
        "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#1d1d1f] dark:text-slate-100 hover:border-[#0071e3]/40 dark:hover:border-[#0071e3]/50 hover:shadow-md dark:hover:shadow-slate-900/50 shadow-sm dark:shadow-lg dark:shadow-slate-900/30 cursor-pointer",
      badge: "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400",
      icon: null,
    };
  }

  if (isCorrect) {
    // Correct answer — always highlighted
    return {
      container:
        "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-200 shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/5 ring-1 ring-emerald-500/20 dark:ring-emerald-400/20",
      badge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300",
      icon: <CheckCircle2 size={20} className="text-emerald-500 dark:text-emerald-400 shrink-0" />,
    };
  }

  if (isSelected) {
    // Wrong answer selected
    return {
      container:
        "bg-rose-50 dark:bg-rose-500/10 border-rose-400 dark:border-rose-400 text-rose-700 dark:text-rose-200 shadow-md shadow-rose-500/10 dark:shadow-rose-500/5 ring-1 ring-rose-400/20 dark:ring-rose-400/20",
      badge: "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300",
      icon: <XCircle size={20} className="text-rose-500 dark:text-rose-400 shrink-0" />,
    };
  }

  // Disabled / unselected after reveal
  return {
    container:
      "bg-white/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/40 text-slate-400 dark:text-slate-500 opacity-50",
    badge: "bg-slate-100/60 dark:bg-slate-700/40 text-slate-300 dark:text-slate-600",
    icon: null,
  };
};

export default function QuizQuestion({
  question,
  currentIdx,
  totalQuestions,
  score,
  topic,
  selectedAnswer,
  isRevealed,
  onSelectAnswer,
  onNext,
  difficulty,
}) {
  const progressPct = ((currentIdx + 1) / totalQuestions) * 100;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-4 sm:pb-6 md:pb-8 gap-4 sm:gap-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-[11px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[#0071e3]">
              {topic}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                difficulty === "Easy"
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : difficulty === "Hard"
                  ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                  : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}
            >
              {difficulty}
            </span>
          </div>
          <h3 className="text-lg sm:text-[24px] md:text-[28px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            Question {currentIdx + 1} of {totalQuestions}
          </h3>
        </div>
        <div className="text-right sm:text-right">
          <p className="text-xs sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Score
          </p>
          <p className="text-xl sm:text-[24px] md:text-[28px] font-bold text-[#1d1d1f] dark:text-white">
            {score}/{totalQuestions}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#0071e3] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Question & Options */}
      <div className="space-y-6 sm:space-y-8 md:space-y-12">
        {/* Question Card */}
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[100px] sm:min-h-[120px] flex items-center"
        >
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug sm:leading-tight tracking-tight break-words text-[#1d1d1f] dark:text-white">
            {question.question}
          </h2>
        </motion.div>

        {/* Options */}
        <div className="grid gap-2 sm:gap-2.5 md:gap-3">
          {question.options.map((option, i) => {
            const isCorrect = option === question.answer;
            const isSelected = option === selectedAnswer;
            const styles = getOptionStyles({ isRevealed, isCorrect, isSelected });

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                whileHover={!isRevealed ? { scale: 1.005 } : {}}
                whileTap={!isRevealed ? { scale: 0.995 } : {}}
                disabled={isRevealed}
                onClick={() => onSelectAnswer(option)}
                className={`w-full flex items-center p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border transition-all font-semibold text-xs sm:text-sm md:text-base leading-snug text-left min-h-[44px] sm:min-h-[48px] md:min-h-[52px] disabled:cursor-default ${styles.container}`}
              >
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md sm:rounded-lg md:rounded-xl mr-2 sm:mr-3 md:mr-5 text-xs sm:text-[12px] md:text-sm font-bold transition-all shrink-0 ${styles.badge}`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {isRevealed && styles.icon && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
                    className="ml-2"
                  >
                    {styles.icon}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation + Next */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="pt-4 sm:pt-6 md:pt-8"
            >
              {/* Result Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                  selectedAnswer === question.answer
                    ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300"
                }`}
              >
                {selectedAnswer === question.answer ? (
                  <>
                    <CheckCircle2 size={16} /> Correct!
                  </>
                ) : (
                  <>
                    <XCircle size={16} /> Incorrect
                  </>
                )}
              </motion.div>

              {/* Explanation Card */}
              <div className="bg-[#0071e3]/5 dark:bg-[#0071e3]/10 border border-[#0071e3]/10 dark:border-[#0071e3]/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-2xl md:rounded-3xl mb-4 sm:mb-6 md:mb-8">
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0071e3] uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Info size={14} className="shrink-0" /> Explanation
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-[17px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {question.explanation}
                </p>
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onNext}
                className="w-full bg-[#0071e3] text-white px-7 py-3 rounded-full font-semibold text-[15px] tracking-tight transition-all flex items-center justify-center gap-2 hover:bg-[#0077ed] h-10 sm:h-11 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-[17px] cursor-pointer"
              >
                {isLastQuestion ? "See Results" : "Next Question"}
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
