import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FoodItem } from '../types/food';
import { X, RotateCcw, Eye, Sparkles, Trophy, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleFoods: FoodItem[];
  onFoodSelected: (food: FoodItem) => void;
  onOpenDetail: (food: FoodItem) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({
  isOpen,
  onClose,
  eligibleFoods,
  onFoodSelected,
  onOpenDetail,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Wheel state
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const targetIndexRef = useRef<number>(0);
  const lastTickSliceRef = useRef<number>(-1);

  // Slice colors palette - appetizing, warm, cute pastel shades
  const sliceColors = [
    '#FF6B6B', '#FFA07A', '#FFD166', '#06D6A0', '#118AB2', 
    '#F78C6B', '#8338EC', '#3A86FF', '#FB5607', '#48CAE4',
    '#52B788', '#FFB703', '#E07A5F', '#81B29A', '#F2CC8F'
  ];

  // Draw the wheel on canvas
  const drawWheel = useCallback((currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 18;

    ctx.clearRect(0, 0, width, height);

    if (eligibleFoods.length === 0) return;

    const numSlices = eligibleFoods.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    // Draw Outer Rim with soft shadow and golden ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#FB923C'; // Orange glow rim
    ctx.shadowColor = 'rgba(251, 146, 60, 0.4)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // Draw Slices
    eligibleFoods.forEach((food, index) => {
      const startAngle = currentRotation + index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternating colors
      ctx.fillStyle = sliceColors[index % sliceColors.length];
      ctx.fill();

      // Border between slices
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Food Title Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = numSlices > 30 ? 'bold 10px Kanit, sans-serif' : numSlices > 16 ? 'bold 11px Kanit, sans-serif' : 'bold 13px Kanit, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;

      // Truncate name for small slices
      const maxLen = numSlices > 25 ? 12 : 18;
      const displayName = food.name.length > maxLen ? food.name.substring(0, maxLen) + '…' : food.name;
      ctx.fillText(displayName, radius - 18, 4);
      ctx.restore();

      ctx.restore();
    });

    // Outer Decorative Studs / Lights
    const numStuds = Math.min(36, Math.max(16, numSlices));
    for (let i = 0; i < numStuds; i++) {
      const studAngle = (i * 2 * Math.PI) / numStuds;
      const x = centerX + (radius + 7) * Math.cos(studAngle);
      const y = centerY + (radius + 7) * Math.sin(studAngle);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#FEF08A' : '#FFFFFF';
      ctx.fill();
    }

    // Center Hub with gradient
    const hubGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 28);
    hubGrad.addColorStop(0, '#FFFFFF');
    hubGrad.addColorStop(0.7, '#FED7AA');
    hubGrad.addColorStop(1, '#FB923C');

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Center Icon / Food symbol
    ctx.fillStyle = '#C2410C';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍽️', centerX, centerY);
    ctx.restore();
  }, [eligibleFoods]);

  // Spin start handler
  const startSpin = useCallback(() => {
    if (isSpinning || eligibleFoods.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedFood(null);

    // Pick a random target food index from eligible foods
    const chosenIndex = Math.floor(Math.random() * eligibleFoods.length);
    targetIndexRef.current = chosenIndex;

    const numSlices = eligibleFoods.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    // Pointer is at the TOP (angle = 3 * Math.PI / 2 or -Math.PI / 2)
    // To land slice at the top pointer:
    // (rotation + chosenIndex * sliceAngle + sliceAngle / 2) % (2 * Math.PI) = 3 * Math.PI / 2
    const pointerAngle = (3 * Math.PI) / 2;
    const currentRot = rotationRef.current % (2 * Math.PI);

    // Extra spins: 5 to 7 full rotations
    const totalExtraRotations = 6 * 2 * Math.PI;

    // Calculate exact final angle that aligns center of chosen slice with top pointer
    const sliceCenterAngle = chosenIndex * sliceAngle + sliceAngle / 2;
    let targetAngle = pointerAngle - sliceCenterAngle;
    while (targetAngle < currentRot) {
      targetAngle += 2 * Math.PI;
    }
    const finalRotation = targetAngle + totalExtraRotations;

    // Animation physics parameters
    const duration = 5000; // 5 seconds smooth spin
    const startTime = performance.now();
    const initialRotation = rotationRef.current;
    const totalDistance = finalRotation - initialRotation;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Custom smooth deceleration easeOutCubic / easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 3.8);
      const currentPos = initialRotation + totalDistance * ease;
      rotationRef.current = currentPos;

      // Audio tick detection as slices pass top pointer
      const currentNormalizedAngle = (pointerAngle - (currentPos % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currentSlice = Math.floor(currentNormalizedAngle / sliceAngle) % numSlices;
      if (currentSlice !== lastTickSliceRef.current) {
        sounds.playTick(700 + (currentSlice % 3) * 80);
        lastTickSliceRef.current = currentSlice;
      }

      drawWheel(currentPos);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Stopped!
        setIsSpinning(false);
        const winFood = eligibleFoods[chosenIndex];
        setSelectedFood(winFood);
        setShowResult(true);
        sounds.playWin();
        onFoodSelected(winFood);

        // Confetti explosion
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2', '#FB8500', '#F72585']
          });
        } catch {}
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, eligibleFoods, drawWheel, onFoodSelected]);

  // Initial draw & auto-spin when opened
  useEffect(() => {
    if (isOpen && eligibleFoods.length > 0) {
      setShowResult(false);
      setSelectedFood(null);
      // Wait for DOM to render canvas size
      const timer = setTimeout(() => {
        drawWheel(rotationRef.current);
        startSpin();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-amber-100 flex flex-col items-center my-auto overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          disabled={isSpinning}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Food Roulette Wheel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {isSpinning ? 'กำลังสุ่มเมนูแสนอร่อย...' : showResult ? '✨ ได้เมนูสำหรับวันนี้แล้ว! ✨' : 'วงล้อสุ่มเมนูอาหาร'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            สุ่มจาก {eligibleFoods.length} เมนูที่ตรงตามเงื่อนไขของคุณ
          </p>
        </div>

        {/* The Roulette Wheel Container */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Top Indicator Pointer (Needle) */}
          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 transition-transform ${isSpinning ? 'animate-bounce' : ''}`}>
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-500 drop-shadow-md" />
            <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-[-2px] left-1/2 -translate-x-1/2 shadow-inner" />
          </div>

          {/* Wheel Canvas */}
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] drop-shadow-xl"
          />
        </div>

        {/* Result Announcement Box (Shows when stopped) */}
        {showResult && selectedFood && (
          <div className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-orange-200 text-center animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-500 text-white text-xs font-semibold mb-2 shadow-sm">
              <Trophy className="w-3.5 h-3.5" />
              <span>เมนูแนะนำสำหรับคุณ</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {selectedFood.name}
            </h3>

            <div className="flex items-center justify-center gap-4 text-xs text-stone-600 mt-2">
              <span className="font-semibold text-orange-600">{selectedFood.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {selectedFood.calories} kcal
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {selectedFood.cookingTime}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-5 w-full">
          {/* Re-spin button */}
          <button
            onClick={() => {
              sounds.playPop();
              startSpin();
            }}
            disabled={isSpinning}
            className="flex-1 min-w-[130px] h-12 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'กำลังหมุน...' : 'สุ่มใหม่อีกครั้ง'}</span>
          </button>

          {/* View Details button */}
          {selectedFood && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenDetail(selectedFood);
              }}
              className="flex-1 min-w-[130px] h-12 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-[0.98] text-amber-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>ดูวิธีทำและวัตถุดิบ</span>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            disabled={isSpinning}
            className="h-12 px-5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold text-sm transition-colors disabled:opacity-40"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
