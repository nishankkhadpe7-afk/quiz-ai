import React, { useState, useEffect, useRef } from "react";
import {
  BrainCircuit,
  Moon,
  Sun,
  Loader2,
  Layers,
  Target,
  Zap,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchQuizQuestions } from "./utils/quizApi";
import QuizSetup from "./components/QuizSetup";
import QuizQuestion from "./components/QuizQuestion";
import QuizResults from "./components/QuizResults";

// --- Reusable Button Components ---

const PrimaryButton = ({ children, onClick, className = "", icon: Icon, disabled = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.01 } : {}}
    whileTap={!disabled ? { scale: 0.99 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#0071e3] text-white px-7 py-3 rounded-full font-semibold text-[15px] tracking-tight transition-all flex items-center justify-center gap-2 hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
  >
    {children} {Icon && <Icon size={18} />}
  </motion.button>
);

export default function App() {
  // --- State ---
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);

  const aboutRef = useRef(null);
  const featuresRef = useRef(null);

  // --- Dark mode sync ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Quiz Actions ---
  const startQuiz = async () => {
    if (!topic.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const data = await fetchQuizQuestions({ topic, difficulty, questionCount });
      setQuestions(data);
      setQuizStarted(true);
      setCurrentIdx(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsRevealed(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuizStarted(false);
    setQuestions([]);
    setTopic("");
    setDifficulty("Medium");
    setQuestionCount(5);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setError(null);
  };

  const handleSelectAnswer = (option) => {
    setSelectedAnswer(option);
    setIsRevealed(true);
    if (option === questions[currentIdx].answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsRevealed(false);
    setSelectedAnswer(null);
    setCurrentIdx((i) => i + 1);
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    startQuiz();
  };

  // --- Loading Overlay ---
  if (loading && !quizStarted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center font-sans antialiased transition-colors">
        <Loader2 className="h-10 w-10 text-[#0071e3] animate-spin mb-6" />
        <p className="text-[13px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Generating Assessment
        </p>
        <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-2">
          {questionCount} {difficulty} questions on {topic}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950 text-[#1d1d1f] dark:text-slate-50 font-sans selection:bg-[#0071e3]/20 antialiased transition-colors"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* NAVIGATION */}
      <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group" onClick={reset}>
            <div className="bg-[#1d1d1f] dark:bg-white p-1 rounded-lg transition-transform group-hover:scale-105">
              <BrainCircuit className="text-white dark:text-slate-900 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-base sm:text-lg md:text-[19px] font-bold tracking-tight">Quiz Master</span>
          </div>
          <div className="hidden md:flex gap-6 sm:gap-8 items-center text-sm sm:text-[14px] font-medium text-slate-500 dark:text-slate-400">
            {!quizStarted && (
              <>
                <button onClick={() => scrollToSection(featuresRef)} className="hover:text-[#0071e3] dark:hover:text-[#4fa3ff] transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection(aboutRef)} className="hover:text-[#0071e3] dark:hover:text-[#4fa3ff] transition-colors">
                  About
                </button>
              </>
            )}
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <PrimaryButton
              onClick={() => {
                if (quizStarted) reset();
                document.getElementById("hero-input")?.focus();
              }}
              className="py-1.5 sm:py-2 px-4 sm:px-5 text-xs sm:text-sm"
            >
              {quizStarted ? "Reset" : "Get Started"}
            </PrimaryButton>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <PrimaryButton
              onClick={() => {
                if (quizStarted) reset();
                document.getElementById("hero-input")?.focus();
              }}
              className="py-1.5 px-3 text-xs"
            >
              {quizStarted ? "Reset" : "Start"}
            </PrimaryButton>
          </div>
        </div>
      </nav>

      {/* ERROR TOAST */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] max-w-lg w-[92%]"
          >
            <div className="bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl shadow-lg flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Something went wrong</p>
                <p className="text-xs mt-0.5 opacity-80">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="shrink-0 p-1 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!quizStarted ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* HERO / SETUP SECTION */}
            <QuizSetup
              topic={topic}
              setTopic={setTopic}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              onStart={startQuiz}
              loading={loading}
            />

            {/* FEATURES SECTION */}
            <section ref={featuresRef} className="bg-white dark:bg-slate-900 py-16 sm:py-24 md:py-32 border-y border-slate-200/60 dark:border-slate-800/60">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-[#1d1d1f] dark:text-white">
                  Why Choose Us
                </h2>
                <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                  {[
                    { title: "AI Powered", desc: "Intelligent questions generated for any topic.", icon: Layers },
                    { title: "Clean UI", desc: "Beautiful, distraction-free interface.", icon: Target },
                    { title: "Instant Results", desc: "Get your score and insights immediately.", icon: Zap },
                  ].map((f, i) => (
                    <div key={i} className="space-y-4">
                      <div className="text-[#0071e3] bg-[#0071e3]/5 dark:bg-[#0071e3]/10 w-12 h-12 rounded-xl flex items-center justify-center">
                        <f.icon size={26} strokeWidth={2} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">{f.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ABOUT SECTION */}
            <section ref={aboutRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-20 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight leading-tight text-[#1d1d1f] dark:text-white">
                  Learn Better
                  <br />
                  <span className="text-[#0071e3]">Instantly.</span>
                </h2>
                <p className="text-base sm:text-lg md:text-[17px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Quiz Master Pro makes learning interactive and instant. Get AI-powered questions on any topic and track your progress.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 md:p-10 border border-slate-200/60 dark:border-slate-700/60">
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex gap-4 items-start">
                    <div className="bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-2xl shadow-sm shrink-0">
                      <ShieldCheck className="text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-[17px] text-[#1d1d1f] dark:text-white">Accurate Questions</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">High-quality, relevant content.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-2xl shadow-sm shrink-0">
                      <Zap className="text-[#0071e3] w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-[17px] text-[#1d1d1f] dark:text-white">Any Topic</h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Science, history, languages & more.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          /* QUIZ MODE */
          <motion.div
            key="quiz-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full min-h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20 flex items-center justify-center"
          >
            <div className="w-full">
              {currentIdx < questions.length ? (
                <QuizQuestion
                  question={questions[currentIdx]}
                  currentIdx={currentIdx}
                  totalQuestions={questions.length}
                  score={score}
                  topic={topic}
                  difficulty={difficulty}
                  selectedAnswer={selectedAnswer}
                  isRevealed={isRevealed}
                  onSelectAnswer={handleSelectAnswer}
                  onNext={handleNextQuestion}
                />
              ) : (
                <QuizResults
                  score={score}
                  totalQuestions={questions.length}
                  topic={topic}
                  difficulty={difficulty}
                  onNewQuiz={reset}
                  onRetake={handleRetake}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 sm:mt-20 py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <div className="bg-[#1d1d1f] dark:bg-white p-1 rounded-lg">
                <BrainCircuit size={18} className="text-white dark:text-slate-900" />
              </div>
              <span className="font-bold text-base sm:text-lg md:text-[17px] tracking-tight text-[#1d1d1f] dark:text-white">
                Quiz Master Pro
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
              © 2026 Quiz Master. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}