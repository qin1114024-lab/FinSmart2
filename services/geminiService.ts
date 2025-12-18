
import { GoogleGenAI } from "@google/genai";
import { Transaction, Category, BankAccount } from "../types";

export const getFinancialAdvice = async (
  transactions: Transaction[],
  categories: Category[],
  accounts: BankAccount[]
): Promise<string> => {
  // Use the API key exclusively and directly from the environment variable.
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
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // 使用高階邏輯分析模型
      contents: prompt,
    });
    // Directly use the .text property from GenerateContentResponse.
    return response.text || "目前無法生成建議，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 顧問正在離線研習中，暫時無法提供建議。";
  }
};
