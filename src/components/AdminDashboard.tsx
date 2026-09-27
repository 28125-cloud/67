import React, { useState } from 'react';
import { FoodItem, UserProfile, FoodCategory, MeatType } from '../types/food';
import { Shield, ShieldAlert, Plus, Edit2, Trash2, Search, Sliders, Users, Utensils, Flame, RotateCcw, Check, Sparkles, KeyRound, Copy, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AdminDashboardProps {
  currentUser: UserProfile | null;
  foods: FoodItem[];
  users: UserProfile[];
  onAddFood: (food: FoodItem) => void;
  onUpdateFood: (food: FoodItem) => void;
  onDeleteFood: (id: string) => void;
  onResetFoods: () => void;
  onSwitchToAdmin: () => void;
  onDeleteUser: (id: string) => void;
  onToggleUserRole?: (id: string) => void;
  onToggleUserStatus?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  foods,
  users,
  onAddFood,
  onUpdateFood,
  onDeleteFood,
  onResetFoods,
  onSwitchToAdmin,
  onDeleteUser,
  onToggleUserRole,
  onToggleUserStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'foods' | 'members' | 'settings'>('overview');
  const [searchFoodQuery, setSearchFoodQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ทั้งหมด' | FoodCategory>('ทั้งหมด');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Food Edit/Add Modal State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Form Fields for Food
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('ของคาว');
  const [formCalories, setFormCalories] = useState<number>(450);
  const [formMeatType, setFormMeatType] = useState<MeatType>('หมู');
  const [formHasVeg, setFormHasVeg] = useState<boolean>(true);
  const [formCookingTime, setFormCookingTime] = useState('20 นาที');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIngredientsText, setFormIngredientsText] = useState('');
  const [formStepsText, setFormStepsText] = useState('');

  // Settle food counts
  const savoryCount = foods.filter((f) => f.category === 'ของคาว').length;
  const dessertCount = foods.filter((f) => f.category === 'ของหวาน').length;
  const snackCount = foods.filter((f) => f.category === 'ของกินเล่น').length;
  const totalSpins = users.reduce((acc, u) => acc + u.spinCount, 0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.playPop();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Access check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
        <p className="text-sm text-stone-500 mb-4">
          หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น บัญชีของคุณขณะนี้เป็นสถานะ Member
        </p>

        {/* Credentials reminder for the user */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-xs text-stone-700 mb-6 space-y-1">
          <p className="font-bold text-amber-900 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-orange-600" />
            <span>รหัสผ่านสำหรับเข้าใช้งานระบบ Admin:</span>
          </p>
          <p className="font-mono text-stone-800">อีเมล: <strong>admin@firstautofood.th</strong></p>
          <p className="font-mono text-amber-800">รหัสผ่าน: <strong>admin888food</strong></p>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onSwitchToAdmin();
          }}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>สลับเป็นบัญชีผู้ดูแลระบบทันที</span>
        </button>
      </div>
    );
  }

  // Open modal for Create
  const handleOpenCreateFood = () => {
    setEditingFood(null);
    setFormName('');
    setFormCategory('ของคาว');
    setFormCalories(450);
    setFormMeatType('หมู');
    setFormHasVeg(true);
    setFormCookingTime('20 นาที');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
    setFormIngredientsText('เนื้อหมู 150 กรัม\nกระเทียม 1 ช้อนโต๊ะ\nน้ำปลา 1 ช้อนโต๊ะ');
    setFormStepsText('เตรียมวัตถุดิบทั้งหมด\nผัดจนสุกและปรุงรส\nตักเสิร์ฟพร้อมข้าวสวย');
    setIsFoodModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setFormName(food.name);
    setFormCategory(food.category);
    setFormCalories(food.calories);
    setFormMeatType(food.meatType);
    setFormHasVeg(food.hasVegetables);
    setFormCookingTime(food.cookingTime);
    setFormDescription(food.description);
    setFormImage(food.image);
    setFormIngredientsText(food.ingredients.map((i) => `${i.name} ${i.amount}`).join('\n'));
    setFormStepsText(food.cookingSteps.join('\n'));
    setIsFoodModalOpen(true);
  };

  // Save Food
  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedIngredients = formIngredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(' ');
        const name = parts[0] || 'ส่วนผสม';
        const amount = parts.slice(1).join(' ') || 'พอประมาณ';
        return {
          name,
          amount,
          category: 'ส่วนผสมหลัก' as any,
        };
      });

    const parsedSteps = formStepsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (editingFood) {
      const updated: FoodItem = {
        ...editingFood,
        name: formName.trim(),
        category: formCategory,
        calories: Number(formCalories),
        meatType: formMeatType,
        hasVegetables: formHasVeg,
        cookingTime: formCookingTime,
        description: formDescription.trim(),
        image: formImage.trim() || editingFood.image,
        ingredients: parsedIngredients.length > 0 ? parsedIngredients : editingFood.ingredients,
        cookingSteps: parsedSteps.length > 0 ? parsedSteps : editingFood.cookingSteps,
      };
      onUpdateFood(updated);
    } else {
      const newFood: FoodItem = {
        id: `custom-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        calories: Number(formCalories),
        meatType: formMeatType,
        hasVegetables: formHasVeg,
        cookingTime: formCookingTime,
        description: formDescription.trim(),
        image: formImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{ name: 'วัตถุดิบหลัก', amount: '1 จาน', category: 'ส่วนผสมหลัก' as any }],
        cookingSteps: parsedSteps.length > 0 ? parsedSteps : ['ปรุงตามสูตรดั้งเดิม', 'จัดเสิร์ฟ'],
      };
      onAddFood(newFood);
    }

    sounds.playPop();
    setIsFoodModalOpen(false);
  };

  // Filtered foods for Admin table
  const filteredTableFoods = foods.filter((f) => {
    const matchCategory = filterCategory === 'ทั้งหมด' || f.category === filterCategory;
    const matchSearch = !searchFoodQuery || f.name.toLowerCase().includes(searchFoodQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Control Center (ระบบจัดการหลังบ้าน)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ระบบแอดมิน First Auto Food</h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            จัดการรายการอาหารทั้งหมด {foods.length} เมนู ตรวจสอบสถิติ จัดการสมาชิก และตั้งค่าระบบ
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-800/80 p-1 rounded-2xl border border-stone-700 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'foods' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            จัดการอาหาร ({foods.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'members' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            จัดการสมาชิก ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            รหัสผ่านและตั้งค่า
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium">อาหารทั้งหมด</span>
              <p className="text-2xl font-bold text-stone-900 mt-1">{foods.length}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">พร้อมสุ่ม</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium">ของคาว</span>
              <p className="text-2xl font-bold text-orange-600 mt-1">{savoryCount}</p>
              <span className="text-[10px] text-stone-400">จานหลัก</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium">ของหวาน</span>
              <p className="text-2xl font-bold text-pink-600 mt-1">{dessertCount}</p>
              <span className="text-[10px] text-stone-400">ขนมไทย/เบเกอรี่</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium">ของกินเล่น</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{snackCount}</p>
              <span className="text-[10px] text-stone-400">อาหารว่าง</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium">จำนวนสมาชิก</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{users.length}</p>
              <span className="text-[10px] text-stone-400">ในระบบ</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] text-stone-500 font-medium">จำนวนสุ่มสะสม</span>
              <p className="text-2xl font-bold text-purple-600 mt-1">{totalSpins}</p>
              <span className="text-[10px] text-stone-400">ครั้งทั้งหมด</span>
            </div>
          </div>

          {/* Interactive Statistics / Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Proportion Chart */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-4">สัดส่วนหมวดหมู่อาหารในระบบ</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-orange-600">ของคาว ({savoryCount} เมนู)</span>
                    <span>{Math.round((savoryCount / foods.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(savoryCount / foods.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-pink-600">ของหวาน ({dessertCount} เมนู)</span>
                    <span>{Math.round((dessertCount / foods.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(dessertCount / foods.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-600">ของกินเล่น ({snackCount} เมนู)</span>
                    <span>{Math.round((snackCount / foods.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(snackCount / foods.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Spun / Popular Foods */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-4">เมนูแนะนำและเมนูยอดนิยม</h3>
              <div className="space-y-3">
                {foods
                  .filter((f) => f.popular || f.featured)
                  .slice(0, 5)
                  .map((food, idx) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{food.name}</div>
                          <div className="text-[10px] text-stone-500">{food.category} · {food.calories} kcal</div>
                        </div>
                      </div>
                      <span className="text-xs text-orange-600 font-semibold">ยอดนิยม ⭐</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Foods Management CRUD */}
      {activeTab === 'foods' && (
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search and Category filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่ออาหาร..."
                  value={searchFoodQuery}
                  onChange={(e) => setSearchFoodQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="py-2 px-3 text-xs rounded-xl border border-stone-200 bg-white"
              >
                <option value="ทั้งหมด">ทุกหมวดหมู่</option>
                <option value="ของคาว">ของคาว</option>
                <option value="ของหวาน">ของหวาน</option>
                <option value="ของกินเล่น">ของกินเล่น</option>
              </select>
            </div>

            {/* Add Food Button */}
            <button
              onClick={() => {
                sounds.playPop();
                handleOpenCreateFood();
              }}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มเมนูอาหารใหม่</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-stone-100 rounded-2xl">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-100 font-bold text-stone-600 uppercase text-[10px]">
                <tr>
                  <th className="p-3">เมนูอาหาร</th>
                  <th className="p-3">หมวดหมู่</th>
                  <th className="p-3">แคลอรี่</th>
                  <th className="p-3">เนื้อสัตว์</th>
                  <th className="p-3">ผัก</th>
                  <th className="p-3">เวลาทำ</th>
                  <th className="p-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTableFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3 font-semibold text-stone-900 flex items-center gap-2.5">
                      <img
                        src={food.image}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover bg-amber-100 shrink-0"
                      />
                      <span className="line-clamp-1">{food.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 font-medium">
                        {food.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-medium">{food.calories} kcal</td>
                    <td className="p-3">{food.meatType}</td>
                    <td className="p-3">{food.hasVegetables ? 'มีผัก' : 'ไม่มีผัก'}</td>
                    <td className="p-3">{food.cookingTime}</td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditFood(food)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`ต้องการลบเมนู "${food.name}" ใช่หรือไม่?`)) {
                            sounds.playPop();
                            onDeleteFood(food.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Members Management */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">รายชื่อสมาชิกทั้งหมด ({users.length} คน)</h3>
              <p className="text-xs text-stone-500">สามารถปรับเปลี่ยนสิทธิ์ Member / Admin หรือระงับสถานะสมาชิกได้</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-stone-100 rounded-2xl">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-100 font-bold text-stone-600 uppercase text-[10px]">
                <tr>
                  <th className="p-3">สมาชิก</th>
                  <th className="p-3">อีเมล</th>
                  <th className="p-3">รหัสผ่าน</th>
                  <th className="p-3">ระดับสิทธิ์</th>
                  <th className="p-3">จำนวนสุ่ม</th>
                  <th className="p-3">เมนูโปรด</th>
                  <th className="p-3">สถานะ</th>
                  <th className="p-3 text-right">การจัดการสิทธิ์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                      <img src={u.profileImage} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 text-stone-500 font-mono">{u.email}</td>
                    <td className="p-3 font-mono text-stone-700">
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {u.password || 'password123'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleUserRole && onToggleUserRole(u.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                        title="คลิกเพื่อสลับสิทธิ์ Member / Admin"
                      >
                        {u.role === 'admin' ? '🛡️ Admin' : '👤 Member'}
                      </button>
                    </td>
                    <td className="p-3 font-mono">{u.spinCount} ครั้ง</td>
                    <td className="p-3 font-mono">{u.favorites.length} รายการ</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.status === 'suspended' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.status === 'suspended' ? 'ถูกระงับ' : 'ปกติ'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {onToggleUserStatus && u.id !== currentUser.id && (
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className="px-2 py-1 rounded-lg text-stone-500 hover:bg-stone-100 text-[11px]"
                          title={u.status === 'suspended' ? 'ปลดบล็อก' : 'ระงับบัญชี'}
                        >
                          {u.status === 'suspended' ? 'ปลดระงับ' : 'ระงับ'}
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`ต้องการลบสมาชิก "${u.name}" ใช่หรือไม่?`)) {
                              sounds.playPop();
                              onDeleteUser(u.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="ลบสมาชิก"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: System Settings & Credentials */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credentials Reference Card */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <span>ข้อมูลบัญชีและรหัสผ่านระบบ (Default Accounts)</span>
            </h3>
            <p className="text-xs text-stone-500">
              รายละเอียดบัญชีเริ่มต้นสำหรับคุณครู ผู้ตรวจ และนักเรียนในการทดสอบระบบ
            </p>

            <div className="space-y-3">
              {/* Member credentials box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <span>👤 บัญชี Member (สมาชิกทั่วไป)</span>
                  </div>
                  <button
                    onClick={() => handleCopy('first.student@foodapp.th / password123', 's-mem')}
                    className="text-[11px] text-stone-600 hover:text-orange-600 flex items-center gap-1 font-semibold"
                  >
                    {copiedId === 's-mem' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 's-mem' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono bg-white p-2.5 rounded-xl border border-stone-200 text-stone-700 space-y-1">
                  <div>อีเมล: <strong>first.student@foodapp.th</strong></div>
                  <div>รหัสผ่าน: <strong className="text-orange-600">password123</strong></div>
                  <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                    สิทธิ์: สุ่มอาหาร, ดูเมนู, บันทึกเมนูโปรด, บันทึกประวัติ
                  </div>
                </div>
              </div>

              {/* Admin credentials box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <span>🛡️ บัญชี Admin (ผู้ดูแลระบบหลังบ้าน)</span>
                  </div>
                  <button
                    onClick={() => handleCopy('admin@firstautofood.th / admin888food', 's-adm')}
                    className="text-[11px] text-amber-800 hover:text-orange-600 flex items-center gap-1 font-semibold"
                  >
                    {copiedId === 's-adm' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 's-adm' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono bg-white p-2.5 rounded-xl border border-amber-200 text-stone-700 space-y-1">
                  <div>อีเมล: <strong>admin@firstautofood.th</strong></div>
                  <div>รหัสผ่าน: <strong className="text-amber-700">admin888food</strong></div>
                  <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                    สิทธิ์: เข้าถึง Dashboard, จัดการ/เพิ่ม/ลบอาหาร, จัดการสมาชิก, ตั้งค่าระบบ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Reset & Options */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-stone-900">การจัดการฐานข้อมูลและระบบ</h3>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 mb-1">คืนค่าเริ่มต้นอาหาร (Reset to 75 Foods)</h4>
              <p className="text-xs text-amber-700 mb-3 leading-relaxed">
                รีเซ็ตรายการอาหารกลับสู่ค่ามาตรฐาน 75 เมนู (ของคาว 25, ของหวาน 25, ของกินเล่น 25) กรณีที่มีการทดสอบลบหรือแก้ไข
              </p>
              <button
                onClick={() => {
                  if (window.confirm('คุณต้องการรีเซ็ตรายการอาหารกลับสู่ 75 เมนูตั้งต้นใช่หรือไม่?')) {
                    sounds.playPop();
                    onResetFoods();
                    alert('รีเซ็ตรายการอาหาร 75 เมนูเรียบร้อยแล้ว!');
                  }
                }}
                className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-all"
              >
                คืนค่า 75 เมนูอาหารมาตรฐาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Food */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-amber-100 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              {editingFood ? `แก้ไขเมนู: ${editingFood.name}` : 'เพิ่มเมนูอาหารใหม่'}
            </h3>

            <form onSubmit={handleSaveFood} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">ชื่ออาหาร</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="เช่น ต้มข่าไก่สูตรโบราณ"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">หมวดหมู่</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="ของคาว">ของคาว</option>
                    <option value="ของหวาน">ของหวาน</option>
                    <option value="ของกินเล่น">ของกินเล่น</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">แคลอรี่ (kcal)</label>
                  <input
                    type="number"
                    required
                    value={formCalories}
                    onChange={(e) => setFormCalories(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">เนื้อสัตว์</label>
                  <select
                    value={formMeatType}
                    onChange={(e) => setFormMeatType(e.target.value as MeatType)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="หมู">หมู</option>
                    <option value="ไก่">ไก่</option>
                    <option value="กุ้ง/ซีฟู้ด">กุ้ง/ซีฟู้ด</option>
                    <option value="ไม่มีเนื้อสัตว์">ไม่มีเนื้อสัตว์</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">ผัก</label>
                  <select
                    value={formHasVeg ? 'yes' : 'no'}
                    onChange={(e) => setFormHasVeg(e.target.value === 'yes')}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    <option value="yes">มีผัก</option>
                    <option value="no">ไม่มีผัก</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">เวลาทำ</label>
                  <input
                    type="text"
                    value={formCookingTime}
                    onChange={(e) => setFormCookingTime(e.target.value)}
                    placeholder="20 นาที"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">URL รูปภาพ</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">รายละเอียดอาหาร</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="คำอธิบายรสชาติหรือความพิเศษของเมนู..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  รายการวัตถุดิบ (พิมพ์แยกบรรทัดละ 1 อย่าง เช่น "เนื้อไก่ 200 กรัม")
                </label>
                <textarea
                  rows={3}
                  value={formIngredientsText}
                  onChange={(e) => setFormIngredientsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  ขั้นตอนวิธีทำ (พิมพ์แยกบรรทัดละ 1 ขั้นตอน)
                </label>
                <textarea
                  rows={3}
                  value={formStepsText}
                  onChange={(e) => setFormStepsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-md"
                >
                  บันทึกข้อมูลอาหาร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
