import React, { useState, useEffect, useMemo } from 'react';
import { FoodItem, FilterState, UserProfile, SpunHistoryItem } from './types/food';
import { INITIAL_FOODS, DEFAULT_USERS } from './data/foods';
import { Navbar } from './components/Navbar';
import { FilterSection } from './components/FilterSection';
import { FoodCard } from './components/FoodCard';
import { FoodDetailModal } from './components/FoodDetailModal';
import { RouletteModal } from './components/RouletteModal';
import { AuthModal } from './components/AuthModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastContainer, ToastMessage } from './components/Toast';
import { sounds } from './utils/audio';
import { Sparkles, Utensils, Heart, History, Flame, Clock, ChefHat, ArrowRight, ShieldCheck } from 'lucide-react';

const STORAGE_KEY_FOODS = 'first_auto_food_items_v1';
const STORAGE_KEY_USERS = 'first_auto_food_users_v1';
const STORAGE_KEY_CURRENT_USER = 'first_auto_food_curr_user_v1';

export default function App() {
  // 1. Food Data State (initialized from localStorage or default 75 foods)
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FOODS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_FOODS;
  });

  // 2. Users State
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_USERS;
  });

  // 3. Current Logged-in User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_USERS[0]; // Default logged in as demo member "น้องเฟิร์ส"
  });

  // 4. Navigation Tab State
  const [currentTab, setCurrentTab] = useState<'home' | 'all' | 'favorites' | 'history' | 'admin'>('home');

  // 5. Filter State
  const [filters, setFilters] = useState<FilterState>({
    category: 'ทั้งหมด',
    caloriePreset: 'all',
    customMinCal: 200,
    customMaxCal: 600,
    vegFilter: 'all',
    meatFilter: 'all',
    searchKeyword: '',
  });

  // 6. Modals State
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 7. Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOODS, JSON.stringify(foods));
    } catch {}
  }, [foods]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch {}
  }, [currentUser]);

  // Filter foods according to user conditions
  const eligibleFoods = useMemo(() => {
    return foods.filter((food) => {
      // Category filter
      if (filters.category !== 'ทั้งหมด' && food.category !== filters.category) {
        return false;
      }

      // Calorie filter
      if (filters.caloriePreset === 'under300' && food.calories >= 300) return false;
      if (filters.caloriePreset === '300to500' && (food.calories < 300 || food.calories > 500)) return false;
      if (filters.caloriePreset === '500to700' && (food.calories < 500 || food.calories > 700)) return false;
      if (filters.caloriePreset === 'custom') {
        if (food.calories < filters.customMinCal || food.calories > filters.customMaxCal) return false;
      }

      // Veg filter
      if (filters.vegFilter === 'veg' && !food.hasVegetables) return false;
      if (filters.vegFilter === 'noveg' && food.hasVegetables) return false;

      // Meat filter
      if (filters.meatFilter === 'pork' && food.meatType !== 'หมู') return false;
      if (filters.meatFilter === 'chicken' && food.meatType !== 'ไก่') return false;

      // Search keyword
      if (filters.searchKeyword.trim()) {
        const query = filters.searchKeyword.trim().toLowerCase();
        const inName = food.name.toLowerCase().includes(query);
        const inIngredients = food.ingredients.some((i) => i.name.toLowerCase().includes(query));
        if (!inName && !inIngredients) return false;
      }

      return true;
    });
  }, [foods, filters]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      category: 'ทั้งหมด',
      caloriePreset: 'all',
      customMinCal: 200,
      customMaxCal: 600,
      vegFilter: 'all',
      meatFilter: 'all',
      searchKeyword: '',
    });
    addToast('info', 'รีเซ็ตเงื่อนไขการสุ่มเป็นค่าเริ่มต้นแล้ว');
  };

  // Trigger Roulette Spin
  const handleTriggerSpin = () => {
    if (eligibleFoods.length === 0) {
      addToast('error', 'ไม่พบอาหารที่ตรงกับเงื่อนไข ลองปรับเงื่อนไขใหม่');
      return;
    }
    setIsRouletteOpen(true);
  };

  // When wheel stops and a food is selected
  const handleFoodSelected = (food: FoodItem) => {
    addToast('success', `สุ่มได้เมนู "${food.name}" สำเร็จ! 🎉`);

    if (currentUser) {
      const historyItem: SpunHistoryItem = {
        id: `hist-${Date.now()}`,
        foodId: food.id,
        foodName: food.name,
        foodImage: food.image,
        category: food.category,
        calories: food.calories,
        spunAt: new Date().toISOString(),
      };

      const updatedUser: UserProfile = {
        ...currentUser,
        spinCount: currentUser.spinCount + 1,
        history: [historyItem, ...currentUser.history.slice(0, 49)],
      };

      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (foodId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playPop();

    if (!currentUser) {
      setIsAuthOpen(true);
      addToast('info', 'กรุณาเข้าสู่ระบบเพื่อบันทึกรายการโปรด');
      return;
    }

    const isFav = currentUser.favorites.includes(foodId);
    let updatedFavorites: string[];

    if (isFav) {
      updatedFavorites = currentUser.favorites.filter((id) => id !== foodId);
      addToast('info', 'ลบออกจากรายการโปรดแล้ว');
    } else {
      updatedFavorites = [...currentUser.favorites, foodId];
      addToast('favorite', 'เพิ่มลงในรายการโปรดแล้ว ❤️');
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      favorites: updatedFavorites,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Open food details modal
  const handleOpenDetail = (food: FoodItem) => {
    setSelectedFoodForDetail(food);
    setIsDetailOpen(true);
  };

  // Admin Food CRUD Handlers
  const handleAddFood = (newFood: FoodItem) => {
    setFoods((prev) => [newFood, ...prev]);
    addToast('success', `เพิ่มเมนู "${newFood.name}" เรียบร้อยแล้ว`);
  };

  const handleUpdateFood = (updated: FoodItem) => {
    setFoods((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    addToast('success', `แก้ไขเมนู "${updated.name}" สำเร็จ`);
  };

  const handleDeleteFood = (foodId: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== foodId));
    addToast('info', 'ลบเมนูอาหารออกจากระบบแล้ว');
  };

  const handleResetFoodsToDefault = () => {
    setFoods(INITIAL_FOODS);
    addToast('success', 'คืนค่า 75 เมนูอาหารมาตรฐานเรียบร้อยแล้ว');
  };

  // Member management handlers
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('info', 'ลบสมาชิกออกจากระบบแล้ว');
  };

  const handleSwitchToAdmin = () => {
    const adminUser = users.find((u) => u.role === 'admin') || DEFAULT_USERS[1];
    setCurrentUser(adminUser);
    addToast('success', 'สลับเข้าสู่ระบบในฐานะ Admin แล้ว');
  };

  // Favorites foods list
  const favoriteFoods = useMemo(() => {
    if (!currentUser) return [];
    return foods.filter((f) => currentUser.favorites.includes(f.id));
  }, [foods, currentUser]);

  // Featured and Popular foods for Home
  const featuredFoods = useMemo(() => {
    return foods.filter((f) => f.featured).slice(0, 6);
  }, [foods]);

  const popularFoods = useMemo(() => {
    return foods.filter((f) => f.popular).slice(0, 6);
  }, [foods]);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-stone-800 pb-16 md:pb-8">
      {/* Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          sounds.playPop();
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onTriggerSpin={handleTriggerSpin}
        favoriteCount={currentUser ? currentUser.favorites.length : 0}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white shadow-xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Background graphic elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  <span>ระบบสุ่มเมนูอาหารอัจฉริยะแบบอยู่ในกรอบ</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-sm leading-tight">
                  วันนี้กินอะไรดี? <br className="hidden sm:inline" />
                  <span className="text-yellow-200">ให้เราช่วยเลือก!</span>
                </h1>
                <p className="text-sm sm:text-base text-amber-50 leading-relaxed font-normal">
                  หมดปัญหาคิดไม่ออกว่าจะกินอะไร กำหนดเงื่อนไขที่ต้องการ เช่น แคลอรี่ เนื้อสัตว์
                  หรือการกินผัก แล้วหมุนวงล้อสุ่มเมนูอร่อยได้ทันที!
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      handleTriggerSpin();
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-white text-orange-600 hover:bg-amber-50 font-bold text-sm sm:text-base shadow-lg shadow-black/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>เริ่มสุ่มเมนูทันที</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setCurrentTab('all');
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-orange-700/50 hover:bg-orange-700/70 border border-white/30 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>ดูอาหารทั้งหมด (75 เมนู)</span>
                  </button>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="relative w-full max-w-sm lg:max-w-md shrink-0 z-10">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 group">
                  <img
                    src="/src/assets/images/thai_food_feast_1790511456537.jpg"
                    alt="Thai Food Feast"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs font-semibold text-white">
                      คัดสรร 75 เมนูอาหารไทยยอดนิยม พร้อมข้อมูลวิธีทำและแคลอรี่
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Criteria Section */}
            <FilterSection
              filters={filters}
              onFilterChange={setFilters}
              matchedCount={eligibleFoods.length}
              totalCount={foods.length}
              onTriggerSpin={handleTriggerSpin}
              onResetFilters={handleResetFilters}
            />

            {/* Filtered Dishes Preview (Live Results matching criteria) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                    เมนูที่อยู่ในเงื่อนไขของคุณ ({eligibleFoods.length} รายการ)
                  </h2>
                  <p className="text-xs text-stone-500">
                    คลิกที่การ์ดเพื่อดูวัตถุดิบและขั้นตอนการทำอย่างละเอียด
                  </p>
                </div>
                {eligibleFoods.length > 8 && (
                  <button
                    onClick={() => setCurrentTab('all')}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>ดูทั้งหมด</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {eligibleFoods.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {eligibleFoods.slice(0, 8).map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      isFavorite={currentUser ? currentUser.favorites.includes(food.id) : false}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={handleOpenDetail}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
                  <Utensils className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <p className="font-bold text-stone-700">ไม่พบเมนูที่ตรงกับเงื่อนไข</p>
                  <p className="text-xs text-stone-500 mt-1 mb-4">
                    ลองปรับช่วงแคลอรี่ หรือเปลี่ยนประเภทเนื้อสัตว์เพื่อค้นหาเมนูใหม่
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold"
                  >
                    รีเซ็ตเงื่อนไขทั้งหมด
                  </button>
                </div>
              )}
            </div>

            {/* Featured & Popular Collections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* Featured */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 rounded-full bg-orange-500" />
                  <h3 className="text-lg font-bold text-stone-900">เมนูแนะนำประจำวัน</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {featuredFoods.slice(0, 4).map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      isFavorite={currentUser ? currentUser.favorites.includes(food.id) : false}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={handleOpenDetail}
                    />
                  ))}
                </div>
              </div>

              {/* Popular */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 rounded-full bg-amber-500" />
                  <h3 className="text-lg font-bold text-stone-900">เมนูยอดนิยม</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {popularFoods.slice(0, 4).map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      isFavorite={currentUser ? currentUser.favorites.includes(food.id) : false}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={handleOpenDetail}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ALL 75 FOODS DIRECTORY */}
        {currentTab === 'all' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">คลังเมนูอาหารทั้งหมด</h1>
                <p className="text-xs text-stone-500 mt-1">
                  รวม 75 เมนูอาหารไทย (ของคาว 25, ของหวาน 25, ของกินเล่น 25)
                </p>
              </div>

              {/* Category Quick Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-xl overflow-x-auto max-w-full">
                {(['ทั้งหมด', 'ของคาว', 'ของหวาน', 'ของกินเล่น'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playPop();
                      setFilters({ ...filters, category: cat });
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      filters.category === cat
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Foods */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {eligibleFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  isFavorite={currentUser ? currentUser.favorites.includes(food.id) : false}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={handleOpenDetail}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: FAVORITES */}
        {currentTab === 'favorites' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-stone-200">
              <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                <span>อาหารโปรดของฉัน</span>
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                เมนูที่คุณกดบันทึกหัวใจไว้ เพื่อสะดวกต่อการเลือกทานในครั้งถัดไป
              </p>
            </div>

            {favoriteFoods.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {favoriteFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={handleOpenDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs max-w-md mx-auto my-12">
                <Heart className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                <p className="font-bold text-stone-800">ยังไม่มีเมนูโปรด</p>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  กดรูปหัวใจ ❤️ ที่การ์ดเมนูอาหาร เพื่อบันทึกเป็นเมนูโปรดของคุณ
                </p>
                <button
                  onClick={() => setCurrentTab('all')}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
                >
                  เลือกดูเมนูอาหาร
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: HISTORY */}
        {currentTab === 'history' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-stone-200">
              <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <History className="w-6 h-6 text-orange-500" />
                <span>ประวัติการสุ่มอาหาร</span>
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                บันทึกรายการอาหารที่คุณเคยสุ่มได้ในแต่ละมื้อ
              </p>
            </div>

            {currentUser && currentUser.history.length > 0 ? (
              <div className="space-y-3 max-w-3xl">
                {currentUser.history.map((item) => {
                  const fullFood = foods.find((f) => f.id === item.foodId);
                  const dateStr = new Date(item.spunAt).toLocaleString('th-TH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  return (
                    <div
                      key={item.id}
                      onClick={() => fullFood && handleOpenDetail(fullFood)}
                      className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-orange-300 shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.foodImage}
                          alt={item.foodName}
                          className="w-12 h-12 rounded-xl object-cover bg-amber-100 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{item.foodName}</h4>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="text-orange-600 font-medium">{item.category}</span>
                            <span>·</span>
                            <span>{item.calories} kcal</span>
                            <span>·</span>
                            <span className="text-stone-400">{dateStr}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fullFood) handleOpenDetail(fullFood);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 shrink-0"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs max-w-md mx-auto my-12">
                <History className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                <p className="font-bold text-stone-800">ยังไม่มีประวัติการสุ่ม</p>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  ลองกดปุ่มสุ่มอาหารเพื่อเริ่มบันทึกประวัติมื้ออร่อยของคุณ
                </p>
                <button
                  onClick={handleTriggerSpin}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
                >
                  สุ่มอาหารทันที
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {currentTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            foods={foods}
            users={users}
            onAddFood={handleAddFood}
            onUpdateFood={handleUpdateFood}
            onDeleteFood={handleDeleteFood}
            onResetFoods={handleResetFoodsToDefault}
            onSwitchToAdmin={handleSwitchToAdmin}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/60 bg-white/70 backdrop-blur-md mt-12 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
              F
            </div>
            <span className="font-bold text-stone-800">First Auto Food</span>
            <span>— เว็บไซต์สุ่มเมนูอาหารอัตโนมัติ สำหรับโปรเจกต์นักเรียน</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>ฐานข้อมูล 75 เมนู</span>
            <span>·</span>
            <span>ระบบอยู่ในกรอบ</span>
            <span>·</span>
            <button
              onClick={handleSwitchToAdmin}
              className="text-stone-600 hover:text-orange-600 font-semibold"
            >
              เข้าสู่ระบบ Admin
            </button>
          </div>
        </div>
      </footer>

      {/* Bottom Fixed Navigation Bar for Mobile Thumb Ergonomics */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100 grid grid-cols-5 items-center h-16 px-2 shadow-lg">
        <button
          onClick={() => {
            sounds.playPop();
            setCurrentTab('home');
          }}
          className={`flex flex-col items-center justify-center py-1 ${
            currentTab === 'home' ? 'text-orange-600 font-bold' : 'text-stone-500'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">หน้าแรก</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setCurrentTab('all');
          }}
          className={`flex flex-col items-center justify-center py-1 ${
            currentTab === 'all' ? 'text-orange-600 font-bold' : 'text-stone-500'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">75 เมนู</span>
        </button>

        {/* Central Spin Button */}
        <button
          onClick={() => {
            sounds.playPop();
            handleTriggerSpin();
          }}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-transform">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-orange-600 mt-1">สุ่มอาหาร</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setCurrentTab('favorites');
          }}
          className={`flex flex-col items-center justify-center py-1 relative ${
            currentTab === 'favorites' ? 'text-orange-600 font-bold' : 'text-stone-500'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">เมนูโปรด</span>
          {currentUser && currentUser.favorites.length > 0 && (
            <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            if (currentUser) {
              setIsProfileOpen(true);
            } else {
              setIsAuthOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center py-1 text-stone-500"
        >
          {currentUser ? (
            <img
              src={currentUser.profileImage}
              alt=""
              className="w-5 h-5 rounded-full object-cover border border-amber-300"
            />
          ) : (
            <ChefHat className="w-5 h-5" />
          )}
          <span className="text-[10px] mt-0.5">{currentUser ? 'โปรไฟล์' : 'เข้าสู่ระบบ'}</span>
        </button>
      </div>

      {/* ROULETTE WHEEL POPUP MODAL */}
      <RouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        eligibleFoods={eligibleFoods}
        onFoodSelected={handleFoodSelected}
        onOpenDetail={(food) => {
          setIsRouletteOpen(false);
          handleOpenDetail(food);
        }}
      />

      {/* FOOD DETAIL POPUP MODAL */}
      <FoodDetailModal
        food={selectedFoodForDetail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={
          selectedFoodForDetail && currentUser
            ? currentUser.favorites.includes(selectedFoodForDetail.id)
            : false
        }
        onToggleFavorite={handleToggleFavorite}
      />

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          addToast('success', `เข้าสู่ระบบในฐานะ ${user.name} สำเร็จ!`);
        }}
        onRegister={(newUser) => {
          setUsers((prev) => [...prev, newUser]);
          setCurrentUser(newUser);
          addToast('success', `ยินดีต้อนรับคุณ ${newUser.name} เข้าสู่ First Auto Food!`);
        }}
        defaultUsers={users}
      />

      {/* MEMBER PROFILE MODAL */}
      {currentUser && (
        <MemberProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={(updated) => {
            const newUser = { ...currentUser, ...updated };
            setCurrentUser(newUser);
            setUsers((prev) => prev.map((u) => (u.id === newUser.id ? newUser : u)));
            addToast('success', 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว');
          }}
          onLogout={() => {
            setCurrentUser(null);
            addToast('info', 'ออกจากระบบแล้ว');
          }}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            addToast('success', `สลับเป็น ${user.name} (${user.role}) เรียบร้อย`);
          }}
          allUsers={users}
        />
      )}
    </div>
  );
}
