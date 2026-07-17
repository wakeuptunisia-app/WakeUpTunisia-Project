import React, { useState, useEffect } from "react";
import { Expenses, FinancialPersonality } from "../types";
import { DollarSign, Trash2, Sliders, ArrowLeftRight, HelpCircle, Activity, Sparkles, CheckCircle, Flame } from "lucide-react";
import { motion } from "motion/react";

interface HamsterWheelSimulatorProps {
  onUpdateProfile: (income: number, expenses: Expenses, leaks: string[], scoreValue: number) => void;
  personality: FinancialPersonality;
}

export default function HamsterWheelSimulator({ onUpdateProfile, personality }: HamsterWheelSimulatorProps) {
  // Setup standard Tunisian income and expense estimates
  const [income, setIncome] = useState<number>(1200); // 1200 TND (Average middle class)
  const [expenses, setExpenses] = useState<Expenses>({
    rent: 400,
    utilities: 120,
    food: 350,
    transport: 130,
    leisure: 120,
    others: 80,
  });

  const [activeLeaks, setActiveLeaks] = useState<string[]>([
    "شرب شيشة وقهاوي يومية متكررة",
    "قروض استهلاك بنسبة فائدة مجحفة (TMM+)",
  ]);

  const availableLeaks = [
    { id: "leisure_cafe", label: "شرب شيشة وقهاوي يومية متكررة (بـ 5 آلاف أو أكثر)", loss: 150 },
    { id: "loan_interest", label: "قروض استهلاك بنسبة فائدة مجحفة (TMM+ عالية)", loss: 200 },
    { id: "brand_clothes", label: "شراء ملابس ماركات بالتقسيط (دون حاجة فعلية)", loss: 120 },
    { id: "taxi_apps", label: "الاعتماد المفرط على تطبيقات التاكسي الخاص (Bolt)", loss: 180 },
    { id: "delivery_food", label: "طلب أكلات جاهزة وتوصيل يومي (Food delivery)", loss: 160 },
    { id: "subscriptions", label: "اشتراكات نتفليكس/IPTV وصالات رياضة لا تستخدمها", loss: 50 },
  ];

  // Calculate totals
  const totalExpenses = 
    expenses.rent + 
    expenses.utilities + 
    expenses.food + 
    expenses.transport + 
    expenses.leisure + 
    expenses.others;
  const remaining = income - totalExpenses;
  const savingsRate = income > 0 ? (remaining > 0 ? (remaining / income) * 100 : 0) : 0;

  // Update expenses when income shifts to keep them realistic by default
  const handleIncomeChange = (newIncome: number) => {
    setIncome(newIncome);
    // Suggest standard proportions for Tunisia
    setExpenses({
      rent: Math.round(newIncome * 0.32),
      utilities: Math.round(newIncome * 0.10),
      food: Math.round(newIncome * 0.28),
      transport: Math.round(newIncome * 0.11),
      leisure: Math.round(newIncome * 0.10),
      others: Math.round(newIncome * 0.05),
    });
  };

  const handleExpenseChange = (key: keyof Expenses, value: number) => {
    setExpenses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle leak selection
  const toggleLeak = (leakLabel: string, lossAmount: number) => {
    setActiveLeaks(prev => {
      let updated;
      if (prev.includes(leakLabel)) {
        updated = prev.filter(item => item !== leakLabel);
        // Reduce leisure or others expense accordingly
        if (leakLabel.includes("قهاوي") || leakLabel.includes("أكلات") || leakLabel.includes("تطبيقات")) {
          setExpenses(e => ({ ...e, leisure: Math.max(0, e.leisure - Math.round(lossAmount * 0.5)) }));
        } else {
          setExpenses(e => ({ ...e, others: Math.max(0, e.others - Math.round(lossAmount * 0.5)) }));
        }
      } else {
        updated = [...prev, leakLabel];
        // Increase expense accordingly
        if (leakLabel.includes("قهاوي") || leakLabel.includes("أكلات") || leakLabel.includes("تطبيقات")) {
          setExpenses(e => ({ ...e, leisure: e.leisure + Math.round(lossAmount * 0.5) }));
        } else {
          setExpenses(e => ({ ...e, others: e.others + Math.round(lossAmount * 0.5) }));
        }
      }
      return updated;
    });
  };

  // Compute a dynamic financial score based on indicators
  // Positive: higher savings rate (up to 40 points), fewer leaks (up to 30 points), low debt/others (up to 30 points)
  const calculateScore = () => {
    let scoreVal = 10;
    // Savings rate score
    if (savingsRate > 0) {
      scoreVal += Math.min(40, Math.round(savingsRate * 1.2));
    }
    // Leak penalties
    const leakCount = activeLeaks.length;
    scoreVal += Math.max(0, 30 - leakCount * 5);

    // Rent proportion check (should be < 35% of income)
    const rentRatio = expenses.rent / income;
    if (rentRatio <= 0.35) scoreVal += 15;
    else if (rentRatio <= 0.45) scoreVal += 8;

    // Debt/others proportion check (should be < 15% of income)
    const otherRatio = expenses.others / income;
    if (otherRatio <= 0.1) scoreVal += 15;
    else if (otherRatio <= 0.25) scoreVal += 5;

    return Math.min(100, Math.max(10, scoreVal));
  };

  const awarenessScore = calculateScore();

  // Propagate profile up whenever there is a change
  useEffect(() => {
    onUpdateProfile(income, expenses, activeLeaks, awarenessScore);
  }, [income, expenses, activeLeaks, awarenessScore]);

  // Determine wheel rotation speed
  // If savings is 0 or negative, wheel spins fast.
  // If savings rate is high, wheel spins very slow or stops.
  const getSpinDuration = () => {
    if (remaining <= 0) return 1.5; // Very fast
    if (savingsRate < 10) return 3;
    if (savingsRate < 25) return 6;
    if (savingsRate < 45) return 12;
    return 30; // Very slow and calm
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="simulator-section">
      {/* Input Sliders & Controls */}
      <div className="lg:col-span-7 bg-forest-medium/50 border border-forest-light/40 rounded-3xl p-6 lg:p-8 backdrop-blur-sm shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-forest-light/30 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gold-dawn" />
            <h2 className="text-lg md:text-xl font-bold text-white">تفاصيل ميزانيتك الشهرية بالدينار (TND)</h2>
          </div>
          <span className="text-xs text-white/50 font-mono">الخطوة الأولى للوعي</span>
        </div>

        {/* Income Slider */}
        <div className="bg-forest-dark/40 border border-forest-light/20 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-white">شهريتك / دخلك الشهري الصافي</span>
            <span className="text-md font-black text-gold-dawn font-mono">{income.toLocaleString()} د.ت</span>
          </div>
          <input
            type="range"
            min="400"
            max="10000"
            step="50"
            value={income}
            onChange={(e) => handleIncomeChange(Number(e.target.value))}
            className="w-full h-2 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-gold-dawn focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
            <span>400 د.ت (الأجر الأدنى)</span>
            <span>2500 د.ت</span>
            <span>10,000 د.ت (إطارات عليا)</span>
          </div>
        </div>

        {/* Expenses Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rent */}
          <div className="bg-forest-dark/30 border border-forest-light/10 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/80">الكراء والسكن المالي</span>
              <span className="font-bold text-white font-mono">{expenses.rent} د.ت</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.round(income * 0.8)}
              step="10"
              value={expenses.rent}
              onChange={(e) => handleExpenseChange("rent", Number(e.target.value))}
              className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent"
            />
          </div>

          {/* Food */}
          <div className="bg-forest-dark/30 border border-forest-light/10 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/80">قضية الدار والماكلة</span>
              <span className="font-bold text-white font-mono">{expenses.food} د.ت</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.round(income * 0.8)}
              step="10"
              value={expenses.food}
              onChange={(e) => handleExpenseChange("food", Number(e.target.value))}
              className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent"
            />
          </div>

          {/* Utilities */}
          <div className="bg-forest-dark/30 border border-forest-light/10 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/80">الضوء، الماء والإنترنت</span>
              <span className="font-bold text-white font-mono">{expenses.utilities} د.ت</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={expenses.utilities}
              onChange={(e) => handleExpenseChange("utilities", Number(e.target.value))}
              className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent"
            />
          </div>

          {/* Transport */}
          <div className="bg-forest-dark/30 border border-forest-light/10 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/80">اللوواج، بنزين ونقل عمومي</span>
              <span className="font-bold text-white font-mono">{expenses.transport} د.ت</span>
            </div>
            <input
              type="range"
              min="0"
              max="1200"
              step="10"
              value={expenses.transport}
              onChange={(e) => handleExpenseChange("transport", Number(e.target.value))}
              className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent"
            />
          </div>

          {/* Leisure */}
          <div className="bg-forest-dark/30 border border-forest-light/10 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/80">القهوة والشيشة والتحويص</span>
              <span className="font-bold text-white font-mono">{expenses.leisure} د.ت</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              step="10"
              value={expenses.leisure}
              onChange={(e) => handleExpenseChange("leisure", Number(e.target.value))}
              className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent"
            />
          </div>

          {/* Others */}
          <div className="bg-forest-dark/30 border border-forest-light/10 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/80">قروض الاستهلاك ومصاريف أخرى</span>
              <span className="font-bold text-white font-mono">{expenses.others} د.ت</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.round(income * 0.9)}
              step="10"
              value={expenses.others}
              onChange={(e) => handleExpenseChange("others", Number(e.target.value))}
              className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent"
            />
          </div>
        </div>

        {/* Leaks Spotter (المصاريف الخفية المتسربة) */}
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-sm font-bold text-white/95 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-tunisia-red animate-pulse" />
            رصد الثغرات والتسربات المالية الشائعة في تونس:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableLeaks.map((leak) => {
              const selected = activeLeaks.includes(leak.label);
              return (
                <button
                  key={leak.id}
                  onClick={() => toggleLeak(leak.label, leak.loss)}
                  className={`text-right text-xs px-3 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-2 ${
                    selected
                      ? "bg-tunisia-red/15 border-tunisia-red/50 text-white font-medium"
                      : "bg-forest-dark/30 border-forest-light/20 text-white/70 hover:bg-forest-dark/50"
                  }`}
                >
                  <span>{leak.label}</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    selected ? "bg-tunisia-red border-transparent text-white" : "border-white/20"
                  }`}>
                    {selected && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Hamster Wheel Simulation Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
        {/* The Animated Hamster Wheel */}
        <div className="bg-forest-medium/50 border border-forest-light/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden h-full">
          <div className="absolute top-3 left-3 bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] font-mono text-white/60">
            محاكاة المسار المتكرر
          </div>

          <h3 className="text-md font-bold text-white mb-2">عجلة الركض اليومي</h3>
          <p className="text-xs text-white/60 max-w-xs mb-6">
            إذا كنت تستهلك كامل دخلك، فالعجلة تدور بجنون. وفر أكثر لتبقّي طاقة، ثم استثمر لتكسر العجلة كلياً!
          </p>

          {/* Animated SVG Wheel */}
          <div className="relative w-48 h-48 flex items-center justify-center my-4">
            {/* Rotate outer wheel */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                repeat: Infinity,
                duration: getSpinDuration(),
                ease: "linear",
              }}
              className="absolute w-44 h-44 rounded-full border-4 border-dashed border-gold-dawn/30 flex items-center justify-center"
            >
              <div className="w-full h-1 bg-gold-dawn/20 absolute"></div>
              <div className="w-1 h-full bg-gold-dawn/20 absolute"></div>
              <div className="w-36 h-36 rounded-full border border-dashed border-gold-dawn/20"></div>
            </motion.div>

            {/* Hamster placeholder or animation */}
            <div className="absolute flex flex-col items-center justify-center">
              {remaining <= 0 ? (
                <div className="animate-bounce">
                  <div className="text-3xl">🐹</div>
                  <span className="text-[10px] font-bold text-tunisia-red bg-tunisia-red/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                    يركض بجنون!
                  </span>
                </div>
              ) : savingsRate < 20 ? (
                <div>
                  <div className="text-3xl animate-pulse">🐹</div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                    يلهث للتوفير
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-3xl">😎</div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                    مرتاح ومخطط
                  </span>
                </div>
              )}
            </div>

            {/* Circle overlay showing savings percentage */}
            <div className="absolute -bottom-2 bg-forest-dark border border-forest-light px-3 py-1 rounded-full text-xs font-mono font-black text-gold-dawn">
              نسبة الادخار: {Math.round(savingsRate)}%
            </div>
          </div>

          {/* Quick Metrics display */}
          <div className="w-full grid grid-cols-2 gap-3 mt-6 border-t border-forest-light/20 pt-4">
            <div className="bg-forest-dark/30 p-2 rounded-xl border border-forest-light/10 text-right">
              <span className="text-[10px] text-white/50 block">مجموع المصاريف:</span>
              <span className="text-md font-bold text-white font-mono">{totalExpenses} د.ت</span>
            </div>
            <div className="bg-forest-dark/30 p-2 rounded-xl border border-forest-light/10 text-right">
              <span className="text-[10px] text-white/50 block">المتبقي الصافي:</span>
              <span className={`text-md font-bold font-mono ${remaining >= 0 ? "text-emerald-400" : "text-tunisia-red"}`}>
                {remaining} د.ت
              </span>
            </div>
          </div>
        </div>

        {/* Wealth Leak Warning Panel */}
        <div className="bg-forest-medium/50 border border-forest-light/40 rounded-3xl p-6 shadow-xl text-right flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold-dawn" />
            تقدير الهدر المالي على المدى المتوسط والبعيد:
          </h4>

          {activeLeaks.length === 0 ? (
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-4 text-center">
              <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />
                ممتاز! لقد قمت بسد كافة الثغرات المالية الشائعة في تونس.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-xs text-white/70">
                التسريبات المالية الحالية تحرمك من تكوين أصول استثمارية حقيقية. إليك كم تخسر فعلياً مع مرور الوقت:
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="bg-forest-dark/40 border border-forest-light/10 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-white/40 block">بعد سنة واحدة</span>
                  <span className="text-sm font-black text-tunisia-red font-mono">
                    -{(activeLeaks.length * 120 * 12).toLocaleString()} د.ت
                  </span>
                </div>
                <div className="bg-forest-dark/40 border border-forest-light/10 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-white/40 block">بعد 5 سنوات</span>
                  <span className="text-sm font-black text-tunisia-red font-mono">
                    -{(activeLeaks.length * 120 * 12 * 5).toLocaleString()} د.ت
                  </span>
                </div>
                <div className="bg-forest-dark/40 border border-forest-light/10 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-white/40 block">بعد 10 سنوات*</span>
                  <span className="text-sm font-black text-gold-dawn font-mono">
                    -{(activeLeaks.length * 120 * 12 * 10 * 1.4).toFixed(0).toLocaleString()} د.ت
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 italic">
                * باحتساب خسارة استثمار نفس المبالغ بعائد مركب بسيط 8% شهرياً في الـ SICAV.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
