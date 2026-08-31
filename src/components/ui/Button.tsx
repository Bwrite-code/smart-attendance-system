import { motion, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  magnetic?: boolean;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', magnetic = false, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.25);
    y.set(relY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base = 'relative inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 select-none disabled:opacity-40 disabled:cursor-not-allowed';

  const variants: Record<Variant, string> = {
    primary: 'text-white hover:shadow-[0_0_24px_var(--shadow-glow)] active:scale-[0.96]',
    secondary: 'bg-bg-elevated text-fg border border-border hover:border-border-hover active:scale-[0.96]',
    ghost: 'text-fg-muted hover:text-fg hover:bg-bg-elevated active:scale-[0.96]',
    danger: 'text-white hover:shadow-[0_0_24px_rgba(214,69,69,0.3)] active:scale-[0.96]',
    success: 'text-white hover:shadow-[0_0_24px_rgba(217,181,108,0.3)] active:scale-[0.96]',
  };

  const primaryBg = 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]';
  const dangerBg = 'bg-[var(--danger)]';
  const successBg = 'bg-gradient-to-br from-[var(--success)] to-[var(--accent)]';

  const bgClass = variant === 'primary' ? primaryBg : variant === 'danger' ? dangerBg : variant === 'success' ? successBg : '';

  const sizes: Record<Size, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  const style: MotionValue = springX as unknown as MotionValue;

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${base} ${bgClass} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

export function IconButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-bg-elevated text-fg-muted hover:text-fg hover:border-border-hover transition-colors ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
