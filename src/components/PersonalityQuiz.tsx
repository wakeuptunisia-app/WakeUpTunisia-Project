import React, { useState } from "react";
import { FinancialPersonality } from "../types";
import { HelpCircle, ArrowRight, ArrowLeft, Award, RefreshCw, AlertCircle, Compass, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PersonalityQuizProps {
  onQuizComplete: (personality: FinancialPersonality) => void;
  currentPersonality: FinancialPersonality;
}

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    type: FinancialPersonality;
    explanation: string;
  }[];
}

export default function PersonalityQuiz({ onQuizComplete, currentPersonality }: PersonalityQuizProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<FinancialPersonality[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "كيفاش تتصرف مع شهريتك أول ما تصبّ في حسابك البنكي أو البريدي؟",
      options: [
        {
          text: "نخلص الكراء والضو والماء، واللي يقعد نصرفو الكل في الخرجات والتحويص لين يوفى تماماً.",
          type: "hamster",
          explanation: "العمل الشاق لتغطية المصاريف فقط دون ادخار يجعلك سجين العجلة."
        },
        {
          text: "نخبي 'تفتوفة' في البوسطة أو دفتر ادخار مباشرة، والباقي نعدي بيه شهري.",
          type: "secure_saver",
          explanation: "الادخار ممتاز ولكن ركود الأموال دون استثمار يفقدها قيمتها بسبب التضخم."
        },
        {
          text: "نقسمها بميزانية واضحة (مثلاً 50% أساسيات، 30% كماليات، 20% للاستثمار والأصول فوراً).",
          type: "free_planner",
          explanation: "عقلية المستثمر المحترف الذي يدفع لنفسه أولاً ويبني أصولاً حقيقية."
        },
        {
          text: "تصب من هوني، تتبخر في الفواتير وقروض الاستهلاك والكريديت والكماليات من هوني.",
          type: "silent_leaker",
          explanation: "الأموال تتسرب في مصاريف خفية وصغيرة دون وعي منك بحجم الهدر."
        }
      ]
    },
    {
      id: 2,
      text: "عرس قريب، مناسبة عائلية، أو عطلة الصيف تقرب، كيفاش تحضرلها ميزانيتها؟",
      options: [
        {
          text: "نعمل قرض استهلاك بنكي سريع أو قرض سيارة لشراء كماليات، ونقعد نخلص بالتقسيط لفترة طويلة.",
          type: "silent_leaker",
          explanation: "قروض الاستهلاك الاستهلاكية هي العدو الأول للحرية المالية في تونس."
        },
        {
          text: "ما نحضرش مسبقاً، ربي يسهل تو نسلكوها في وقتها بالسلف أو 'الرّوج'.",
          type: "dreamer",
          explanation: "العيش دون تخطيط يضعك تحت رحمة الضغوطات المالية المفاجئة."
        },
        {
          text: "عندي حساب أو صندوق ادخار مخصص نغديه شهرياً طيلة العام لمثل هذه المناسبات دون المساس باستثماراتي.",
          type: "free_planner",
          explanation: "التخطيط المسبق يقي من مفاجآت الديون ويحمي استقرارك المالي."
        },
        {
          text: "نجبد مباشرة من مدخراتي الأساسية اللي لميتها بالسيف، ونرجع لـ 'الصفر' مبعد المناسبة.",
          type: "secure_saver",
          explanation: "استهلاك المدخرات للطوارئ والكماليات يهدد أمانك المالي المستقبلي."
        }
      ]
    },
    {
      id: 3,
      text: "فكرة الاستثمار المالي والأصول في تونس بالنسبة ليك هي...",
      options: [
        {
          text: "الاستثمار حكاية فارغة والتضخم باش ياكل كل شيء، عيش نهارك واصرف ما في الجيب يأتك ما في الغيب!",
          type: "dreamer",
          explanation: "عقلية الهروب والعيش اللحظي تحرمك من إمكانية تغيير وضعك المالي."
        },
        {
          text: "حاجة نخاف منها برشة ونراها مخاطرة، نخلي فلوسي تحت المخدة أو في حساب بوستة أضمن بكثير.",
          type: "secure_saver",
          explanation: "الخوف المفرط يقيدك ويمنع أموالك من النمو ومواجهة الغلاء المعيشي."
        },
        {
          text: "ضرورة ملحة لبناء الثروة (عبر الـ SICAV، رقاع الخزينة BTA، البورصة، أو مشروع خدماتي حر).",
          type: "free_planner",
          explanation: "أنت تفهم أهمية جعل المال يعمل من أجلك وليس العكس."
        },
        {
          text: "نتمنى نعمل مشروع أو نستثمر، لكن ضيق الوقت بين الخدمة والالتزامات يمنعني من التفكير والتخطيط.",
          type: "hamster",
          explanation: "الغرق في تفاصيل العمل اليومي يحجب عنك الرؤية الاستراتيجية الأوسع."
        }
      ]
    },
    {
      id: 4,
      text: "القهاوي اليومية، الشيشة، التحويص التونسي، والأكلات الجاهزة لبرا...",
      options: [
        {
          text: "متعة الحياة الوحيدة في تونس، نخرج ونسهر ومانحسبش حتى لو كلفني هذا جيب فارغ آخر الشهر.",
          type: "silent_leaker",
          explanation: "هذه تسمى مصاريف المتعة العابرة التي تدمر فرصك لبناء أصول دائمة."
        },
        {
          text: "نعملهم بالطبع وبشكل دوري، لكن ضمن ميزانية رفاهية محددة لا تزيد عن 10% من دخلي.",
          type: "free_planner",
          explanation: "الاستمتاع بالحياة بوعي مالي دون تدمير الميزانية الأساسية."
        },
        {
          text: "أصرف عليهم برشة بدافع العادة، وإذا نحسبهم في لخر نكتشف أنها مبالغ هائلة وضائعة.",
          type: "hamster",
          explanation: "تسرب مالي صامت يلتهم مئات الدنانير شهرياً دون قيمة حقيقية مضافة."
        },
        {
          text: "أتجنبهم قدر المستطاع، وأحاول حرمان نفسي من أغلب الملذات لجمع أكبر قدر من المال للادخار الأعمى.",
          type: "secure_saver",
          explanation: "الحرمان المفرط دون أهداف استثمارية واضحة يؤدي للإحباط في النهاية."
        }
      ]
    },
    {
      id: 5,
      text: "لو تجيك زيادة في الدخل أو منحة غير متوقعة بقيمة 500 دينار تونسي، شنوة تعمل بيها؟",
      options: [
        {
          text: "نشري بيها تليفون جديد أو نخلص دفعة أولى لحاجة جديدة بالتقسيط.",
          type: "hamster",
          explanation: "عقلية الارتفاع الفوري للاستهلاك مع ارتفاع الدخل (تضخم أسلوب المعيشة)."
        },
        {
          text: "نوجّه جزء كبير منها مباشرة لصندوق الاستثمار (SICAV أو مشروع خدماتي مصدّر) لتعجيل حريتي.",
          type: "free_planner",
          explanation: "استثمار الزيادة هو أسرع طريق لمضاعفة الدخل وبناء الاستقلال الحقيقي."
        },
        {
          text: "نصبها في حساب الادخار متاعي وننساها هناك لزيادة الأمان المادي.",
          type: "secure_saver",
          explanation: "ادخار جيد لكنه بحاجة إلى توجيه ذكي نحو قنوات استثمارية نامية."
        },
        {
          text: "نبرمج بيها سهرية باهية أو سفرة قصيرة للحمامات باش نفرهد على روحي.",
          type: "silent_leaker",
          explanation: "توجيه سريع لأي دخل إضافي نحو الاستهلاك الفوري يجعلك تراوح مكانك."
        }
      ]
    }
  ];

  const handleOptionSelect = (type: FinancialPersonality) => {
    const updatedAnswers = [...answers, type];
    setAnswers(updatedAnswers);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate majority personality
      const frequencyMap = updatedAnswers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {} as Record<FinancialPersonality, number>);

      let majorityPersonality: FinancialPersonality = "hamster";
      let maxCount = 0;

      (Object.keys(frequencyMap) as FinancialPersonality[]).forEach((key) => {
        if (frequencyMap[key]! > maxCount) {
          maxCount = frequencyMap[key]!;
          majorityPersonality = key;
        }
      });

      // Special check: if there is a tie, prioritize 'free_planner' then 'hamster'
      setIsCompleted(true);
      onQuizComplete(majorityPersonality);
    }
  };

  const handleReset = () => {
    setAnswers([]);
    setCurrentQuestionIdx(0);
    setIsCompleted(false);
  };

  const personalityDetails = {
    hamster: {
      title: "الهامستر الراكض (Hamster Wheel Sufferer)",
      icon: <RefreshCw className="w-12 h-12 text-amber-500" />,
      description: "تخدم برشة، وتعبان برشة، لكن العجلة تدور بيك في نفس البلاصة. شهريتك تتصب وتوفى في دفع الفواتير والكراء دون بناء أي أصول مادية تعود عليك بالنفع.",
      quote: "الأمر ليس عن مجهود بدني إضافي، بل عن طريقة تفكير جديدة.",
      color: "border-amber-500/40 bg-amber-950/20 text-amber-200",
      tips: [
        "توقف عن العمل الإضافي الأعمى وابدأ في تخصيص 2-3 ساعات أسبوعياً لدراسة مهارة جديدة قابلة للتصدير (Freelance).",
        "احسب كلفة ساعة عملك وقارنها بمصاريفك اليومية لتعرف أين يذهب جهدك.",
        "ابدأ بقطع 5% فقط من دخلك مباشرة قبل أي مصروف كخطوة أولى لكسر قيد العجلة."
      ]
    },
    silent_leaker: {
      title: "المتسرب الصامت (Silent Money Leaker)",
      icon: <ShieldAlert className="w-12 h-12 text-red-500" />,
      description: "دخلك الشهري قد يكون محترماً جداً، لكن أموالك تتبخر كالماء في رمال الصحراء. القهاوي اليومية المكررة، قروض الاستهلاك التافهة، والكماليات التي تشتريها بالتقسيط تلتهم مستقبلك المالي.",
      quote: "المشاكل المالية ليست عدوك، إنها خريطة تدلك على ثغراتك الذهنية.",
      color: "border-red-500/40 bg-red-950/20 text-red-200",
      tips: [
        "الغي فوراً جميع الاشتراكات الرقمية والصالات التي لا تستخدمها، وتجنب قروض الاستهلاك البنكية مهما كانت مغرية.",
        "استبدل 'قهوة بـ 5 آلاف' و'التاكسيات الخاصة' ببدائل ذكية واجمع الفارق في حساب استثماري.",
        "طبق قاعدة 24 ساعة قبل شراء أي كماليات لتجنب الشراء الاندفاعي العاطفي."
      ]
    },
    secure_saver: {
      title: "المدخر الحذر (Conservative Saver)",
      icon: <Compass className="w-12 h-12 text-blue-400" />,
      description: "أنت حذر جداً ومسؤول، تحب الادخار وتخاف من المغامرة. فلوسك في البوسطة أو تحت المخدة آمنة ظاهرياً، لكن التضخم وغلاء الأسعار في تونس يأكلان قيمتها الشرائية صامتين.",
      quote: "يحتاج الوعي المالي إلى بصيرة، لا مجرد جري خلف سراب الدخل السريع أو الأمان الوهمي.",
      color: "border-blue-500/40 bg-blue-950/20 text-blue-200",
      tips: [
        "افتح حساب استثمار في الـ SICAV التابعة للبنك أو للبريد التونسي لتعود عليك بأرباح مركبة آمنة نسبياً وتفوق التضخم.",
        "خصص جزءاً صغيراً جداً (مثلاً 10%) من مدخراتك للاستثمار في أصول نامية كالذهب أو الأسهم الكبرى المدرجة في بورصة تونس.",
        "تعلم أن التضخم هو الضريبة الخفية للأموال الراكدة."
      ]
    },
    dreamer: {
      title: "الحالم السلبي (Passive Financial Dreamer)",
      icon: <AlertCircle className="w-12 h-12 text-purple-400" />,
      description: "تنتظر دائماً ضربة حظ، زيادة مفاجئة من الدولة، أو هجرة سريعة لتتغير حياتك المادية. عيشك دون تخطيط يومي يحرمك من بناء فرص حقيقية بيدك.",
      quote: "ارسم طريقك بيدك، ولا تنتظر الظروف أن تفتح لك أبواباً لم تصنعها أنت.",
      color: "border-purple-500/40 bg-purple-950/20 text-purple-200",
      tips: [
        "انزل لواقع الأرقام فوراً واكتب كل مليم تصرفه في كراس أو تطبيق بسيط.",
        "الحظ يصنعه التخطيط والفرصة تلتقي مع المستعد؛ جهز نفسك بتعلم الوعي المالي المنهجي.",
        "ابدأ بمشروع صغير جداً عبر الإنترنت لا يتطلب رأس مال، بل يتطلب الالتزام والوقت فقط."
      ]
    },
    free_planner: {
      title: "المخطط المالي الحر (Strategic Sovereign)",
      icon: <Award className="w-12 h-12 text-emerald-400" />,
      description: "أنت تقود اللعبة المالية بكل بساطة وبصيرة! تفهم أهمية التخطيط، تسيطر على مصاريفك بحكمة، وتستثمر بانتظام لبناء حريتك واستقلالك المالي بعيداً عن ضغوط العمل الأعمى.",
      quote: "لأساعدك أن تكون أنت من يقود اللعبة.. وها قد بدأت بالفعل!",
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-200",
      tips: [
        "واصل هذا المسار العبقري وانتقل الآن لتنويع أصولك واستثماراتك محلياً ودولياً إن أمكن.",
        "علم من حولك وأصدقائك في تونس هذه المفاهيم لمساعدتهم على الخروج من العجلة أيضاً.",
        "ركز على بناء مشاريع تدر دخلاً سلبياً مستمراً لتقليل اعتمادك على الوظيفة كلياً."
      ]
    }
  };

  const currentDetails = personalityDetails[isCompleted ? currentPersonality : "hamster"];

  return (
    <div className="bg-forest-medium/50 border border-forest-light/40 rounded-3xl p-6 lg:p-8 backdrop-blur-sm shadow-xl" id="diagnostic-section">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Header / Progress */}
            <div className="flex items-center justify-between border-b border-forest-light/30 pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gold-dawn" />
                <h2 className="text-lg md:text-xl font-bold text-white">تشخيص الثغرات المادية والذهنية في تونس</h2>
              </div>
              <span className="text-xs text-white/50 font-mono">
                السؤال {currentQuestionIdx + 1} من {questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-forest-dark h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gold-dawn h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <div className="my-2">
              <p className="text-md md:text-lg font-bold text-white leading-relaxed">
                {questions[currentQuestionIdx].text}
              </p>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {questions[currentQuestionIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.type)}
                  className="text-right text-sm px-5 py-4 rounded-2xl bg-forest-dark/40 border border-forest-light/25 text-white/90 hover:bg-forest-light/30 hover:border-gold-dawn/40 hover:text-white transition-all duration-300 flex flex-col gap-1 cursor-pointer"
                >
                  <span className="font-medium">{opt.text}</span>
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="text-[11px] text-white/40 italic flex items-center gap-1.5 mt-2 bg-forest-dark/20 p-2.5 rounded-xl border border-forest-light/10">
              <AlertCircle className="w-3.5 h-3.5 text-gold-dawn/60 shrink-0" />
              <span>هذا التشخيص مبني على الواقع الثقافي والاقتصادي التونسي لمساعدتك على رصد سلوكك المالي اليومي بدقة.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-forest-light/30 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-dawn animate-bounce" />
                <h2 className="text-lg md:text-xl font-bold text-white">نتيجة تشخيصك وعقليتك المالية الحالية</h2>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gold-dawn hover:text-gold-light font-bold flex items-center gap-1 bg-gold-dawn/10 px-3 py-1.5 rounded-xl border border-gold-dawn/25 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                إعادة الاختبار
              </button>
            </div>

            {/* Main Result Card */}
            <div className={`border rounded-3xl p-6 md:p-8 text-right flex flex-col md:flex-row items-center md:items-start gap-6 transition-all duration-300 ${currentDetails.color}`}>
              <div className="p-4 bg-forest-dark/80 rounded-2xl border border-forest-light/30 shadow-inner shrink-0">
                {currentDetails.icon}
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-extrabold text-white">{currentDetails.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{currentDetails.description}</p>
                <div className="mt-3 bg-white/5 border border-white/10 p-3.5 rounded-xl italic text-xs text-gold-light font-medium">
                  "{currentDetails.quote}"
                </div>
              </div>
            </div>

            {/* Custom Advice / Roadmap list */}
            <div className="flex flex-col gap-4 mt-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-accent" />
                خارطة الطريق العملية الخاصة بك للخروج من المتاهة:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentDetails.tips.map((tip, idx) => (
                  <div key={idx} className="bg-forest-dark/40 border border-forest-light/20 p-4 rounded-2xl flex flex-col gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold-dawn/15 text-gold-dawn flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-medium">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Anchor button to AI Chat */}
            <div className="bg-forest-dark/60 border border-forest-light/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
              <div className="text-right">
                <span className="text-[10px] text-gold-dawn font-bold uppercase tracking-wide">المرشد المالي الذكي بانتظارك</span>
                <p className="text-xs text-white/70">تحدث مع مرشدك المالي التونسي للحصول على خطة مخصصة لواقعك ومدخولك.</p>
              </div>
              <a
                href="#advisor-chat-section"
                className="w-full md:w-auto text-center text-xs font-bold text-forest-dark bg-gradient-to-r from-gold-dawn to-gold-light px-5 py-2.5 rounded-xl shadow-lg hover:shadow-gold-dawn/20 transition-all font-sans"
              >
                ابدأ المحادثة مع المستشار المالي 🐹
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
