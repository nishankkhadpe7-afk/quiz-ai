import React, { useState, useEffect, useRef } from "react";
import { 
  BrainCircuit, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Loader2, 
  Trophy,
  Target,
  Clock,
  Zap,
  ArrowLeft,
  Users,
  ShieldCheck,
  Layers,
  Search,
  Info,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration & API ---
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || ""; 

const fetchQuizQuestions = async (topic) => {
  const systemPrompt = `You are a professional assessment creator. Generate 5 clear multiple-choice questions about: "${topic}". Respond ONLY with a valid JSON array. Format: [{"question": "text", "options": ["A", "B", "C", "D"], "answer": "exact text of correct option", "explanation": "One clear sentence of context."}]`;

  const payload = {
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Topic: ${topic}`
      }
    ]
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Quiz Master Pro"
      },
      body: JSON.stringify(payload),
    }
  );
  const result = await response.json();
  console.log("API Response:", result);
  if (result.error) throw new Error(result.error.message);
  if (!result.choices || !result.choices[0] || !result.choices[0].message) {
    console.error("Invalid response structure:", result);
    throw new Error("Invalid API response structure");
  }
  const content = result.choices[0].message.content;
  console.log("API Content:", content);
  const cleanJson = content.replace(/```json|```/g, "").trim();
  console.log("Cleaned JSON:", cleanJson);
  const parsed = JSON.parse(cleanJson);
  console.log("Parsed Questions:", parsed);
  return parsed;
};

// --- Minimal UI Components ---

const PrimaryButton = ({ children, onClick, className = "", icon: Icon, disabled = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.01 } : {}}
    whileTap={!disabled ? { scale: 0.99 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#0071e3] text-white px-7 py-3 rounded-full font-semibold text-[15px] tracking-tight transition-all flex items-center justify-center gap-2 hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children} {Icon && <Icon size={18} />}
  </motion.button>
);

const GhostButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-semibold text-[15px] tracking-tight text-slate-600 dark:text-slate-300 hover:text-[#0071e3] dark:hover:text-[#4fa3ff] transition-all ${className}`}
  >
    {children}
  </button>
);

export default function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startQuiz = async () => {
    if (!topic.trim()) return;
    if (!apiKey) {
      alert("API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchQuizQuestions(topic);
      setQuestions(data);
      setQuizStarted(true);
      setCurrentIdx(0);
      setScore(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz. Check your API key or network connection.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuizStarted(false);
    setQuestions([]);
    setTopic("");
    setCurrentIdx(0);
    setScore(0);
    setIsRevealed(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center font-sans antialiased">
        <Loader2 className="h-10 w-10 text-[#0071e3] animate-spin mb-6" />
        <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-widest">Generating Assessment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950 text-[#1d1d1f] dark:text-slate-50 font-sans selection:bg-[#0071e3]/20 antialiased transition-colors" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
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
            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-[#0071e3] dark:hover:text-[#4fa3ff] transition-colors">Features</button>
            <button onClick={() => scrollToSection(aboutRef)} className="hover:text-[#0071e3] dark:hover:text-[#4fa3ff] transition-colors">About</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <PrimaryButton onClick={() => { if(quizStarted) reset(); document.getElementById('hero-input')?.focus(); }} className="py-1.5 sm:py-2 px-4 sm:px-5 text-xs sm:text-sm">
              {quizStarted ? "Reset" : "Get Started"}
            </PrimaryButton>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <PrimaryButton onClick={() => { if(quizStarted) reset(); document.getElementById('hero-input')?.focus(); }} className="py-1.5 px-3 text-xs">
              {quizStarted ? "Reset" : "Start"}
            </PrimaryButton>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!quizStarted ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* HERO SECTION */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
                <div className="space-y-8 sm:space-y-10">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-white leading-[1.08]">
                    Quiz Master <span className="text-[#0071e3]">Pro</span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-[19px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-md">
                    Generate custom quizzes on any topic instantly.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 max-w-sm">
                  <input
                    id="hero-input"
                    type="text"
                    placeholder="e.g., Python, Biology, History..."
                    className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-[#0071e3] outline-none text-base sm:text-[17px] font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                  />
                  <PrimaryButton onClick={startQuiz} icon={ChevronRight} className="h-12 sm:h-14 text-base sm:text-[17px]">Start Quiz</PrimaryButton>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="aspect-square bg-white dark:bg-slate-800 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex items-center justify-center p-12 overflow-hidden">
                   <div className="w-full h-full space-y-6 flex flex-col justify-center">
                      <div className="h-2.5 w-1/4 bg-slate-100 dark:bg-slate-700 rounded-full" />
                      <div className="h-8 w-full bg-slate-50 dark:bg-slate-700 rounded-xl" />
                      <div className="space-y-3 pt-6">
                        <div className="h-12 w-full border border-slate-100 dark:border-slate-700 rounded-2xl" />
                        <div className="h-12 w-full bg-[#0071e3]/5 dark:bg-[#0071e3]/10 border border-[#0071e3]/20 dark:border-[#0071e3]/30 rounded-2xl flex items-center px-4">
                            <div className="w-4 h-4 rounded-full bg-[#0071e3]" />
                        </div>
                        <div className="h-12 w-full border border-slate-100 dark:border-slate-700 rounded-2xl" />
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* FEATURES SECTION */}
            <section ref={featuresRef} className="bg-white dark:bg-slate-900 py-16 sm:py-24 md:py-32 border-y border-slate-200/60 dark:border-slate-800/60">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-[#1d1d1f] dark:text-white">Why Choose Us</h2>
                <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
                  {[
                    { title: "AI Powered", desc: "Intelligent questions generated for any topic.", icon: Layers },
                    { title: "Clean UI", desc: "Beautiful, distraction-free interface.", icon: Target },
                    { title: "Instant Results", desc: "Get your score and insights immediately.", icon: Zap }
                  ].map((f, i) => (
                    <div key={i} className="space-y-4">
                      <div className="text-[#0071e3] bg-[#0071e3]/5 dark:bg-[#0071e3]/10 w-12 h-12 rounded-xl flex items-center justify-center"><f.icon size={26} strokeWidth={2}/></div>
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
                <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight leading-tight text-[#1d1d1f] dark:text-white">Learn Better<br /><span className="text-[#0071e3]">Instantly.</span></h2>
                <p className="text-base sm:text-lg md:text-[17px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Quiz Master Pro makes learning interactive and instant. Get AI-powered questions on any topic and track your progress.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 md:p-10 border border-slate-200/60 dark:border-slate-700/60">
                 <div className="space-y-6 sm:space-y-8">
                    <div className="flex gap-4 items-start">
                        <div className="bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-2xl shadow-sm shrink-0"><ShieldCheck className="text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" /></div>
                        <div>
                            <h4 className="font-bold text-base sm:text-[17px] text-[#1d1d1f] dark:text-white">Accurate Questions</h4>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">High-quality, relevant content.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-white dark:bg-slate-700 p-2 sm:p-3 rounded-2xl shadow-sm shrink-0"><Zap className="text-[#0071e3] w-5 h-5 sm:w-6 sm:h-6" /></div>
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
              <div className="space-y-6 sm:space-y-8 md:space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-4 sm:pb-6 md:pb-8 gap-4 sm:gap-0">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-[11px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[#0071e3]">{topic}</span>
                    <h3 className="text-lg sm:text-[24px] md:text-[28px] font-bold tracking-tight text-[#1d1d1f] dark:text-white">Question {currentIdx + 1} of {questions.length}</h3>
                  </div>
                  <div className="text-right sm:text-right">
                    <p className="text-xs sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Score</p>
                    <p className="text-xl sm:text-[24px] md:text-[28px] font-bold text-slate-900 dark:text-white">{score}/{questions.length}</p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8 md:space-y-12">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[100px] sm:min-h-[120px] flex items-center">
                    <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-snug sm:leading-tight tracking-tight break-words dark:text-white" style={{ color: '#000000' }}>
                      {questions[currentIdx].question}
                    </h2>
                  </div>

                  <div className="grid gap-2 sm:gap-2.5 md:gap-3">
                    {questions[currentIdx].options.map((option, i) => {
                      const isCorrect = option === questions[currentIdx].answer;
                      const isSelected = option === selectedAnswer;
                      
                      let style = "bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-[#1d1d1f] dark:text-white hover:border-[#0071e3]/40 shadow-sm dark:shadow-lg dark:shadow-slate-900/50";
                      if (isRevealed) {
                        if (isCorrect) style = "bg-[#0071e3] text-white border-[#0071e3] shadow-lg shadow-[#0071e3]/20";
                        else if (isSelected) style = "bg-rose-50 border-rose-200 text-rose-700 opacity-90";
                        else style = "opacity-40 border-slate-100 text-slate-400 grayscale-[0.5]";
                      }

                      return (
                        <button
                          key={i}
                          disabled={isRevealed}
                          onClick={() => {
                            setSelectedAnswer(option);
                            setIsRevealed(true);
                            if (option === questions[currentIdx].answer) setScore(s => s + 1);
                          }}
                          className={`w-full flex items-center p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl border transition-all font-semibold text-xs sm:text-sm md:text-base leading-snug text-left min-h-[44px] sm:min-h-[48px] md:min-h-[52px] ${style}`}
                        >
                          <span className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md sm:rounded-lg md:rounded-xl mr-2 sm:mr-3 md:mr-5 text-xs sm:text-[12px] md:text-sm font-bold transition-all shrink-0 ${
                            isRevealed ? (isCorrect ? 'bg-white/20' : 'bg-rose-100/50') : 'bg-slate-100 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 sm:pt-6 md:pt-8">
                        <div className="bg-[#0071e3]/5 dark:bg-[#0071e3]/10 border border-[#0071e3]/10 dark:border-[#0071e3]/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-2xl md:rounded-3xl mb-4 sm:mb-6 md:mb-8">
                           <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0071e3] uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] mb-2 flex items-center gap-2">
                            <Info size={14} className="shrink-0" /> Explanation
                           </p>
                           <p className="text-xs sm:text-sm md:text-base lg:text-[17px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{questions[currentIdx].explanation}</p>
                        </div>
                        <PrimaryButton onClick={() => { setIsRevealed(false); setSelectedAnswer(null); setCurrentIdx(i => i + 1); }} className="w-full h-10 sm:h-11 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-[17px]" icon={ChevronRight}>
                          {currentIdx === questions.length - 1 ? "See Results" : "Next Question"}
                        </PrimaryButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* RESULTS */
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 sm:py-10 md:py-12 space-y-6 sm:space-y-10 md:space-y-12 w-full">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#0071e3] dark:bg-[#0071e3]/20 rounded-2xl sm:rounded-3xl md:rounded-[32px] shadow-2xl shadow-[#0071e3]/30">
                  <Trophy size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white dark:text-[#4fa3ff]" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">Quiz Complete!</h2>
                  <p className="text-sm sm:text-base md:text-[19px] text-slate-500 dark:text-slate-400 font-medium">Great job on <span className="text-[#0071e3] dark:text-[#4fa3ff]">{topic}</span>!</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-sm mx-auto">
                   <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[32px] shadow-sm dark:shadow-lg dark:shadow-slate-900/30">
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Score</p>
                      <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#0071e3] dark:text-[#4fa3ff] tracking-tighter">{score}/{questions.length}</p>
                   </div>
                   <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[32px] shadow-sm dark:shadow-lg dark:shadow-slate-900/30">
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Accuracy</p>
                      <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1d1d1f] dark:text-white tracking-tighter">{Math.round((score/questions.length)*100)}%</p>
                   </div>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 md:pt-8 lg:pt-10">
                  <PrimaryButton onClick={reset} className="h-10 sm:h-11 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-[17px]">New Quiz</PrimaryButton>
                  <GhostButton onClick={startQuiz} className="h-10 sm:h-11 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-[17px]">Retake</GhostButton>
                </div>
              </motion.div>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 sm:mt-20 py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="space-y-4">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="bg-[#1d1d1f] dark:bg-white p-1 rounded-lg"><BrainCircuit size={18} className="text-white dark:text-slate-900" /></div>
                    <span className="font-bold text-base sm:text-lg md:text-[17px] tracking-tight text-[#1d1d1f] dark:text-white">Quiz Master Pro</span>
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