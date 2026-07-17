import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for financial advisor
app.post("/api/advisor", async (req, res) => {
  try {
    const { profile, chatHistory, userInput } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "مفتاح API الخاص بـ Gemini غير مهيأ. يرجى إضافته في الإعدادات." 
      });
    }

    const { income, expenses, personality, leaks, goal } = profile || {};

    const systemInstruction = `أنت "المرشد المالي لـ Wake Up Tunisia" (Wake Up Tunisia Financial Mentor). 
مهمتك هي مساعدة الشباب والمهنيين في تونس على الخروج من "متاهة الركض اليومي" (عجلة الهامستر المالية) وبناء وعي مالي حقيقي مبني على التخطيط والاستثمار، وليس فقط العمل الشاق الأعمى.

أنت تتحدث باللهجة التونسية المهذبة (الدرجة التونسية الممزوجة بالعربية الفصحى لسهولة الفهم)، وتتحلى بالحكمة، والجدية، والتحفيز الصادق. أنت تواجه المستخدم بالحقائق الصعبة بطريقة بناءة: "الخدمة برشة من غير وعي مالي هي حفر بئر بإبرة".

استخدم المصطلحات التونسية المألوفة محلياً مثل:
- العملة الوطنية: الدينار التونسي (TND) أو "ملاين" و"آلاف".
- المصاريف التونسية: القهاوي اليومية، النقل، الكراء، الفواتير (ستاغ وسوناد STEG/SONEDE)، قروض الاستهلاك، مصاريف الصيف (الحمامات، سوسة)، عرس، أعياد.
- الأدوات المالية المتاحة في تونس: دفتر ادخار البريد (دفتر بوستة)، الـ SICAV (صناديق الاستثمار المشترك بنسب أرباح 6-8%)، رقاع الخزينة (BTA)، البورصة التونسية (BVMT)، بعث المشاريع الخاصة (المقاول الذاتي، الشركات الناشئة)، العمل الحر (Freelance) لإدخال العملة الصعبة عبر التصدير الخدماتي.

بيانات المستخدم الحالية:
- الدخل الشهري: ${income || "غير محدد"} دينار تونسي.
- المصاريف الشهرية المفصلة: 
  * الكراء والسكن: ${expenses?.rent || 0} د.ت
  * فواتير ومصارف أساسية: ${expenses?.utilities || 0} د.ت
  * الأكل والتسوق: ${expenses?.food || 0} د.ت
  * النقل والتنقل: ${expenses?.transport || 0} د.ت
  * الرفاهية والقهاوي: ${expenses?.leisure || 0} د.ت
  * مصاريف أخرى وقروض: ${expenses?.others || 0} د.ت
- النمط المالي (الشخصية المالية): ${personality || "غير محدد"}
- التسربات المالية المرصودة: ${leaks?.join("، ") || "لا توجد"}
- الهدف المالي المراد تحقيقه: ${goal || "غير محدد"}

إرشادات هامة في إجاباتك:
1. كن واقعياً جداً وقدم حلولاً قابلة للتطبيق الفعلي في الواقع التونسي الحالي.
2. لا تقترح حلولاً عامة غربية لا تصلح لتونس (مثل الاستثمار في Robinhood أو تطبيقات أمريكية غير متاحة). ركز على الحلول المحلية (SICAV، الادخار الذكي، الاستثمار في المشاريع الصغيرة المحلية، التقليل من قروض الاستهلاك البنكية التي تلتهم الدخل بفوائد عالية TMM+).
3. ركز على "تغيير العقلية" (Mindset shift)؛ الانتقال من عقلية الأجير الذي ينتظر الترقية إلى عقلية المستثمر أو صانع الأصول.
4. حافظ على إجابات مشجعة ولكن صارمة فيما يخص الديون غير المجدية (قروض الاستهلاك لشراء سيارة فارهة أو السفر).
5. نسّق إجابتك باستخدام نقاط واضحة وعناوين قصيرة ومريحة للقراءة.`;

    // Construct the contents parameter
    const contents = [];

    // Add chat history if present
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user input
    contents.push({
      role: "user",
      parts: [{ text: userInput || "أهلاً بك، اعطني تقييماً مالياً شاملاً لحالتي بناءً على بياناتي الحالية ونصائح عملية للخروج من عجلة العمل الشاق دون وعي." }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال بالمرشد المالي." });
  }
});

// Vite middleware and static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Wake Up Tunisia] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
