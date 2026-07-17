/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Expenses {
  rent: number;        // الكراء والسكن
  utilities: number;   // الماء، الضوء، الغاز، الإنترنت (ستاغ، سوناد، تيليكوم)
  food: number;        // الماكلة وقضية الدار
  transport: number;   // النقل (لوواج، تاكسي، كار، بنزين الكرهبة)
  leisure: number;     // قهاوي، سهرات، رفاهية، تحويص
  others: number;      // قروض استهلاك، هدايا، مصاريف طارئة
}

export type FinancialPersonality = 
  | 'hamster'        // الهامستر الراكض (عمل شاق مستمر بدون ادخار)
  | 'dreamer'        // الحالم السلبي (ينتظر فرصة سريعة دون تخطيط واقعي)
  | 'silent_leaker'  // المتسرب الصامت (دخل جيد لكن يتبخر في التفاصيل البسيطة)
  | 'secure_saver'   // المدخر الحذر (يدخر في البريد لكن دون استثمار لمواجهة التضخم)
  | 'free_planner';  // المخطط الحر (بدأ رحلة الاستقلال المالي والوعي)

export interface UserProfile {
  income: number;
  expenses: Expenses;
  personality: FinancialPersonality;
  leaks: string[];
  goal: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SimulationState {
  monthlyIncome: number;
  savingsRate: number; // Percentage
  monthlySavings: number;
  investmentYield: number; // e.g. 7% for SICAV, 10% for custom project
  years: number;
}
