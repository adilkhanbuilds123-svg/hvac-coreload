import { useHVACStore } from '../store';
import { Check, MapPin, Home, PanelTop } from 'lucide-react';

const STEPS = [
    { label: 'Location', icon: MapPin },
    { label: 'Building', icon: Home },
    { label: 'Windows', icon: PanelTop },
];

export default function Stepper() {
    const currentStep = useHVACStore(state => state.currentStep);
    const setCurrentStep = useHVACStore(state => state.setCurrentStep);

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 px-4">
            {STEPS.map((step, idx) => {
                const isCompleted = currentStep > idx;
                const isActive = currentStep === idx;
                const Icon = step.icon;

                return (
                    <div key={idx} className="flex items-center gap-2 sm:gap-4">
                        {/* Step circle */}
                        <button
                            onClick={() => idx <= currentStep ? setCurrentStep(idx) : undefined}
                            className={`
                relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full
                font-bold text-sm transition-all duration-300 outline-none
                ${isCompleted
                                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 cursor-pointer'
                                    : isActive
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 animate-pulse-glow'
                                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                                }
              `}
                            aria-label={step.label}
                        >
                            {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                        </button>

                        {/* Label */}
                        <span className={`
              hidden sm:block text-sm font-semibold tracking-wide
              ${isActive ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
              transition-colors duration-300
            `}>
                            {step.label}
                        </span>

                        {/* Connector */}
                        {idx < STEPS.length - 1 && (
                            <div className={`
                w-8 sm:w-16 h-0.5 rounded-full transition-all duration-500
                ${isCompleted
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                    : 'bg-slate-200'
                                }
              `} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
