import React from 'react';
import { FilterState, FoodCategory, CaloriePreset, VegFilter, MeatFilter } from '../types/food';
import { SlidersHorizontal, Sparkles, RotateCcw, Search, Flame, Leaf, Drumstick, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  matchedCount: number;
  totalCount: number;
  onTriggerSpin: () => void;
  onResetFilters: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange,
  matchedCount,
  totalCount,
  onTriggerSpin,
  onResetFilters,
}) => {
  const categories: ('ทั้งหมด' | FoodCategory)[] = ['ทั้งหมด', 'ของคาว', 'ของหวาน', 'ของกินเล่น'];

  const calorieOptions: { id: CaloriePreset; label: string }[] = [
    { id: 'all', label: 'ไม่จำกัด' },
    { id: 'under300', label: '< 300 kcal' },
    { id: '300to500', label: '300 - 500 kcal' },
    { id: '500to700', label: '500 - 700 kcal' },
    { id: 'custom', label: 'กำหนดเอง' },
  ];

  const vegOptions: { id: VegFilter; label: string }[] = [
    { id: 'all', label: 'ไม่จำกัด' },
    { id: 'veg', label: '🌱 กินผัก' },
    { id: 'noveg', label: '🥩 ไม่กินผัก' },
  ];

  const meatOptions: { id: MeatFilter; label: string }[] = [
    { id: 'all', label: 'ไม่จำกัด' },
    { id: 'pork', label: 'หมู' },
    { id: 'chicken', label: 'ไก่' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-md">
      {/* Header of Filter with Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              กำหนดเงื่อนไขการสุ่ม
            </h2>
            <p className="text-xs text-stone-500">
              ระบบ “อยู่ในกรอบ” สุ่มเฉพาะเมนูที่ตรงกับที่คุณต้องการ
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onResetFilters();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-orange-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-stone-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตเงื่อนไข</span>
        </button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {/* 1. Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <span>หมวดหมู่อาหาร</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onFilterChange({ ...filters, category: cat });
                }}
                className={`py-2 px-2.5 text-xs font-medium rounded-lg transition-all truncate text-center ${
                  filters.category === cat
                    ? 'bg-white text-orange-600 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Calories */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>ปริมาณแคลอรี่</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl">
            {calorieOptions.slice(0, 3).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onFilterChange({ ...filters, caloriePreset: opt.id });
                }}
                className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all truncate text-center ${
                  filters.caloriePreset === opt.id
                    ? 'bg-white text-orange-600 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-xl">
            {calorieOptions.slice(3).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onFilterChange({ ...filters, caloriePreset: opt.id });
                }}
                className={`py-2 px-2 text-[11px] font-medium rounded-lg transition-all truncate text-center ${
                  filters.caloriePreset === opt.id
                    ? 'bg-white text-orange-600 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom calorie inputs if 'custom' is selected */}
          {filters.caloriePreset === 'custom' && (
            <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-200">
              <input
                type="number"
                min="0"
                max="1500"
                step="50"
                value={filters.customMinCal}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    customMinCal: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-1/2 p-2 border border-stone-200 rounded-xl text-xs text-center"
                placeholder="ต่ำสุด (kcal)"
              />
              <span className="text-xs text-stone-400">-</span>
              <input
                type="number"
                min="0"
                max="1500"
                step="50"
                value={filters.customMaxCal}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    customMaxCal: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-1/2 p-2 border border-stone-200 rounded-xl text-xs text-center"
                placeholder="สูงสุด (kcal)"
              />
            </div>
          )}
        </div>

        {/* 3. Vegetables */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            <span>การกินผัก</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl">
            {vegOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onFilterChange({ ...filters, vegFilter: opt.id });
                }}
                className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all truncate text-center ${
                  filters.vegFilter === opt.id
                    ? 'bg-white text-orange-600 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Meat Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Drumstick className="w-3.5 h-3.5 text-amber-600" />
            <span>ประเภทเนื้อสัตว์</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl">
            {meatOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onFilterChange({ ...filters, meatFilter: opt.id });
                }}
                className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all truncate text-center ${
                  filters.meatFilter === opt.id
                    ? 'bg-white text-orange-600 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time search keyword input */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchKeyword}
            onChange={(e) => onFilterChange({ ...filters, searchKeyword: e.target.value })}
            placeholder="ค้นหาชื่ออาหาร เช่น ผัดกะเพรา, ข้าวมันไก่..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-stone-50/50"
          />
        </div>

        {/* Status text & Match count */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
          {matchedCount > 0 ? (
            <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              พบ <strong className="font-bold text-stone-900">{matchedCount}</strong> / {totalCount} เมนูที่ตรงตามเงื่อนไข
            </span>
          ) : (
            <span className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>ไม่พบเมนูที่ตรงกับเงื่อนไข ลองปรับเงื่อนไขใหม่</span>
            </span>
          )}
        </div>
      </div>

      {/* Prominent CTA Spin Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            sounds.playPop();
            onTriggerSpin();
          }}
          disabled={matchedCount === 0}
          className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold text-base sm:text-lg shadow-xl shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
          <span>สุ่มอาหาร ({matchedCount} เมนูในวงล้อ)</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal hidden sm:inline">
            หมุนวงล้อนำโชค
          </span>
        </button>
      </div>
    </div>
  );
};
