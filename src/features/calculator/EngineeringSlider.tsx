'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Slider } from '@/components/ui/Slider';

interface EngineeringSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export function EngineeringSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
}: EngineeringSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync edit value when external value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(String(value));
    }
  }, [value, isEditing]);



  const commitValue = useCallback(() => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      const stepped = Math.round(clamped / step) * step;
      onChange(stepped);
      setEditValue(String(stepped));
    } else {
      setEditValue(String(value));
    }
    setIsEditing(false);
  }, [editValue, min, max, step, onChange, value]);

  const handleFocus = () => {
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitValue();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(String(value));
      inputRef.current?.blur();
    }
  };

  const inputWidth = Math.max(4, String(max).length + 1);

  return (
    <div className="space-y-1.5 p-1">
      <div className="flex items-center justify-between min-h-[44px]">
        <label className="text-sm text-zinc-500 select-none">
          {label}
        </label>
        <div className="flex items-center gap-1 text-zinc-100">
          <input
            ref={inputRef}
            type="number"
            value={isEditing ? editValue : value}
            onChange={(e) => setEditValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={commitValue}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            style={{ width: `${inputWidth}ch` }}
            className={`
              font-mono text-sm font-medium text-right
              bg-transparent outline-none transition-all duration-200
              min-h-[44px] flex items-center justify-end
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              ${isEditing
                ? 'border-b-2 border-current'
                : 'border-b border-dashed border-zinc-700 hover:border-current cursor-text'
              }
            `}
            aria-label={`Enter value for ${label}`}
          />
          {unit && <span className="text-zinc-600 text-xs select-none pr-2">{unit}</span>}
        </div>
      </div>
      
      <Slider 
        value={value} 
        min={min} 
        max={max} 
        step={step} 
        onChange={(e) => onChange(Number(e.target.value))} 
      />
      
      <div className="flex justify-between text-[10px] font-mono text-zinc-700 select-none">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
