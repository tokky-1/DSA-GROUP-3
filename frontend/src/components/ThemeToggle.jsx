import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ theme, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-xl
                 bg-brand-50 dark:bg-gray-800 text-brand-600 dark:text-gray-300
                 hover:bg-brand-100 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
