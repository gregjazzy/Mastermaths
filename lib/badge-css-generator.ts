/**
 * Générateur de CSS consolidé pour les badges
 * Optimise la performance en regroupant tous les CSS personnalisés dans un seul fichier
 */

interface Badge {
  id: string
  name: string
  customCSS?: string | null
  useCustomCSS?: boolean | null
}

/**
 * Génère un fichier CSS unique contenant tous les styles personnalisés des badges
 * @param badges Liste des badges avec CSS personnalisé
 * @returns String CSS prêt à être injecté dans une balise <style>
 */
export function generateAllBadgesCSS(badges: Badge[]): string {
  const customBadges = badges.filter(badge => badge.useCustomCSS && badge.customCSS)
  
  if (customBadges.length === 0) {
    return ''
  }

  return customBadges
    .map(badge => `
/* ============================================
   Badge: ${badge.name}
   ID: ${badge.id}
   ============================================ */
[data-badge-id="${badge.id}"].badge-custom-animation {
  ${badge.customCSS}
}
`)
    .join('\n\n')
}

/**
 * Génère le CSS pour un seul badge (utilisé dans l'admin pour le preview)
 * @param badge Badge avec CSS personnalisé
 * @returns String CSS pour ce badge uniquement
 */
export function generateSingleBadgeCSS(badge: Badge): string {
  if (!badge.useCustomCSS || !badge.customCSS) {
    return ''
  }

  return `
[data-badge-id="${badge.id}"].badge-custom-animation {
  ${badge.customCSS}
}
`
}

