import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, min, max, step = 1, onChange, ...props }, ref) => {
    const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

    return (
      <div className="relative flex items-center w-full min-h-[44px]">
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className={`w-full cursor-pointer ${className || ''}`}
          style={{
            background: `linear-gradient(to right, #e4e4e7 ${percentage}%, #27272a ${percentage}%)`
          }}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
