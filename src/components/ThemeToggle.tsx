import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { useTheme, type Theme } from '../context/ThemeContext';

interface ThemeToggleProps {
  /** If true, renders a segmented pill or dropdown; if false, renders a sleek one-click toggle button */
  variant?: 'button' | 'segmented' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'button', className = '' }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Segmented control variant (e.g., inside menus or settings)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-inner ${className}`}
        role="group"
        aria-label="Theme mode switcher"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
            theme === 'light'
              ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Light mode"
          aria-pressed={theme === 'light'}
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-slate-900 dark:bg-blue-600 text-cyan-300 dark:text-white shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Dark mode"
          aria-pressed={theme === 'dark'}
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
            theme === 'system'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="System default"
          aria-pressed={theme === 'system'}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Auto</span>
        </button>
      </div>
    );
  }

  // Dropdown variant (e.g. for header profile or explicit preference selector)
  if (variant === 'dropdown') {
    const options: { id: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { id: 'light', label: 'Light', icon: Sun },
      { id: 'dark', label: 'Dark', icon: Moon },
      { id: 'system', label: 'System', icon: Laptop },
    ];

    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition shadow-sm"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Theme selector"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span className="capitalize">{theme}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition ${
                    isSelected
                      ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/70 dark:bg-blue-900/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default sleek one-click navbar toggle button with smooth icon transition and tooltip
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative w-9 h-9 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode (currently ${resolvedTheme})`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode (Currently ${resolvedTheme.toUpperCase()})`}
    >
      {/* Light mode Sun icon */}
      <Sun
        className={`w-4 h-4 text-amber-500 transition-all duration-300 transform ${
          resolvedTheme === 'dark'
            ? 'opacity-0 rotate-90 scale-0 absolute'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />

      {/* Dark mode Moon icon */}
      <Moon
        className={`w-4 h-4 text-cyan-400 transition-all duration-300 transform ${
          resolvedTheme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0 absolute'
        }`}
      />

      {/* Glow dot indicator */}
      <span
        className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full transition-colors duration-300 ${
          resolvedTheme === 'dark' ? 'bg-cyan-400 shadow-sm shadow-cyan-400/80' : 'bg-amber-400 shadow-sm shadow-amber-400/80'
        }`}
      />
    </button>
  );
};
