import React, { useState } from "react";
import { UserProfile, Expenses, FinancialPersonality } from "./types";
import Header from "./components/Header";
import HamsterWheelSimulator from "./components/HamsterWheelSimulator";
import PersonalityQuiz from "./components/PersonalityQuiz";
import CompoundCalculator from "./components/CompoundCalculator";
import AIAdvisorChat from "./components/AIAdvisorChat";
import { Coins, HelpCircle, TrendingUp, MessageSquare, Flame, ShieldAlert, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeStep, setActiveStep] = useState<"simulator" | "quiz" | "calculator" | "chat">("simulator");
  const [awarenessScore, setAwarenessScore] = useState<number>(30); // Starting score
  
  const [profile, setProfile] = useState<UserProfile>({
    income: 1200,
    expenses: {
      rent: 400,
      utilities: 120,
      food: 350,
      transport: 130,
      leisure: 120,
      others: 80,
    },
    personality: "hamster",
    leaks: [
      "شرب شيشة وقهاوي يومية متكررة",
      "قروض استهلاك بنسبة فائدة مجحفة (TMM+)",
    ],
    goal: "الاستقلال المالي التام والحرية المادية",
  });

  const handleUpdateProfile = (
    income: number,
    expenses: Expenses,
    leaks: string[],
    scoreValue: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      income,
      expenses,
      leaks,
    }));
    setAwarenessScore(scoreValue);
  };

  const handleQuizComplete = (newPersonality: FinancialPersonality) => {
    setProfile((prev) => ({
      ...prev,
      personality: newPersonality,
    }));
    // Boost awareness score slightly upon completing the diagnostic
    setAwarenessScore((prev) => Math.min(100, prev + 15));
    // Auto advance to the next logical step (strategic planner) to create a premium flow
    setTimeout(() => {
      setActiveStep("calculator");
    }, 1800);
  };

  // Quick navigation helpers with beautiful active states
  const steps = [
    { id: "simulator", label: "ميزان المتاهة", icon: <Coins className="w-4 h-4" /> },
    { id: "quiz", label: "تشخيص ثغراتك", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "calculator", label: "مخطط الأصول", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "chat", label: "المرشد المالي", icon: <MessageSquare className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-forest-dark text-white font-sans selection:bg-gold-dawn/30 selection:text-white flex flex-col justify-between">
      
      {/* Header with Dynamic Awareness Score */}
      <Header score={awarenessScore} />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-1 flex flex-col gap-8">
        
        {/* Intro Banner Card */}
        <div className="bg-gradient-to-l from-forest-medium/70 to-forest-dark border border-forest-light/40 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-dawn/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-accent/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right flex flex-col gap-3 max-w-2xl">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-dawn bg-gold-dawn/10 px-3 py-1.5 rounded-md border border-gold-dawn/20 self-start mb-1">
                تحدي الخروج من متاهة المال التونسية 🇹🇳
              </span>
              <h2 className="serif text-3xl md:text-5xl font-bold text-white leading-tight">
                هَلْ تَظُنُّ أَنَّ كَثْرَةَ العَمَلِ هِيَ طَرِيقُكَ لِلثَّرَاءِ؟
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-medium">
                نحن نغرق في تفاصيل يومنا وننسى جوهر اللعبة المالية. العمل الشاق دون وعي مالي هو كمن يحفر بئراً بإبرة. توقف واسأل نفسك: لماذا تتكرر نفس النتائج؟ الأمر ليس عن مجهود بدني إضافي، بل عن طريقة تفكير جديدة وبصيرة مالية واعدة.
              </p>
            </div>
            
            {/* Quick stats / Motivation */}
            <div className="bg-forest-dark/80 border border-forest-light/30 p-4 rounded-2xl text-center shrink-0 w-full md:w-auto">
              <div className="text-xs text-white/50 mb-1">الحل يكمن في:</div>
              <div className="text-lg font-black text-gold-dawn animate-pulse-gold flex items-center justify-center gap-1">
                <Sparkles className="w-5 h-5 text-gold-light" />
                تحويل الاستهلاك إلى أصول
              </div>
              <div className="text-[10px] text-white/40 mt-1">عبر الـ SICAV والادخار المركب</div>
            </div>
          </div>
        </div>

        {/* Step Selector Tab Interface */}
        <div className="flex flex-col gap-6">
          <div className="bg-forest-medium/30 p-2 border border-forest-light/25 rounded-2xl flex flex-wrap md:flex-nowrap items-center justify-between gap-1 shadow-inner">
            {steps.map((step, idx) => {
              const active = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 border cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-gold-dawn to-gold-light text-forest-dark border-transparent shadow-lg shadow-gold-dawn/10 font-extrabold"
                      : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  {step.icon}
                  <span>{step.label}</span>
                  <span className="text-[10px] opacity-40 font-mono">0{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Active View Container */}
          <div className="min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeStep === "simulator" && (
                  <HamsterWheelSimulator
                    onUpdateProfile={handleUpdateProfile}
                    personality={profile.personality}
                  />
                )}
                {activeStep === "quiz" && (
                  <PersonalityQuiz
                    onQuizComplete={handleQuizComplete}
                    currentPersonality={profile.personality}
                  />
                )}
                {activeStep === "calculator" && (
                  <CompoundCalculator />
                )}
                {activeStep === "chat" && (
                  <AIAdvisorChat profile={profile} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Educational Tunisian Advice Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mt-2">
          <div className="bg-forest-medium/30 border border-forest-light/20 rounded-2xl p-4 flex gap-3 text-right">
            <div className="text-xl">💳</div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">تجنب قرض الاستهلاك</span>
              <p className="text-[10px] text-white/50 leading-relaxed">
                قروض شراء الأجهزة أو السفر تثقل كاهلك بفوائد (TMM + هامش البنك) تلتهم أكثر من 20% من مدخولك الشهري دون قيمة مضافة.
              </p>
            </div>
          </div>
          <div className="bg-forest-medium/30 border border-forest-light/20 rounded-2xl p-4 flex gap-3 text-right">
            <div className="text-xl">📈</div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">قوة الـ SICAV والرقاع</span>
              <p className="text-[10px] text-white/50 leading-relaxed">
                صناديق الاستثمار المشترك (SICAV) في تونس تتيح لك سحب فلوسك في أي وقت مع تحقيق أرباح يومية مركبة، وهي ممتازة للمبتدئين.
              </p>
            </div>
          </div>
          <div className="bg-forest-medium/30 border border-forest-light/20 rounded-2xl p-4 flex gap-3 text-right">
            <div className="text-xl">💻</div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">تصدير الخدمات الرقمية</span>
              <p className="text-[10px] text-white/50 leading-relaxed">
                الـ Freelance مع شركات أجنبية يدر عليك عملة صعبة تضاعف مدخولك، ويحميك من قيود الدخل المحلي الثابت والروتين.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer block */}
      <footer className="border-t border-forest-light/30 bg-forest-dark/95 py-6 px-4 shrink-0 text-center mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Wake Up Tunisia. كل الحقوق محفوظة لمستقبل مالي تونسي أفضل.</p>
          <div className="flex gap-4">
            <a href="#simulator-section" className="hover:text-gold-dawn transition-all">ميزان المتاهة</a>
            <a href="#diagnostic-section" className="hover:text-gold-dawn transition-all">تشخيص ثغراتك</a>
            <a href="#compound-section" className="hover:text-gold-dawn transition-all">مخطط الأصول</a>
            <a href="#advisor-chat-section" className="hover:text-gold-dawn transition-all">المرشد المالي</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
