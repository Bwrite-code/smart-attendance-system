import { motion } from 'framer-motion';

interface ProgressRailProps {
  steps: { label: string; key: string }[];
  currentStep: number;
  completedSteps: number[];
  failedStep?: number;
}

export function ProgressRail({ steps, currentStep, completedSteps, failedStep }: ProgressRailProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-4">
      {steps.map((step, i) => {
        const isCompleted = completedSteps.includes(i);
        const isFailed = failedStep === i;
        const isCurrent = currentStep === i;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isFailed
                    ? 'border-[var(--danger)]'
                    : isCompleted
                    ? 'border-[var(--success)]'
                    : isCurrent
                    ? 'border-[var(--accent)]'
                    : 'border-border bg-bg-elevated'
                }`}
                style={{
                  background: isFailed ? 'var(--danger-soft)' : isCompleted ? 'var(--success-soft)' : isCurrent ? 'var(--accent-soft)' : undefined,
                }}
              >
                {isFailed ? (
                  <span className="text-[var(--danger)] text-sm font-bold">✕</span>
                ) : isCompleted ? (
                  <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <motion.path d="M5 13l4 4L19 7" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
                  </motion.svg>
                ) : (
                  <span className={`text-sm font-medium ${isCurrent ? 'text-accent' : 'text-fg-dim'}`}>{i + 1}</span>
                )}
                {isCurrent && !isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent"
                    animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span className={`text-[10px] font-medium uppercase tracking-wider whitespace-nowrap ${isCompleted ? 'text-success' : isCurrent ? 'text-accent' : 'text-fg-dim'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 bg-border relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: 'linear-gradient(to right, var(--accent), var(--success))' }}
                  initial={{ width: '0%' }}
                  animate={{ width: completedSteps.includes(i) ? '100%' : isCurrent ? '50%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
