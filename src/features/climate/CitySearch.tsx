'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useHVACStore } from '@/store/useHVACStore';

interface ClimateRecord {
  city: string;
  state: string;
  winterDesign: number;
  summerDesign: number;
  latentGrains: number;
  elevation: number;
}

export function CitySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ClimateRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const selectedCity = useHVACStore((s) => s.inputs.selectedCity);
  const selectedState = useHVACStore((s) => s.inputs.selectedState);
  const setLocation = useHVACStore((s) => s.setLocation);

  const fetchResults = useCallback(async (searchQuery: string) => {
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(searchQuery)}`);
      const data: ClimateRecord[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(query), 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  const handleSelect = (record: ClimateRecord) => {
    setLocation(
      record.city,
      record.state,
      record.winterDesign,
      record.summerDesign,
      record.latentGrains,
      record.elevation
    );
    setQuery(`${record.city}, ${record.state}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
        Location
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && results.length > 0 && setIsOpen(true)}
          placeholder={selectedCity ? `${selectedCity}, ${selectedState}` : 'Search city or state...'}
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded text-sm font-body text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-cooling transition-colors"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-950 border border-zinc-800 rounded shadow-2xl overflow-hidden">
          {results.map((record, idx) => (
            <button
              key={`${record.city}-${record.state}`}
              onClick={() => handleSelect(record)}
              className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                idx === activeIndex
                  ? 'bg-zinc-900 border-l-2 border-l-cyan-cooling'
                  : 'hover:bg-zinc-900/50 border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-sm text-zinc-200">{record.city}</span>
                <span className="text-xs text-zinc-500">{record.state}</span>
              </div>
              <div className="flex gap-3 font-mono text-xs">
                <span className="text-orange-heating">{record.winterDesign}F</span>
                <span className="text-cyan-cooling">{record.summerDesign}F</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
