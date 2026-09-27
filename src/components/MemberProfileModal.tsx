import React, { useState } from 'react';
import { UserProfile, VegFilter, MeatFilter } from '../types/food';
import { X, User, Heart, RotateCcw, Shield, LogOut, Check, Sliders, Calendar } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onSwitchUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onLogout,
  onSwitchUser,
  allUsers,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [preferredMeat, setPreferredMeat] = useState<MeatFilter>(currentUser.preferredMeat || 'all');
  const [preferredVeg, setPreferredVeg] = useState<VegFilter>(currentUser.preferredVeg || 'all');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      preferredMeat,
      preferredVeg,
    });
    sounds.playPop();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-amber-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-stone-100 text-center sm:text-left">
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-stone-900">{currentUser.name}</h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500 text-white'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-stone-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3 h-3" />
              <span>เป็นสมาชิกตั้งแต่ {currentUser.joinedDate}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100 text-center">
            <div className="text-xl font-bold text-stone-900">{currentUser.spinCount}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">จำนวนครั้งที่สุ่ม</div>
          </div>
          <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 text-center">
            <div className="text-xl font-bold text-rose-600">{currentUser.favorites.length}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">เมนูโปรด</div>
          </div>
          <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100 text-center">
            <div className="text-xl font-bold text-orange-600">{currentUser.history.length}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">ประวัติการสุ่ม</div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              ชื่อแสดงบนเว็บไซต์
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                เนื้อสัตว์ที่ชอบเป็นพิเศษ
              </label>
              <select
                value={preferredMeat}
                onChange={(e) => setPreferredMeat(e.target.value as MeatFilter)}
                className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-white"
              >
                <option value="all">ไม่จำกัด</option>
                <option value="pork">ชอบเนื้อหมู</option>
                <option value="chicken">ชอบเนื้อไก่</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                พฤติกรรมการกินผัก
              </label>
              <select
                value={preferredVeg}
                onChange={(e) => setPreferredVeg(e.target.value as VegFilter)}
                className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-white"
              >
                <option value="all">ไม่จำกัด</option>
                <option value="veg">ชอบกินผัก</option>
                <option value="noveg">ไม่ชอบกินผัก</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'บันทึกเรียบร้อย!' : 'บันทึกข้อมูลส่วนตัว'}</span>
            </button>
          </div>
        </form>

        {/* Switch User section */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-600 mb-2">สลับบัญชีทดสอบในคลิกเดียว</p>
          <div className="flex gap-2 flex-wrap">
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  sounds.playPop();
                  onSwitchUser(u);
                  setName(u.name);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  u.id === currentUser.id
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-700'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600'
                }`}
              >
                <span>{u.name}</span>
                <span className="text-[10px] opacity-75">({u.role})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={() => {
              sounds.playPop();
              onLogout();
              onClose();
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
