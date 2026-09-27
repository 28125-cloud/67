import React, { useState } from 'react';
import { UserProfile } from '../types/food';
import { X, LogIn, UserPlus, Shield, User, Sparkles } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-amber-100">
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
        <div className="flex p-1 bg-stone-100 rounded-xl mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600'
            }`}
          >
            เข้าสู่ระบบ (Login)
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-orange-600 shadow-xs' : 'text-stone-600'
            }`}
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

        {mode === 'login' ? (
          <div>
            <div className="text-center mb-5">
              <h3 className="text-lg font-bold text-stone-900">ยินดีต้อนรับกลับมา</h3>
              <p className="text-xs text-stone-500 mt-1">
                เลือกบัญชีผู้ใช้ทดสอบ หรือเข้าสู่ระบบเพื่อบันทึกเมนูโปรดและประวัติ
              </p>
            </div>

            {/* Quick Demo Switchers */}
            <div className="space-y-2.5">
              {defaultUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    sounds.playPop();
                    onLogin(user);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/50 hover:bg-orange-50 hover:border-orange-300 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-300 shadow-xs"
                    />
                    <div>
                      <div className="text-sm font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                        {user.name}
                      </div>
                      <div className="text-xs text-stone-500">{user.email}</div>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      user.role === 'admin'
                        ? 'bg-amber-500 text-white'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">สร้างบัญชีสมาชิก</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                ร่วมเป็นสมาชิก First Auto Food เพื่อบันทึกเมนูโปรด
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                ชื่อสมาชิก / นามแฝง
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น น้องมุก สายกิน"
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">อีเมล</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="foodlover@example.com"
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
                  onClick={() => setRole('member')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    role === 'member'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Member (สมาชิก)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    role === 'admin'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
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
