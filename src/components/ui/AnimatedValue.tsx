'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface AnimatedValueProps {
  value: number;
  format?: (val: number) => string;
}

export function AnimatedValue({ value, format }: AnimatedValueProps) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  
  const defaultFormat = (v: number) => {
    if (Number.isInteger(value)) {
      return Math.round(v).toLocaleString();
    }
    const decimals = value.toString().split('.')[1]?.length || 0;
    return v.toLocaleString(undefined, { 
      minimumFractionDigits: Math.min(decimals, 2), 
      maximumFractionDigits: Math.min(decimals, 2) 
    });
  };

  const formatter = format || defaultFormat;
  const [displayValue, setDisplayValue] = useState(formatter(value));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(formatter(latest));
    });
    return () => unsubscribe();
  }, [spring, formatter]);

  return <motion.span layout className="inline-block">{displayValue}</motion.span>;
}
