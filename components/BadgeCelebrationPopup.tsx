'use client'

import { useEffect, useState } from 'react'
import { Award, X, TrendingUp } from 'lucide-react'
import { triggerBadgeConfetti, triggerMegaCelebration, playSuccessSound } from '@/lib/celebration'

// ==================== INTERFACES ====================

export interface BadgeEarned {
  emoji: string
  level: 'bronze' | 'silver' | 'gold'
  title: string
  description: string
  pmu: number
}

interface BadgeCelebrationPopupProps {
  badge: BadgeEarned | null
  onClose: () => void
  type?: 'lesson' | 'exercise' | 'chapter'
}

// ==================== COMPOSANT PRINCIPAL ====================

export default function BadgeCelebrationPopup({ 
  badge, 
  onClose,
  type = 'lesson' 
}: BadgeCelebrationPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (badge) {
      setIsVisible(true)
      
      // Déclencher la célébration après un court délai (pour l'animation d'entrée)
      setTimeout(() => {
        if (popupElement) {
          // Célébration selon le niveau
          if (type === 'chapter') {
            triggerMegaCelebration(popupElement)
            playSuccessSound('big')
          } else if (badge.level === 'gold') {
            triggerBadgeConfetti(popupElement, 'gold')
            playSuccessSound('big')
          } else if (badge.level === 'silver') {
            triggerBadgeConfetti(popupElement, 'silver')
            playSuccessSound('medium')
          } else {
            triggerBadgeConfetti(popupElement, 'bronze')
            playSuccessSound('small')
          }
        }
      }, 300)

      // Auto-fermeture après 5 secondes
      const timer = setTimeout(() => {
        handleClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [badge, popupElement])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Temps de l'animation de sortie
  }

  if (!badge) return null

  // Couleurs selon le niveau
  const getLevelColors = () => {
    switch (badge.level) {
      case 'gold':
        return {
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-300',
          badge: 'bg-gradient-to-br from-yellow-400 to-amber-500',
          text: 'text-yellow-900',
          glow: 'shadow-yellow-200'
        }
      case 'silver':
        return {
          bg: 'from-gray-50 to-slate-50',
          border: 'border-gray-300',
          badge: 'bg-gradient-to-br from-gray-300 to-slate-400',
          text: 'text-gray-900',
          glow: 'shadow-gray-200'
        }
      case 'bronze':
        return {
          bg: 'from-orange-50 to-amber-50',
          border: 'border-orange-300',
          badge: 'bg-gradient-to-br from-orange-400 to-amber-600',
          text: 'text-orange-900',
          glow: 'shadow-orange-200'
        }
    }
  }

  const colors = getLevelColors()

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div 
        ref={setPopupElement}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
          transition-all duration-300 ${
          isVisible 
            ? 'scale-100 opacity-100' 
            : 'scale-50 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl border-4 ${colors.border} 
          shadow-2xl ${colors.glow} p-8 max-w-md w-screen mx-4 relative overflow-hidden`}>
          
          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Contenu */}
          <div className="text-center">
            {/* Badge avec animation */}
            <div className={`inline-block p-6 rounded-full ${colors.badge} ${colors.glow} 
              shadow-xl mb-4 animate-bounce`}>
              <span className="text-6xl">{badge.emoji}</span>
            </div>

            {/* Titre */}
            <h2 className={`text-3xl font-bold mb-2 ${colors.text}`}>
              {badge.title}
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-lg mb-4">
              {badge.description}
            </p>

            {/* PMU gagnés */}
            <div className="flex items-center justify-center gap-2 bg-white bg-opacity-50 
              rounded-full px-6 py-3 mb-4">
              <TrendingUp className="w-5 h-5 text-master-turquoise" />
              <span className="font-bold text-xl text-master-turquoise">
                +{badge.pmu} PMU
              </span>
            </div>

            {/* Message d'encouragement */}
            <p className="text-sm text-gray-600 italic">
              {getEncouragementMessage(badge.level, type)}
            </p>
          </div>

          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
            opacity-20 animate-shine pointer-events-none" />
        </div>
      </div>

      {/* CSS pour l'animation de brillance */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

// ==================== HELPER FUNCTIONS ====================

function getEncouragementMessage(level: 'bronze' | 'silver' | 'gold', type: string): string {
  const messages = {
    bronze: [
      "Excellent début ! Continue comme ça ! 💪",
      "Tu es sur la bonne voie ! 🎯",
      "Bravo pour ta persévérance ! 🌟"
    ],
    silver: [
      "Impressionnant ! Tu maîtrises bien le sujet ! 🚀",
      "Superbe performance ! 🎊",
      "Tu t'approches de la perfection ! ⭐"
    ],
    gold: [
      "PARFAIT ! Tu es un champion ! 🏆",
      "Score PARFAIT ! Incroyable ! 🎉",
      "Maîtrise totale ! Tu es au top ! 👑"
    ]
  }

  if (type === 'chapter') {
    return "Chapitre complété ! Tu progresses à une vitesse incroyable ! 🚀🎓"
  }

  const levelMessages = messages[level]
  return levelMessages[Math.floor(Math.random() * levelMessages.length)]
}

