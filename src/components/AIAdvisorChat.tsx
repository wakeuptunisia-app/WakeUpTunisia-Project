import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserProfile } from "../types";
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, AlertCircle, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIAdvisorChatProps {
  profile: UserProfile;
}

export default function AIAdvisorChat({ profile }: AIAdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "عسّلامة.. أهلاً بيك في **Wake Up Tunisia**! 🇹🇳\n\nأنا مرشدك المالي الشخصي. تظن أن العمل الشاق والهرولة اليومية دون وعي مالي هي طريقك للثراء؟ الواقع أعمق بكثير. \n\nلقد اطلعت على ميزانيتك وتشخيصك المالي الحالي. اسألني أي سؤال يخطر ببالك لتخطيط خروجك الفعلي من 'عجلة الهامستر' وبناء ثروتك بالدينار التونسي. مثلاً:\n- *كيفاش نبدا نستثمر في الـ SICAV في تونس بمبلغ صغير؟*\n- *كيفاش ننقذ شهريتي اللي توفى أول 10 أيام؟*\n- *شنوة البدائل للديون وقروض الاستهلاك في مشاريعي؟*",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Format chat history for backend (Express Gemini router)
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          chatHistory: formattedHistory,
          userInput: textToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل الخادم في الرد. يرجى التحقق من الاتصال.");
      }

      const data = await response.json();
      
      const modelMsgId = `model-${Date.now()}`;
      const newModelMsg: ChatMessage = {
        id: modelMsgId,
        role: "model",
        text: data.text || "لم يتم إرجاع أي نص من المرشد المالي.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, newModelMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ غير متوقع أثناء الاتصال بالمرشد.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPromptClick = (promptText: string) => {
    handleSend(promptText);
  };

  const quickPrompts = [
    "كيفاش نبدا نستثمر في الـ SICAV في تونس بمبلغ صغير؟",
    "كيفاش ننقذ شهريتي اللي توفى أول 10 أيام؟",
    "نحب نخرج من وظيفتي ونعمل فريلانس، باش تنصحني؟",
    "ماهي مخاطر قروض الاستهلاك البنكية في تونس وكيفاش نتجنبها؟",
  ];

  return (
    <div className="bg-forest-medium/50 border border-forest-light/40 rounded-3xl p-6 lg:p-8 backdrop-blur-sm shadow-xl flex flex-col h-[580px] justify-between" id="advisor-chat-section">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-forest-light/30 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold-dawn/15 flex items-center justify-center border border-gold-dawn/30 text-gold-dawn animate-pulse">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h2 className="text-md font-bold text-white flex items-center gap-1.5">
              مستشارك المالي الذكي (Wake Up Mentor)
              <span className="text-[10px] px-2 py-0.5 bg-emerald-accent/25 text-emerald-300 rounded-full border border-emerald-500/20 font-bold">ذكاء Gemini</span>
            </h2>
            <p className="text-[11px] text-white/50">جاهز لمساعدتك على فك شيفرة ميزانيتك الحالية بالدرجة التونسية</p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([messages[0]]);
            setError(null);
          }}
          className="text-xs text-white/40 hover:text-white transition-all flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10"
          title="مسح المحادثة وبدء حوار جديد"
        >
          <RefreshCw className="w-3 h-3" />
          مسح
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 flex flex-col gap-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 max-w-[85%] ${isModel ? "self-start" : "self-end flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isModel 
                    ? "bg-gold-dawn/15 border-gold-dawn/40 text-gold-dawn" 
                    : "bg-forest-light border-forest-light text-white"
                }`}>
                  {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1">
                  <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-medium shadow-md ${
                    isModel 
                      ? "bg-forest-dark/90 border border-forest-light/40 text-white" 
                      : "bg-gradient-to-tr from-gold-dawn to-gold-light text-forest-dark"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-white/30 font-mono ${isModel ? "text-left pl-1" : "text-right pr-1"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] self-start items-center">
            <div className="w-8 h-8 rounded-lg bg-gold-dawn/15 border border-gold-dawn/40 text-gold-dawn flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-forest-dark/90 border border-forest-light/40 px-4 py-3 rounded-2xl text-xs text-white/60 flex items-center gap-2">
              <span>المستشار يفحص ميزانيتك ويرتب لك نصائح تونسية ذهبية...</span>
            </div>
          </div>
        )}

        {/* Error Alert inside Chat */}
        {error && (
          <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-4 text-right flex gap-3 my-2 self-stretch">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-red-200">فشل الاتصال بالمرشد المالي الذكي</span>
              <p className="text-[11px] text-red-300/80 leading-relaxed">
                {error}
                {"\n"}
                إذا كان مفتاح Gemini مفقوداً، يرجى تفعيل وإضافة مفتاح API في واجهة **Settings &gt; Secrets** في AI Studio لتشغيل ميزة المحادثة الذكية.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input controls & Prompt templates */}
      <div className="shrink-0 flex flex-col gap-3">
        {/* Prompt Templates */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-col gap-1.5 border-t border-forest-light/20 pt-3">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-gold-dawn" /> أسئلة شائعة للتجربة الفورية:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(p)}
                  className="text-right text-[10px] md:text-xs px-3 py-1.5 rounded-lg bg-forest-dark/50 border border-forest-light/30 text-white/70 hover:bg-forest-light/40 hover:text-gold-dawn transition-all cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2 items-center bg-forest-dark/60 border border-forest-light/40 p-1.5 rounded-2xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="اسأل مرشدك المالي التونسي... (مثال: كيفاش نوفر 200د مالشيشة؟)"
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none focus:ring-0 px-3 py-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-dawn to-gold-light hover:brightness-110 flex items-center justify-center text-forest-dark transition-all shrink-0 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
