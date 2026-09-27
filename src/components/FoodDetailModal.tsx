import React, { useState } from 'react';
import { FoodItem } from '../types/food';
import { X, Heart, Flame, Clock, ChefHat, Check, UtensilsCrossed, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FoodDetailModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !food) return null;

  // Group ingredients by category
  const groupedIngredients: Record<string, typeof food.ingredients> = {};
  food.ingredients.forEach((ing) => {
    const cat = ing.category || 'ส่วนผสมหลัก';
    if (!groupedIngredients[cat]) groupedIngredients[cat] = [];
    groupedIngredients[cat].push(ing);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-amber-100">
        {/* Header Image Slot */}
        <div className="relative h-60 sm:h-72 w-full bg-amber-50 shrink-0 overflow-hidden">
          {!imageError ? (
            <img
              src={food.image}
              alt={food.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 p-6 text-center">
              <ChefHat className="w-16 h-16 mb-2 opacity-70" />
              <p className="font-bold text-lg">{food.name}</p>
            </div>
          )}

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Button on Image */}
          <button
            onClick={() => onToggleFavorite(food.id)}
            className={`absolute top-4 left-4 h-10 px-3.5 rounded-full flex items-center gap-1.5 backdrop-blur-md text-xs font-semibold transition-all ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/90 hover:bg-white text-stone-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : 'text-rose-500'}`} />
            <span>{isFavorite ? 'อยู่ในรายการโปรด' : 'บันทึกเมนูโปรด'}</span>
          </button>

          {/* Title and Badges Overlay */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-orange-500/90 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {food.category}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-full">
                เนื้อสัตว์: {food.meatType}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-0.5 rounded-full">
                {food.hasVegetables ? '🌱 มีผัก' : '🥩 ไม่มีผัก'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {food.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-amber-50/70 p-3 rounded-2xl flex items-center gap-3 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-500">พลังงานโดยประมาณ</p>
                <p className="text-base font-bold text-stone-900">{food.calories} kcal</p>
              </div>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-2xl flex items-center gap-3 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-500">เวลาในการทำ</p>
                <p className="text-base font-bold text-stone-900">{food.cookingTime}</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-amber-50/70 p-3 rounded-2xl flex items-center gap-3 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-500">วัตถุดิบทั้งหมด</p>
                <p className="text-base font-bold text-stone-900">{food.ingredients.length} รายการ</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <p className="font-semibold text-stone-800 mb-1 flex items-center gap-1.5 text-xs text-orange-600">
              <Sparkles className="w-3.5 h-3.5" /> รายละเอียดเมนู
            </p>
            {food.description}
          </div>

          {/* Tab Controls: "ดูวัตถุดิบ" and "ดูวิธีทำ" */}
          <div className="flex p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('ingredients');
              }}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'ingredients'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>ดูวัตถุดิบ ({food.ingredients.length})</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('steps');
              }}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'steps'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>ดูวิธีทำ ({food.cookingSteps.length} ขั้นตอน)</span>
            </button>
          </div>

          {/* Tab Content 1: Ingredients by Category */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {Object.entries(groupedIngredients).map(([categoryName, items]) => (
                <div key={categoryName} className="border border-stone-100 rounded-2xl p-4 bg-white shadow-2xs">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                    {categoryName}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-stone-50 rounded-lg"
                      >
                        <span className="text-stone-800 font-medium">{ing.name}</span>
                        <span className="text-stone-500">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 2: Cooking Steps */}
          {activeTab === 'steps' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {food.cookingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/60"
                >
                  <div className="w-7 h-7 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-100 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
