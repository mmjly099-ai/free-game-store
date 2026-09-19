import React, { useState } from 'react';
import { Shield, Lock, User, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { AdminUser } from '../../types';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await api.adminLogin(username.trim(), password.trim());
      localStorage.setItem('admin_token', res.token);
      onSuccess(res.admin);
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول غير صحيحة، يرجى التحقق وإعادة المحاولة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div
        id="admin-login-modal"
        className="relative w-full max-w-md bg-[#111622] border border-slate-700/90 rounded-2xl shadow-2xl p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-600/20">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white">بوابة المشرفين - Admin Portal</h3>
          <p className="text-xs text-slate-400 mt-1">
            تسجيل الدخول للوحة إدارة الحسابات، الطلبات، والتحكم بالمتجر
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1.5 font-bold">اسم المستخدم:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1.5 font-bold">كلمة المرور:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[11px] text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>بيانات تجربة الإدارة المعتمدة:</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 transition-colors"
              >
                تعبئة تلقائية
              </button>
            </div>
            <div className="font-mono bg-black/40 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300 text-[11px]">
              <div>المستخدم: <span className="text-white font-bold">admin</span></div>
              <div className="text-slate-500">|</div>
              <div>كلمة السر: <span className="text-white font-bold">admin123</span></div>
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm shadow-xl shadow-red-600/20 transition-all cursor-pointer"
          >
            {loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}
          </button>
        </form>
      </div>
    </div>
  );
};
