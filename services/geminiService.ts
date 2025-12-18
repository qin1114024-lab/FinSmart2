
import { GoogleGenAI } from "@google/genai";
import { Transaction, Category, BankAccount } from "../types";

/**
 * Analyzes financial transactions using Gemini 3 Pro and provides expert advice.
 * Adheres to Google GenAI SDK guidelines for initialization and content generation.
 */
export const getFinancialAdvice = async (
  transactions: Transaction[],
  categories: Category[],
  accounts: BankAccount[]
): Promise<string> => {
  // Always use the required initialization format.
  // The API key is obtained directly from process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.slice(-20).map(t => {
    const cat = categories.find(c => c.id === t.categoryId)?.name;
    return `${t.date.split('T')[0]}: ${cat} - ${t.type === 'INCOME' ? '收入' : '支出'} ${t.amount}`;
  }).join('\n');

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const prompt = `
    您是一位專業且極具洞察力的資深理財顧問。請分析以下最近 20 筆交易紀錄並提供 3-4 點深刻、具體且可執行的財務建議。
    請務必使用「繁體中文 (台灣)」撰寫。
    
    當前總資產淨值：${totalBalance} TWD
    近期交易清單：
    ${summary}
    
    請針對以下維度分析：
    1. 消費模式的潛在風險或異常支出。
    2. 針對當前資產現況的儲蓄或投資優化方向。
    3. 給予使用者情感上的支持與明確的下一週理財行動。
  `;

  try {
    // For complex reasoning tasks like financial advising, use 'gemini-3-pro-preview'.
    // Use the .text property to extract the generated string from the response.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    
    return response.text || "目前無法生成建議，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 顧問目前服務忙碌中，請稍後再試。";
  }
};
