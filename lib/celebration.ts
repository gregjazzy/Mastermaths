import party from "party-js"

// ==================== TYPES ====================

export type CelebrationType = 'sparkles' | 'confetti' | 'stars' | 'mega'

export type BadgeLevel = 'bronze' | 'silver' | 'gold'

// ==================== CONFIGURATIONS ====================

const CONFETTI_CONFIG = {
  bronze: {
    count: 30,
    spread: 40,
    size: 1,
    shapes: ['circle', 'square'],
    colors: ['#CD7F32', '#E89B5E', '#F5B895'] // Couleurs bronze
  },
  silver: {
    count: 50,
    spread: 60,
    size: 1.2,
    shapes: ['circle', 'square', 'rectangle'],
    colors: ['#C0C0C0', '#D4D4D4', '#E8E8E8'] // Couleurs argent
  },
  gold: {
    count: 80,
    spread: 80,
    size: 1.5,
    shapes: ['circle', 'square', 'rectangle', 'roundedSquare'],
    colors: ['#FFD700', '#FFA500', '#FFEC8B'] // Couleurs or
  },
  mega: {
    count: 120,
    spread: 100,
    size: 2,
    shapes: ['circle', 'square', 'rectangle', 'roundedSquare'],
    colors: ['#00BCD4', '#38BDF8', '#0EA5E9', '#FFD700'] // Turquoise + Or
  }
}

// ==================== FONCTIONS PRINCIPALES ====================

/**
 * Déclenche des sparkles (étincelles) - Pour petites réussites
 */
export function triggerSparkles(element: HTMLElement | null, count: number = 20) {
  if (!element) return
  
  try {
    party.sparkles(element, {
      count,
      speed: 300,
      size: 1
    })
  } catch (error) {
    console.error('Erreur sparkles:', error)
  }
}

/**
 * Déclenche des confetti selon le niveau de badge
 */
export function triggerBadgeConfetti(
  element: HTMLElement | null, 
  level: BadgeLevel = 'bronze'
) {
  if (!element) return
  
  const config = CONFETTI_CONFIG[level]
  
  try {
    party.confetti(element, {
      count: config.count,
      spread: config.spread,
      shapes: config.shapes as any,
      size: party.variation.range(0.8 * config.size, 1.2 * config.size),
    })
  } catch (error) {
    console.error('Erreur confetti:', error)
  }
}

/**
 * Déclenche des stars (étoiles) - Pour accomplissements spéciaux
 */
export function triggerStars(element: HTMLElement | null, count: number = 30) {
  if (!element) return
  
  try {
    party.sparkles(element, {
      count,
      speed: 200,
      size: 1.5,
      // Forme étoile
      shapes: ['star']
    })
  } catch (error) {
    console.error('Erreur stars:', error)
  }
}

/**
 * Mega explosion - Pour accomplissements majeurs (chapitre complet, etc.)
 */
export function triggerMegaCelebration(element: HTMLElement | null) {
  if (!element) return
  
  const config = CONFETTI_CONFIG.mega
  
  try {
    // Première vague
    party.confetti(element, {
      count: config.count,
      spread: config.spread,
      shapes: config.shapes as any,
      size: party.variation.range(1, 2.5),
    })
    
    // Deuxième vague décalée
    setTimeout(() => {
      party.sparkles(element, {
        count: 50,
        speed: 400,
        size: 2
      })
    }, 200)
    
    // Troisième vague
    setTimeout(() => {
      party.confetti(element, {
        count: 60,
        spread: 70,
        shapes: ['circle', 'square'] as any,
        size: party.variation.range(0.8, 1.5),
      })
    }, 400)
  } catch (error) {
    console.error('Erreur mega celebration:', error)
  }
}

/**
 * Célébration selon le score QCM
 */
export function celebrateQcmScore(element: HTMLElement | null, score: number) {
  if (!element) return
  
  if (score === 100) {
    // Score parfait = Gold
    triggerBadgeConfetti(element, 'gold')
  } else if (score >= 90) {
    // Très bon score = Silver
    triggerBadgeConfetti(element, 'silver')
  } else if (score >= 80) {
    // Bon score = Bronze
    triggerBadgeConfetti(element, 'bronze')
  } else if (score >= 60) {
    // Score moyen = Sparkles
    triggerSparkles(element, 15)
  }
  // Sinon pas de célébration
}

/**
 * Célébration de complétion de leçon
 */
export function celebrateLessonComplete(element: HTMLElement | null) {
  if (!element) return
  triggerSparkles(element, 30)
}

/**
 * Célébration de streak
 */
export function celebrateStreak(element: HTMLElement | null, days: number) {
  if (!element) return
  
  if (days >= 30) {
    triggerMegaCelebration(element)
  } else if (days >= 7) {
    triggerBadgeConfetti(element, 'gold')
  } else {
    triggerSparkles(element, 20)
  }
}

/**
 * Célébration de chapitre complet
 */
export function celebrateChapterComplete(element: HTMLElement | null) {
  if (!element) return
  triggerMegaCelebration(element)
}

/**
 * Fonction utilitaire pour célébrer depuis le centre de l'écran
 */
export function celebrateFromCenter(type: CelebrationType = 'confetti') {
  const centerElement = document.createElement('div')
  centerElement.style.position = 'fixed'
  centerElement.style.top = '50%'
  centerElement.style.left = '50%'
  centerElement.style.transform = 'translate(-50%, -50%)'
  centerElement.style.pointerEvents = 'none'
  centerElement.style.zIndex = '9999'
  
  document.body.appendChild(centerElement)
  
  switch (type) {
    case 'sparkles':
      triggerSparkles(centerElement, 40)
      break
    case 'confetti':
      triggerBadgeConfetti(centerElement, 'gold')
      break
    case 'stars':
      triggerStars(centerElement, 40)
      break
    case 'mega':
      triggerMegaCelebration(centerElement)
      break
  }
  
  // Nettoyer après animation
  setTimeout(() => {
    document.body.removeChild(centerElement)
  }, 3000)
}

// ==================== SONS (optionnels) ====================

/**
 * Jouer un son de réussite (optionnel)
 * Vous pouvez ajouter des fichiers audio dans /public/sounds/
 */
export function playSuccessSound(level: 'small' | 'medium' | 'big' = 'medium') {
  // Si vous ajoutez des sons plus tard :
  // const audio = new Audio(`/sounds/success-${level}.mp3`)
  // audio.volume = 0.3
  // audio.play().catch(e => console.log('Audio play prevented:', e))
  
  // Pour l'instant, on peut utiliser l'API Web Audio pour un bip subtil
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Fréquences selon le niveau
    const frequencies = {
      small: 600,
      medium: 800,
      big: 1000
    }
    
    oscillator.frequency.value = frequencies[level]
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (error) {
    // Audio non disponible, pas grave
    console.log('Audio non disponible')
  }
}

