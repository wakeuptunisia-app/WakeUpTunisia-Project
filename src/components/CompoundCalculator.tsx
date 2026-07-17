import React, { useState } from "react";
import { Sliders, TrendingUp, HelpCircle, ArrowRightLeft, DollarSign, Award, ChevronRight, Coins } from "lucide-react";
import { motion } from "motion/react";

export default function CompoundCalculator() {
  const [monthlyContribution, setMonthlyContribution] = useState<number>(150); // 150 TND (cost of shisha/cafes)
  const [interestRate, setInterestRate] = useState<number>(8); // 8% average SICAV/Treasury bond in Tunis
  const [years, setYears] = useState<number>(10);

  // Compute compound interest
  // Formula for annuity: PMT * [((1 + r/12)^(12*t) - 1) / (r/12)] * (1 + r/12)
  const computeFutureValue = (pmt: number, annualRate: number, t: number) => {
    const r = annualRate / 100 / 12;
    const n = 12 * t;
    if (r === 0) return pmt * n;
    return pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  };

  const totalContributed = monthlyContribution * 12 * years;
  const futureValue = computeFutureValue(monthlyContribution, interestRate, years);
  const interestEarned = futureValue - totalContributed;

  // Generate chart data for SVG display
  const chartIntervals = 5; // Divide the time into 5 slices
  const chartData = Array.from({ length: chartIntervals }, (_, index) => {
    const currentYear = Math.max(1, Math.round((years / (chartIntervals - 1)) * index));
    const contributed = monthlyContribution * 12 * currentYear;
    const total = computeFutureValue(monthlyContribution, interestRate, currentYear);
    const interest = total - contributed;
    return {
      year: currentYear,
      contributed,
      total,
      interest,
    };
  });

  const maxChartValue = Math.max(...chartData.map(d => d.total), 1);

  // Milestone check for Tunisian context
  const getMilestoneFeedback = (value: number) => {
    if (value < 5000) {
      return {
        title: "صندوق طوارئ أولي",
        desc: "يحميك من الاقتراض من الأصدقاء أو البنك في حالة مرض أو تصليح سيارة مفاجئ.",
        icon: "🛡️",
        progress: 30,
      };
    } else if (value < 20000) {
      return {
        title: "تمويل مشروع صغير أو خدمات حرّة",
        desc: "يكفي لشراء حاسوب متطور ومعدات لبدء عمل حر (Freelance) لفائدة شركات بالخارج.",
        icon: "💻",
        progress: 55,
      };
    } else if (value < 50000) {
      return {
        title: "كابيتال بعث مشروع محلي أو دفعة منزل",
        desc: "يمثل كابيتال لبعث مشروع تجاري أو خدماتي محلي أو دفع الدفعة الأولى الذكية لشراء عقار دون نسب فائدة مجحفة.",
        icon: "🔑",
        progress: 75,
      };
    } else if (value < 120000) {
      return {
        title: "مشروع استثماري نامي أو قطعة أرض",
        desc: "يمكنك من شراء قطعة أرض فلاحية خصبة في تونس أو تمويل شركة ناشئة توظف شباباً آخرين وتدر عليك عوائد مستمرة.",
        icon: "🚜",
        progress: 90,
      };
    } else {
      return {
        title: "الاستقلال المالي والحرية الكاملة",
        desc: "يمثل كابيتال يدر عليك أرباحاً شهرية تفوق الحد الأدنى للأجور في تونس، مما يجعلك تختار العمل متى وكيفما تشاء.",
        icon: "👑",
        progress: 100,
      };
    }
  };

  const milestone = getMilestoneFeedback(futureValue);

  return (
    <div className="bg-forest-medium/50 border border-forest-light/40 rounded-3xl p-6 lg:p-8 backdrop-blur-sm shadow-xl flex flex-col gap-8" id="compound-section">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-forest-light/30 pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold-dawn" />
          <h2 className="text-lg md:text-xl font-bold text-white">خطة تحويل التسربات المالية إلى ثروة مركبة</h2>
        </div>
        <span className="text-xs text-white/50 font-mono">قوة الفائدة المركبة</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Block */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-5">
            <span className="text-xs text-white/60 leading-relaxed font-medium block">
              جرب كيف يمكن لتحويل مبالغ صغيرة مسترجعة من "الثغرات الاستهلاكية" اليومية إلى حساب استثماري محلي أن يغير مستقبلك المالي تماماً.
            </span>

            {/* Shift Slider */}
            <div className="bg-forest-dark/40 border border-forest-light/20 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/90">المبلغ المسترجع والمستثمر شهرياً</span>
                <span className="text-sm font-black text-gold-dawn font-mono">{monthlyContribution} د.ت</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-gold-dawn focus:outline-none"
              />
              <span className="text-[10px] text-white/40 block mt-1">
                (مثال: 150 د.ت هي ثمن قهاوي وشيشة يومية أو تاكسيات مفرطة)
              </span>
            </div>

            {/* Interest Slider */}
            <div className="bg-forest-dark/40 border border-forest-light/20 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/90">نسبة العائد السنوي المتوقع</span>
                <span className="text-sm font-black text-emerald-accent font-mono">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-emerald-accent focus:outline-none"
              />
              <span className="text-[10px] text-white/40 block mt-1">
                (البنوك والـ SICAV في تونس تعطي حالياً بين 6.5% و 9%، الاستثمار في المشاريع قد يتجاوز 15%)
              </span>
            </div>

            {/* Time Slider */}
            <div className="bg-forest-dark/40 border border-forest-light/20 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/90">فترة الاستثمار والاستمرارية</span>
                <span className="text-sm font-black text-white font-mono">{years} سنوات</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1.5 bg-forest-dark rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
              />
              <span className="text-[10px] text-white/40 block mt-1">
                (الوقت هو وقود النمو المالي المركب - كلما بدأت أبكر كانت النتائج أضخم)
              </span>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-forest-dark/50 border border-forest-light/30 rounded-2xl p-4 flex flex-col gap-2 mt-4 text-right">
            <div className="flex justify-between text-xs border-b border-forest-light/20 pb-2">
              <span className="text-white/60">إجمالي ما قمت باقتطاعه واستثماره:</span>
              <span className="font-bold text-white font-mono">{totalContributed.toLocaleString()} د.ت</span>
            </div>
            <div className="flex justify-between text-xs border-b border-forest-light/20 pb-2">
              <span className="text-white/60">الأرباح المولّدة (الفائدة المركبة):</span>
              <span className="font-bold text-emerald-400 font-mono">+{Math.round(interestEarned).toLocaleString()} د.ت</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-bold text-gold-dawn">الثروة الإجمالية المتكونة:</span>
              <span className="text-lg font-black text-white font-mono">{Math.round(futureValue).toLocaleString()} د.ت</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Graphic & Milestone Map */}
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
          {/* Chart Display Container */}
          <div className="bg-forest-dark/50 border border-forest-light/25 rounded-2xl p-5 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-white">منحنى نمو ثروتك في تونس</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-white/50">
                  <span className="w-2.5 h-2.5 bg-forest-light rounded-sm"></span> رأس المال الأصلي
                </span>
                <span className="flex items-center gap-1 text-gold-dawn">
                  <span className="w-2.5 h-2.5 bg-gold-dawn rounded-sm"></span> الأرباح المركبة
                </span>
              </div>
            </div>

            {/* Custom Responsive SVG Chart Bar Layout */}
            <div className="flex items-end justify-between h-36 gap-3 pt-4 px-2">
              {chartData.map((d, index) => {
                const totalHeightPercent = (d.total / maxChartValue) * 100;
                const contribHeightPercent = (d.contributed / d.total) * 100;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                    {/* SVG stacked bar with tooltips */}
                    <div className="w-full relative flex flex-col justify-end h-28 rounded-lg overflow-hidden bg-forest-dark/80">
                      {/* Total height column */}
                      <div
                        className="w-full relative flex flex-col justify-end transition-all duration-500"
                        style={{ height: `${totalHeightPercent}%` }}
                      >
                        {/* Interest part (gold) */}
                        <div className="w-full bg-gradient-to-t from-gold-dawn to-gold-light hover:brightness-110 transition-all flex-1"></div>
                        {/* Contributed part (forest) */}
                        <div
                          className="w-full bg-forest-light/80 hover:bg-forest-light transition-all border-t border-forest-dark"
                          style={{ height: `${contribHeightPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* X-Axis labels */}
                    <div className="text-center">
                      <span className="text-[10px] text-white/60 font-bold block">سنة {d.year}</span>
                      <span className="text-[9px] text-gold-dawn font-mono block font-bold">
                        {Math.round(d.total / 1000)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Local Milestone Panel */}
          <div className="bg-forest-dark/40 border border-forest-light/20 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-forest-medium rounded-xl border border-forest-light/30 shadow-inner">
                {milestone.icon}
              </span>
              <div className="text-right">
                <span className="text-[10px] text-gold-dawn font-bold uppercase tracking-wider block">ما يمكنك تحقيقه بهذا المبلغ في تونس:</span>
                <h4 className="text-sm font-bold text-white">{milestone.title}</h4>
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-medium">
              {milestone.desc}
            </p>

            {/* Achievement progress */}
            <div className="w-full bg-forest-dark h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-gold-dawn to-gold-light h-full rounded-full transition-all duration-500"
                style={{ width: `${milestone.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
