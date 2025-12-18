
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LayoutDashboard, ArrowRight, AlertCircle, Play } from 'lucide-react';
// Fix: Import named auth functions correctly from the modular SDK package
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginProps {
  onDemoLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onDemoLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase 未正確配置，請改用體驗模式登入。");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError("登入失敗：帳號或密碼錯誤");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex flex-1 bg-blue-600 items-center justify-center p-12 text-white">
        <div className="max-w-md space-y-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center"><LayoutDashboard size={40} /></div>
          <h1 className="text-5xl font-black mb-4">掌握您的每一分錢。</h1>
          <p className="text-xl text-blue-100 font-light leading-relaxed">
            透過 AI 智能分析與 Firebase 即時同步，建立最適合您的個人理財習慣。
          </p>
          <div className="flex gap-4 pt-4">
            <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-medium backdrop-blur-md">🔐 安全加密</div>
            <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-medium backdrop-blur-md">🤖 AI 建議</div>
            <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-medium backdrop-blur-md">📊 視覺報表</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">歡迎回來</h2>
            <p className="text-slate-500">請登入您的 FinSmart 帳戶</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {!auth && (
            <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs leading-relaxed">
              <strong>提示：</strong> 偵測到 Firebase 環境變數尚未設定。您可以直接使用下方的「體驗模式」進入系統。
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">密碼</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                type="submit" 
                disabled={loading || !auth} 
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? '登入中...' : '登入系統'} <ArrowRight size={20} />
              </button>

              <button 
                type="button"
                onClick={onDemoLogin}
                className="w-full py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-200 flex items-center justify-center gap-2 transition-all"
              >
                <Play size={18} className="fill-slate-700" /> 體驗模式
              </button>
            </div>
          </form>

          <p className="text-center text-slate-500 text-sm">
            還沒有帳號嗎？ <Link to="/register" className="text-blue-600 font-bold hover:underline">立即註冊</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
