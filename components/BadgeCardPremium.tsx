'use client'

import { useState, useEffect } from 'react'

interface BadgeCardPremiumProps {
  badgeId: string
  name: string
  level: 'APPRENTI' | 'CONFIRME' | 'EXPERT' | 'MAITRE' | 'VIRTUOSE'
  chapterName: string
  unlocked: boolean
  earnedAt?: Date
  customCSS?: string | null
  onClick?: () => void
}

/**
 * Composant d'affichage des badges Premium style Pokémon
 * Affiche soit le badge animé complet, soit une version "verrouillée"
 */
export default function BadgeCardPremium({
  badgeId,
  name,
  level,
  chapterName,
  unlocked,
  earnedAt,
  customCSS,
  onClick
}: BadgeCardPremiumProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Animation au premier affichage si débloqué
  useEffect(() => {
    if (unlocked) {
      setIsAnimating(true)
      // Réinitialiser l'animation après 6 secondes
      const timer = setTimeout(() => setIsAnimating(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [unlocked])

  // Badge verrouillé
  if (!unlocked) {
    return (
      <div 
        className="relative w-[250px] h-[350px] rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-600 flex flex-col items-center justify-center cursor-not-allowed opacity-50 transition-transform hover:scale-105"
        onClick={onClick}
      >
        {/* Icône cadenas */}
        <div className="text-6xl mb-4">🔒</div>
        
        {/* Titre niveau */}
        <div className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-2">
          {level}
        </div>
        
        {/* Nom du chapitre */}
        <div className="text-sm text-gray-500 text-center px-4">
          {chapterName}
        </div>
        
        {/* Condition de déblocage */}
        <div className="absolute bottom-4 text-xs text-gray-600 text-center px-4">
          Complétez les leçons pour débloquer
        </div>
      </div>
    )
  }

  // Badge débloqué avec CSS personnalisé
  return (
    <div 
      className="relative cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
      data-badge-id={badgeId}
    >
      {/* Container du badge avec animation */}
      <div 
        className={`badge-premium-container ${isAnimating ? 'animating' : ''}`}
        data-badge-id={badgeId}
      >
        {/* Le HTML du badge sera injecté via customCSS ou construit ici */}
        <div className="badge-custom-animation" data-badge-id={badgeId}>
          {/* Structure de base qui sera stylée par le CSS personnalisé */}
          <div className="badge-brand">Master Maths</div>
          <div className="badge-title">{level}</div>
          <div className="halo"></div>
          <div className="shine-flash"></div>
          
          {/* Particules d'explosion */}
          {[...Array(8)].map((_, i) => (
            <div key={`particle-${i}`} className="particle"></div>
          ))}
          
          {/* Particules flottantes */}
          {[...Array(getLevelParticleCount(level))].map((_, i) => (
            <div key={`floating-${i}`} className="particle floating-particle"></div>
          ))}
          
          {/* Étoiles selon le niveau */}
          {[...Array(getLevelStarCount(level))].map((_, i) => (
            <div key={`star-${i}`} className="star">
              {level === 'VIRTUOSE' ? '✨' : '⭐'}
            </div>
          ))}
          
          {/* God rays pour niveau MAITRE et VIRTUOSE */}
          {(level === 'MAITRE' || level === 'VIRTUOSE') && (
            <>
              {[...Array(level === 'VIRTUOSE' ? 12 : 6)].map((_, i) => (
                <div key={`ray-${i}`} className={level === 'VIRTUOSE' ? 'god-ray' : 'light-ray'}></div>
              ))}
            </>
          )}
          
          {/* Aura pour niveau VIRTUOSE */}
          {level === 'VIRTUOSE' && <div className="aura"></div>}
        </div>
      </div>
      
      {/* Info badge (visible au hover) */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100">
        <div className="text-center text-white p-4">
          <div className="text-lg font-bold mb-2">{chapterName}</div>
          <div className="text-sm opacity-90">{level}</div>
          {earnedAt && (
            <div className="text-xs opacity-70 mt-2">
              Obtenu le {new Date(earnedAt).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helpers
function getLevelParticleCount(level: string): number {
  switch(level) {
    case 'APPRENTI': return 6
    case 'CONFIRME': return 6
    case 'EXPERT': return 8
    case 'MAITRE': return 10
    case 'VIRTUOSE': return 12
    default: return 6
  }
}

function getLevelStarCount(level: string): number {
  switch(level) {
    case 'APPRENTI': return 0
    case 'CONFIRME': return 2
    case 'EXPERT': return 3
    case 'MAITRE': return 4
    case 'VIRTUOSE': return 5
    default: return 0
  }
}

