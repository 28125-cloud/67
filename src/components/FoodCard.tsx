import React, { useState } from 'react';
import { FoodItem } from '../types/food';
import { Heart, Clock, Flame, Utensils } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FoodCardProps {
  food: FoodItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => {
        sounds.playPop();
        onClick(food);
      }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Food Image / Fallback Container */}
      <div className="relative aspect-4/3 w-full bg-amber-50 overflow-hidden">
        {!imageError ? (
          <img
            src={food.image}
            alt={food.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 text-amber-700 p-4 text-center">
            <Utensils className="w-10 h-10 mb-2 opacity-60" />
            <span className="text-xs font-semibold">{food.category}</span>
            <span className="text-sm font-bold line-clamp-1">{food.name}</span>
          </div>
        )}

        {/* Category Tag Overlay */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span>{food.category}</span>
          <span className="opacity-50">·</span>
          <span>{food.meatType}</span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.id, e);
          }}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 active:scale-90 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-500'
          }`}
          title={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
            {food.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-amber-50 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-1 text-amber-700 font-medium">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{food.calories} kcal</span>
          </div>
          <div className="flex items-center gap-1 text-stone-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{food.cookingTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
