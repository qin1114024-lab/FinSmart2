
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  History
} from 'lucide-react';
import { AppState, TransactionType } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const [advice, setAdvice] = useState<string>('正在請 AI 顧問分析您的財務狀況...');
  const [loadingAdvice, setLoadingAdvice] = useState(true);

  const totalBalance = state.accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  const monthlyTransactions = state.transactions.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const income = monthlyTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = monthlyTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const res = await getFinancialAdvice(state.transactions, state.categories, state.accounts);
      setAdvice(res);
      setLoadingAdvice(false);
    };
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategoryName = (id: string) => state.categories.find(c => c.id === id)?.name || '未分類';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-blue-100 font-medium mb-1">總資產淨值</p>
            <h2 className="text-4xl font-bold mb-6">${totalBalance.toLocaleString()}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">
                <Wallet size={14} />
                <span>{state.accounts.length} 個帳戶</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Income/Expense */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">本月收入</span>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800">${income.toLocaleString()}</h3>
            <p className="text-emerald-500 text-sm font-medium mt-1">
              <ArrowUpRight size={14} className="inline mr-1" />
              較上月增長 12%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">本月支出</span>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800">${expense.toLocaleString()}</h3>
            <p className="text-rose-500 text-sm font-medium mt-1">
              <ArrowDownRight size={14} className="inline mr-1" />
              預算控制中
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <History className="text-slate-400" />
              最近活動
            </h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              查看全部 <ChevronRight size={16} />
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            {state.transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400">尚無交易紀錄</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {state.transactions.slice(0, 5).map(t => (
                  <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {t.type === TransactionType.INCOME ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{t.description}</p>
                        <p className="text-sm text-slate-500">{getCategoryName(t.categoryId)} • {new Date(t.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-amber-400" />
            AI 財務顧問
          </h3>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg h-full">
            {loadingAdvice ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                <p className="text-slate-400 text-sm animate-pulse">正在精算您的收支數據...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm">
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light">
                  {advice}
                </div>
              </div>
            )}
            {!loadingAdvice && (
              <button 
                onClick={async () => {
                  setLoadingAdvice(true);
                  const res = await getFinancialAdvice(state.transactions, state.categories, state.accounts);
                  setAdvice(res);
                  setLoadingAdvice(false);
                }}
                className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm border border-white/10"
              >
                重新產生建議
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
