
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, Receipt, PieChart, LogOut, PlusCircle, Menu, X, Sparkles
} from 'lucide-react';
// Fix: Import Auth functions from the correct modular package locations
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AppState, User, BankAccount, Transaction, Category, TransactionType } from './types';
import { DEFAULT_CATEGORIES, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from './constants';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    // Try to recover demo session from local storage if any
    const saved = localStorage.getItem('finsmart_demo_user');
    return {
      user: saved ? JSON.parse(saved) : null,
      accounts: MOCK_ACCOUNTS,
      transactions: MOCK_TRANSACTIONS,
      categories: DEFAULT_CATEGORIES
    };
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Firebase Auth Listener
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        };
        
        // Sync with Firestore
        if (db) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as Omit<AppState, 'user'>;
            setState({ user: userData, ...data });
          } else {
            const initialData = {
              accounts: MOCK_ACCOUNTS,
              transactions: MOCK_TRANSACTIONS,
              categories: DEFAULT_CATEGORIES
            };
            await setDoc(userDocRef, initialData);
            setState({ user: userData, ...initialData });
          }
        } else {
          setState(prev => ({ ...prev, user: userData }));
        }
      } else {
        // Only clear if we're not in a manual demo session
        if (!localStorage.getItem('finsmart_demo_user')) {
          setState(prev => ({ ...prev, user: null }));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Persistent Sync to Firestore (only for real users)
  useEffect(() => {
    if (state.user && db && !localStorage.getItem('finsmart_demo_user')) {
      const { user, ...dataToSave } = state;
      setDoc(doc(db, 'users', user.id), dataToSave, { merge: true });
    }
  }, [state.accounts, state.transactions, state.categories, state.user]);

  const logoutUser = async () => {
    if (auth) await signOut(auth);
    localStorage.removeItem('finsmart_demo_user');
    setState(prev => ({ ...prev, user: null }));
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo-user-123',
      email: 'tester@finsmart.com',
      name: '測試體驗員'
    };
    localStorage.setItem('finsmart_demo_user', JSON.stringify(demoUser));
    setState(prev => ({ ...prev, user: demoUser }));
  };

  const addAccount = (account: BankAccount) => {
    setState(prev => ({ ...prev, accounts: [...prev.accounts, account] }));
  };

  const updateAccount = (account: BankAccount) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(a => a.id === account.id ? account : a)
    }));
  };

  const deleteAccount = (id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a.id !== id),
      transactions: prev.transactions.filter(t => t.accountId !== id)
    }));
  };

  const addTransaction = (t: Transaction) => {
    setState(prev => {
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === t.accountId) {
          const change = t.type === TransactionType.INCOME ? t.amount : -t.amount;
          return { ...acc, balance: acc.balance + change };
        }
        return acc;
      });
      return {
        ...prev,
        transactions: [t, ...prev.transactions],
        accounts: updatedAccounts
      };
    });
  };

  const deleteTransaction = (id: string) => {
    const t = state.transactions.find(x => x.id === id);
    if (!t) return;

    setState(prev => {
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === t.accountId) {
          const change = t.type === TransactionType.INCOME ? -t.amount : t.amount;
          return { ...acc, balance: acc.balance + change };
        }
        return acc;
      });
      return {
        ...prev,
        transactions: prev.transactions.filter(x => x.id !== id),
        accounts: updatedAccounts
      };
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  if (!state.user) {
    return (
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login onDemoLogin={handleDemoLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-slate-50">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-6 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><LayoutDashboard size={24} /></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FinSmart</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={24} /></button>
          </div>

          <nav className="space-y-2">
            <SidebarItem to="/" icon={LayoutDashboard} label="總覽儀表板" />
            <SidebarItem to="/accounts" icon={Wallet} label="銀行帳戶" />
            <SidebarItem to="/transactions" icon={Receipt} label="財務紀錄" />
            <SidebarItem to="/reports" icon={PieChart} label="收支報表" />
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 truncate">{state.user.name}</p>
              <p className="text-xs text-slate-500 truncate">{state.user.email}</p>
              {localStorage.getItem('finsmart_demo_user') && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded mt-1 inline-block font-bold">體驗模式</span>
              )}
            </div>
            <button onClick={logoutUser} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={20} /><span className="font-medium">登出系統</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600"><Menu size={24} /></button>
            <div className="flex-1"></div>
            {localStorage.getItem('finsmart_demo_user') && (
              <div className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100 animate-pulse">
                目前為體驗帳號，資料將不會永久保存
              </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard state={state} />} />
              <Route path="/accounts" element={<Accounts accounts={state.accounts} onAdd={addAccount} onUpdate={updateAccount} onDelete={deleteAccount} />} />
              <Route path="/transactions" element={<Transactions transactions={state.transactions} categories={state.categories} accounts={state.accounts} onAdd={addTransaction} onDelete={deleteTransaction} />} />
              <Route path="/reports" element={<Reports state={state} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
