'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface BadgeEarned {
  type: 'LESSON' | 'CHAPTER' | 'COURSE'
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'COMPLETED' | 'MASTERED' | 'GRADUATE' | 'EXCELLENCE'
  entityName: string
  pmuAwarded?: number
  score?: number
}

interface BadgePopupProps {
  badge: BadgeEarned | null
  onClose: () => void
}

const getMedalEmoji = (level: string) => {
  switch (level) {
    case 'BRONZE': return '🥉'
    case 'SILVER': return '🥈'
    case 'GOLD': return '🥇'
    case 'COMPLETED': return '✅'
    case 'MASTERED': return '⭐'
    case 'GRADUATE': return '🎓'
    case 'EXCELLENCE': return '👑'
    default: return '🏆'
  }
}

const getLevelName = (level: string) => {
  switch (level) {
    case 'BRONZE': return 'Médaille BRONZE'
    case 'SILVER': return 'Médaille ARGENT'
    case 'GOLD': return 'Médaille OR'
    case 'COMPLETED': return 'Chapitre Complété'
    case 'MASTERED': return 'Chapitre Maîtrisé'
    case 'GRADUATE': return 'Cours Diplômé'
    case 'EXCELLENCE': return 'Excellence'
    default: return 'Badge'
  }
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'BRONZE': return 'from-amber-600 to-amber-800'
    case 'SILVER': return 'from-gray-300 to-gray-500'
    case 'GOLD': return 'from-yellow-400 to-yellow-600'
    case 'COMPLETED': return 'from-green-400 to-green-600'
    case 'MASTERED': return 'from-purple-400 to-purple-600'
    case 'GRADUATE': return 'from-blue-400 to-blue-600'
    case 'EXCELLENCE': return 'from-pink-400 to-pink-600'
    default: return 'from-gray-400 to-gray-600'
  }
}

export default function BadgePopup({ badge, onClose }: BadgePopupProps) {
  const [show, setShow] = useState(false)
  const [confetti, setConfetti] = useState<boolean>(false)

  useEffect(() => {
    if (badge) {
      setShow(true)
      setConfetti(true)
      
      // Animation confetti
      setTimeout(() => setConfetti(false), 3000)
    } else {
      setShow(false)
    }
  }, [badge])

  if (!badge || !show) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti animation */}
          {confetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8 text-center relative">
            {/* Emojis de célébration */}
            <div className="text-4xl mb-4 animate-bounce">
              🎊 ✨ 🎊
            </div>

            {/* Médaille/Badge */}
            <div className={`inline-block p-8 rounded-full bg-gradient-to-br ${getLevelColor(badge.level)} shadow-lg mb-6 animate-scale-in`}>
              <div className="text-8xl animate-wiggle">
                {getMedalEmoji(badge.level)}
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              NOUVEAU BADGE !
            </h2>

            {/* Nom de la leçon/chapitre/cours */}
            <p className="text-xl text-gray-700 mb-4 font-semibold">
              "{badge.entityName}"
            </p>

            {/* Niveau du badge */}
            <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getLevelColor(badge.level)} text-white font-bold text-lg mb-4 shadow-md`}>
              {getLevelName(badge.level)}
            </div>

            {/* Score (pour les badges de leçon) */}
            {badge.score !== undefined && (
              <p className="text-gray-600 mb-4">
                Score : <span className="font-bold text-2xl">{badge.score}%</span>
              </p>
            )}

            {/* PMU gagnés */}
            {badge.pmuAwarded && badge.pmuAwarded > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 font-bold text-2xl">
                  + {badge.pmuAwarded} PMU
                </p>
                <p className="text-blue-700 text-sm">Points de Maîtrise gagnés !</p>
              </div>
            )}

            {/* Bouton */}
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

