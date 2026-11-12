// Ye interactive Slide Button component hai.
// Provider is button ko left se right slide karta hai jab service work physically complete ho jata hai.
// Ye slider touch screens (mobile) aur desktop mouse drag dono par smoothly kaam karta hai.

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';

export const SlideButton = ({
  label = 'Slide to Complete Service',
  completedLabel = 'Service Work Completed ✓',
  onComplete,
  disabled = false,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const thumbRef = useRef(null);

  const getMaxDrag = () => {
    if (!containerRef.current || !thumbRef.current) return 0;
    return containerRef.current.clientWidth - thumbRef.current.clientWidth - 8; // 8px for padding (4px each side)
  };

  // Mouse & Touch drag start handler
  const handleStart = (clientX) => {
    if (disabled || isCompleted) return;
    setIsDragging(true);
  };

  // Dragging in progress handler
  const handleMove = (clientX) => {
    if (!isDragging || disabled || isCompleted) return;
    if (!containerRef.current || !thumbRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const rawPos = clientX - rect.left - thumbRef.current.clientWidth / 2;
    const maxDrag = getMaxDrag();

    const clampedPos = Math.max(0, Math.min(rawPos, maxDrag));
    setSliderPosition(clampedPos);
  };

  // Drag ended handler (snap to finish or spring back)
  const handleEnd = () => {
    if (!isDragging || disabled || isCompleted) return;
    setIsDragging(false);

    const maxDrag = getMaxDrag();
    // Agar user ne 80% se zyada slide kar diya, toh success trigger hota hai
    if (maxDrag > 0 && sliderPosition >= maxDrag * 0.8) {
      setSliderPosition(maxDrag);
      setIsCompleted(true);
      if (onComplete) {
        onComplete();
      }
    } else {
      // Wapas 0 par spring back hota hai
      setSliderPosition(0);
    }
  };

  // Global event listeners for smooth dragging outside element bounds
  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, sliderPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden h-14 rounded-full p-1 transition-colors duration-300 flex items-center ${
        disabled
          ? 'bg-slate-100 opacity-60 cursor-not-allowed border border-slate-200'
          : isCompleted
          ? 'bg-emerald-600 border border-emerald-500 shadow-md'
          : 'bg-emerald-900/90 border border-emerald-700 shadow-inner'
      } ${className}`}
    >
      {/* Background track fill following the thumb */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-emerald-500/30 rounded-full pointer-events-none transition-all"
        style={{
          width: isCompleted ? '100%' : `${sliderPosition + 48}px`,
          transition: isDragging ? 'none' : 'width 0.25s ease-out',
        }}
      />

      {/* Label text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-12">
        <span
          className={`text-xs sm:text-sm font-bold tracking-wide transition-opacity duration-200 ${
            isCompleted
              ? 'text-white'
              : 'text-emerald-100/90'
          }`}
        >
          {isCompleted ? completedLabel : label}
        </span>
      </div>

      {/* Draggable Thumb */}
      <div
        ref={thumbRef}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0]) handleStart(e.touches[0].clientX);
        }}
        style={{
          transform: `translateX(${sliderPosition}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease-out',
        }}
        className={`relative z-20 h-12 w-12 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg transition-shadow ${
          disabled
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : isCompleted
            ? 'bg-white text-emerald-700'
            : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 active:scale-95'
        }`}
      >
        {isCompleted ? (
          <Check className="h-6 w-6 stroke-[3]" />
        ) : (
          <ChevronRight className="h-6 w-6 stroke-[3] animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default SlideButton;

