'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState, useRef, useEffect } from 'react'

export default function ThemeToggle() {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Gérer le cas où le ThemeProvider n'est pas disponible
  let theme: 'light' | 'dark' | 'system' = 'system'
  let resolvedTheme: 'light' | 'dark' = 'light'
  let setTheme: (theme: 'light' | 'dark' | 'system') => void = () => {}
  
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
    resolvedTheme = themeContext.resolvedTheme
    setTheme = themeContext.setTheme
  } catch (error) {
    // ThemeProvider pas disponible - mode silencieux
    console.warn('ThemeProvider not available, using default theme')
    return null // Ne pas afficher le toggle si pas de provider
  }

  // Fermer le menu si on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themes = [
    { value: 'light' as const, label: 'Clair', icon: Sun },
    { value: 'dark' as const, label: 'Sombre', icon: Moon },
    { value: 'system' as const, label: 'Système', icon: Monitor },
  ]

  const currentIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton principal */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-master-turquoise 
          dark:hover:text-master-turquoise hover:bg-gray-100 dark:hover:bg-gray-700 
          rounded-lg transition-all"
        title={`Thème: ${theme === 'system' ? 'Système' : theme === 'dark' ? 'Sombre' : 'Clair'}`}
        aria-label="Changer le thème"
      >
        {currentIcon === Moon ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>

      {/* Menu déroulant */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg 
          shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50
          animate-in fade-in slide-in-from-top-2 duration-200">
          {themes.map((t) => {
            const Icon = t.icon
            const isActive = theme === t.value
            
            return (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value)
                  setShowMenu(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                  ${isActive 
                    ? 'bg-master-turquoise/10 text-master-turquoise dark:bg-master-turquoise/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {isActive && (
                  <span className="ml-auto text-master-turquoise">✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

