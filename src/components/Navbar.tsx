import React, { useState } from 'react';
import { UserProfile } from '../types/food';
import { Heart, Sparkles, Shield, User, LogIn, Menu, X, Utensils } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentTab: 'home' | 'all' | 'favorites' | 'history' | 'admin';
  onSelectTab: (tab: 'home' | 'all' | 'favorites' | 'history' | 'admin') => void;
  currentUser: UserProfile | null;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onTriggerSpin: () => void;
  favoriteCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  onTriggerSpin,
  favoriteCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: 'home' | 'all' | 'favorites' | 'history' | 'admin'; label: string; badge?: number; adminOnly?: boolean }[] = [
    { id: 'home', label: 'หน้าแรก' },
    { id: 'all', label: 'เมนูทั้งหมด' },
    { id: 'favorites', label: 'เมนูโปรด', badge: favoriteCount },
    { id: 'history', label: 'ประวัติการสุ่ม' },
    { id: 'admin', label: 'จัดการหลังบ้าน (Admin)' },
  ];

  return (
    <>
      {/* Top Bar with Single-Row 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('home');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
              First Auto Food
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playPop();
                  onSelectTab(item.id);
                }}
                className={`transition-colors relative py-1 hover:text-orange-600 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  currentTab === item.id
                    ? 'text-orange-600 font-bold border-b-2 border-orange-500'
                    : 'text-stone-600'
                }`}
              >
                {item.id === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-500" />}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Spin Trigger */}
            <button
              onClick={() => {
                sounds.playPop();
                onTriggerSpin();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-sm shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>สุ่มอาหาร</span>
            </button>

            {/* User Profile or Login */}
            {currentUser ? (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenProfile();
                }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-stone-200 hover:border-orange-300 bg-stone-50 hover:bg-orange-50/50 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-300"
                />
                <span className="text-xs font-semibold text-stone-800 max-w-[100px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-bold">
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenAuth();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playPop();
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-medium ${
                  currentTab === item.id
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.id === 'admin' && <Shield className="w-4 h-4 text-amber-500" />}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
