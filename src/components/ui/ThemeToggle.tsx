import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-10 h-10 rounded-lg border border-border bg-bg-elevated flex items-center justify-center overflow-hidden hover:border-border-hover transition-colors ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ y: -20, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 20, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {theme === 'dark' ? (
          <Moon className="w-[18px] h-[18px] text-accent" />
        ) : (
          <Sun className="w-[18px] h-[18px] text-accent" />
        )}
      </motion.div>
    </motion.button>
  );
}
