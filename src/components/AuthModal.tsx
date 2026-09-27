import React, { useState } from 'react';
import { UserProfile } from '../types/food';
import { X, LogIn, UserPlus, Shield, User, Sparkles, KeyRound, Copy, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  defaultUsers: UserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  defaultUsers,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Custom form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'member' | 'admin'>('member');

  // Copied indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.playPop();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFillAndLogin = (user: UserProfile) => {
    sounds.playPop();
    onLogin(user);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const matchedUser = defaultUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!matchedUser) {
      setLoginError('ไม่พบบัญชีอีเมลนี้ในระบบ ตรวจสอบอีเมลหรือคลิกเลือกบัญชีด่วนด้านล่าง');
      return;
    }

    if (matchedUser.password && matchedUser.password !== loginPassword) {
      setLoginError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      return;
    }

    sounds.playPop();
    onLogin(matchedUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword || 'password123',
      role: regRole,
      profileImage: '/src/assets/images/chef_mascot_avatar_1790511468417.jpg',
      favorites: [],
      history: [],
      spinCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      preferredMeat: 'all',
      preferredVeg: 'all',
      status: 'active',
    };

    sounds.playPop();
    onRegister(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-amber-100 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Selection */}
        <div className="flex p-1 bg-stone-100 rounded-xl mb-5">
          <button
            onClick={() => {
              sounds.playPop();
              setMode('login');
              setLoginError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            เข้าสู่ระบบ (Login)
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setMode('register');
              setLoginError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

        {mode === 'login' ? (
          <div className="space-y-5">
            {/* Quick Demo Credentials Box */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 rounded-2xl p-4 border border-amber-200 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <KeyRound className="w-4 h-4 text-orange-600" />
                <span>บัญชีและรหัสผ่านสำหรับเข้าใช้งาน (คลิกเพื่อเข้าสู่ระบบทันที)</span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Member Account */}
                <div className="p-3 bg-white/95 rounded-xl border border-amber-200/80 shadow-2xs hover:border-orange-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">👤 บัญชีเมมเบอร์ (Member)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">ผู้ใช้ทั่วไป</span>
                    </div>
                    <div className="text-[11px] text-stone-600 font-mono">
                      อีเมล: <strong className="text-stone-800">first.student@foodapp.th</strong>
                    </div>
                    <div className="text-[11px] text-stone-600 font-mono">
                      รหัสผ่าน: <strong className="text-orange-600">password123</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials('first.student@foodapp.th / password123', 'member')}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-[11px] text-stone-600 flex items-center gap-1"
                      title="คัดลอกอีเมลและรหัสผ่าน"
                    >
                      {copiedId === 'member' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'member' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const m = defaultUsers.find((u) => u.role === 'member') || defaultUsers[0];
                        handleFillAndLogin(m);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs"
                    >
                      เข้าสู่ระบบนี้
                    </button>
                  </div>
                </div>

                {/* 2. Admin Account */}
                <div className="p-3 bg-white/95 rounded-xl border border-amber-300 shadow-2xs hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">🛡️ บัญชีแอดมิน (Admin)</span>
                      <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.2 rounded-full">แอดมินเต็มสิทธิ์</span>
                    </div>
                    <div className="text-[11px] text-stone-600 font-mono">
                      อีเมล: <strong className="text-stone-800">admin@firstautofood.th</strong>
                    </div>
                    <div className="text-[11px] text-stone-600 font-mono">
                      รหัสผ่าน: <strong className="text-amber-700">admin888food</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials('admin@firstautofood.th / admin888food', 'admin')}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-[11px] text-stone-600 flex items-center gap-1"
                      title="คัดลอกอีเมลและรหัสผ่าน"
                    >
                      {copiedId === 'admin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'admin' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const a = defaultUsers.find((u) => u.role === 'admin') || defaultUsers[1];
                        handleFillAndLogin(a);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs"
                    >
                      เข้าสู่ระบบนี้
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Manual Login Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-px bg-stone-200 flex-1" />
                <span className="text-[11px] font-semibold text-stone-400">หรือกรอกอีเมลและรหัสผ่าน</span>
                <div className="h-px bg-stone-200 flex-1" />
              </div>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">อีเมลผู้ใช้</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="เช่น admin@firstautofood.th หรือ first.student@foodapp.th"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน..."
                    className="w-full p-2.5 pr-10 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer mt-2"
              >
                เข้าสู่ระบบ (Sign In)
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">สร้างบัญชีสมาชิกใหม่</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                ร่วมเป็นสมาชิก First Auto Food เพื่อบันทึกเมนูโปรดและประวัติการสุ่ม
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                ชื่อสมาชิก / นามแฝง
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="เช่น น้องมุก สายกิน"
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">อีเมล</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="foodlover@example.com"
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">รหัสผ่าน</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="ตั้งรหัสผ่านสำหรับเข้าใช้งาน"
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                ระดับสิทธิ์ผู้ใช้
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('member')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    regRole === 'member'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Member (สมาชิก)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    regRole === 'admin'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin (ผู้ดูแลระบบ)</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer mt-2"
            >
              สมัครสมาชิกและเข้าสู่ระบบ
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
