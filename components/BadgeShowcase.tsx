'use client'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: string
  masteryPoints: number
  isSecret: boolean
  unlockedAt?: Date
}

interface BadgeShowcaseProps {
  badges: Badge[]
  compact?: boolean
}

export default function BadgeShowcase({ badges, compact = false }: BadgeShowcaseProps) {
  
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500'
      case 'epic':
        return 'from-purple-400 to-pink-500'
      case 'rare':
        return 'from-blue-400 to-cyan-500'
      case 'secret':
        return 'from-gray-800 to-black'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return '✨ Légendaire'
      case 'epic':
        return '💜 Épique'
      case 'rare':
        return '💎 Rare'
      case 'secret':
        return '🔒 Secret'
      default:
        return 'Commun'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'text-orange-600'
      case 'epic':
        return 'text-purple-600'
      case 'rare':
        return 'text-blue-600'
      case 'secret':
        return 'text-gray-800'
      default:
        return 'text-gray-600'
    }
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 5).map((badge) => (
          <div
            key={badge.id}
            className="group relative"
            title={`${badge.name} - ${badge.description}`}
          >
            <div className={`
              w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)}
              flex items-center justify-center text-2xl
              border-2 border-white shadow-lg
              transform transition-transform hover:scale-110
            `}>
              {badge.icon}
            </div>
          </div>
        ))}
        {badges.length > 5 && (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            +{badges.length - 5}
          </div>
        )}
      </div>
    )
  }

  // Grouper les badges par rareté
  const badgesByRarity = badges.reduce((acc, badge) => {
    const rarity = badge.rarity.toLowerCase()
    if (!acc[rarity]) acc[rarity] = []
    acc[rarity].push(badge)
    return acc
  }, {} as Record<string, Badge[]>)

  // Ordre de rareté
  const rarityOrder = ['legendary', 'epic', 'rare', 'secret', 'common']

  return (
    <div className="space-y-6">
      {rarityOrder.map((rarity) => {
        const rarityBadges = badgesByRarity[rarity]
        if (!rarityBadges || rarityBadges.length === 0) return null

        return (
          <div key={rarity}>
            <h4 className={`font-semibold mb-3 ${getRarityTextColor(rarity)}`}>
              {getRarityLabel(rarity)} ({rarityBadges.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {rarityBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="group relative"
                >
                  {/* Badge card */}
                  <div className={`
                    bg-white rounded-xl p-4 border-2
                    shadow-md hover:shadow-xl transition-all
                    ${rarity === 'legendary' ? 'border-orange-300' : ''}
                    ${rarity === 'epic' ? 'border-purple-300' : ''}
                    ${rarity === 'rare' ? 'border-blue-300' : ''}
                    ${rarity === 'secret' ? 'border-gray-800' : ''}
                    ${rarity === 'common' ? 'border-gray-300' : ''}
                  `}>
                    {/* Badge icon with gradient background */}
                    <div className={`
                      w-16 h-16 mx-auto mb-3 rounded-full
                      bg-gradient-to-br ${getRarityColor(rarity)}
                      flex items-center justify-center text-4xl
                      border-2 border-white shadow-lg
                    `}>
                      {badge.icon}
                    </div>

                    {/* Badge name */}
                    <h5 className="font-bold text-sm text-center text-master-dark mb-1 line-clamp-2">
                      {badge.name}
                    </h5>

                    {/* Badge description */}
                    <p className="text-xs text-gray-600 text-center line-clamp-2 mb-2">
                      {badge.description}
                    </p>

                    {/* Badge points */}
                    <div className="text-center">
                      <span className="inline-block bg-master-turquoise/10 text-master-turquoise text-xs font-semibold px-2 py-1 rounded">
                        +{badge.masteryPoints} PMU
                      </span>
                    </div>

                    {/* Unlock date (if available) */}
                    {badge.unlockedAt && (
                      <div className="text-xs text-gray-400 text-center mt-2">
                        Débloqué le {new Date(badge.unlockedAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>

                  {/* Hover tooltip for more details */}
                  <div className="
                    absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2
                    opacity-0 group-hover:opacity-100 transition-opacity
                    pointer-events-none whitespace-nowrap z-10
                  ">
                    {badge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {badges.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🏅</div>
          <p className="font-semibold">Aucun badge débloqué</p>
          <p className="text-sm mt-2">Continuez à progresser pour obtenir vos premiers badges !</p>
        </div>
      )}
    </div>
  )
}


