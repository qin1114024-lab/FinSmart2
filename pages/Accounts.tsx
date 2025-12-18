
import React, { useState } from 'react';
// Fix: Added 'X' to the imports from lucide-react
import { Plus, Pencil, Trash2, Wallet, CreditCard, Landmark, Banknote, X } from 'lucide-react';
import { BankAccount } from '../types';

interface AccountsProps {
  accounts: BankAccount[];
  onAdd: (acc: BankAccount) => void;
  onUpdate: (acc: BankAccount) => void;
  onDelete: (id: string) => void;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, onAdd, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    name: '',
    type: 'Savings',
    balance: 0,
    currency: 'TWD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      onUpdate({ ...formData, id: editingId } as BankAccount);
    } else {
      onAdd({ ...formData, id: Date.now().toString() } as BankAccount);
    }
    
    setFormData({ name: '', type: 'Savings', balance: 0, currency: 'TWD' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (acc: BankAccount) => {
    setFormData(acc);
    setEditingId(acc.id);
    setShowForm(true);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Savings': return <Landmark size={24} />;
      case 'Credit Card': return <CreditCard size={24} />;
      case 'Cash': return <Banknote size={24} />;
      default: return <Wallet size={24} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">銀行帳戶</h2>
          <p className="text-slate-500">管理您的銀行存款與信用額度</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span className="font-semibold">新增帳戶</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                acc.type === 'Credit Card' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {getAccountIcon(acc.type)}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(acc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Pencil size={18} />
                </button>
                <button onClick={() => onDelete(acc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{acc.type}</p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{acc.name}</h3>
              <p className={`text-2xl font-black ${acc.balance < 0 ? 'text-red-500' : 'text-slate-900'}`}>
                ${acc.balance.toLocaleString()} <span className="text-xs font-normal text-slate-400">{acc.currency}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">{editingId ? '編輯帳戶' : '新增帳戶'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">帳戶名稱</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: 玉山銀行、現金"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">帳戶類型</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="Savings">儲蓄帳戶</option>
                  <option value="Checking">支票帳戶</option>
                  <option value="Credit Card">信用卡</option>
                  <option value="Cash">現金</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">初始金額</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.balance}
                  onChange={e => setFormData({ ...formData, balance: Number(e.target.value) })}
                />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                {editingId ? '儲存更新' : '確認新增'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
