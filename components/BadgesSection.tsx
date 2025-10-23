'use client'

import { useEffect, useState } from 'react'
import { Award, Trophy, Star, Zap, Target, Crown } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  type: string
  criteria: any
}

export default function BadgesSection() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/engagement/badges')
      const data = await response.json()
      setBadges(data.badges || [])
    } catch (error) {
      console.error('Erreur lors du chargement des badges:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return <Zap className="w-8 h-8" />
      case 'performance':
        return <Trophy className="w-8 h-8" />
      case 'completion':
        return <Target className="w-8 h-8" />
      case 'perfect':
        return <Star className="w-8 h-8" />
      case 'master':
        return <Crown className="w-8 h-8" />
      default:
        return <Award className="w-8 h-8" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'connection':
        return 'from-blue-500 to-blue-600'
      case 'performance':
        return 'from-yellow-500 to-yellow-600'
      case 'completion':
        return 'from-green-500 to-green-600'
      case 'perfect':
        return 'from-purple-500 to-purple-600'
      case 'master':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-master-dark mb-6 flex items-center gap-3">
          <Award className="w-7 h-7 text-master-turquoise" />
          Mes Badges
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-master-dark flex items-center gap-3">
          <Award className="w-7 h-7 text-master-turquoise" />
          Mes Badges
        </h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-master-turquoise">
            {badges.length}
          </div>
          <div className="text-sm text-gray-600">Badge{badges.length > 1 ? 's' : ''} obtenu{badges.length > 1 ? 's' : ''}</div>
        </div>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun badge pour le moment
          </h3>
          <p className="text-gray-600">
            Continuez à travailler et à vous connecter pour débloquer vos premiers badges !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-master-turquoise transition-all hover:shadow-lg group"
            >
              {/* Badge Icon avec gradient */}
              <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${getBadgeColor(badge.type)} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {getBadgeIcon(badge.type)}
              </div>

              {/* Contenu du badge */}
              <div className="pr-8">
                <h3 className="text-lg font-bold text-master-dark mb-2">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {badge.description}
                </p>

                {/* Critères */}
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  {badge.criteria.connection_days_count && (
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span>{badge.criteria.connection_days_count} jours de connexion</span>
                    </div>
                  )}
                  {badge.criteria.quiz_success_rate && (
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span>{badge.criteria.quiz_success_rate}% de réussite aux QCM</span>
                    </div>
                  )}
                  {badge.criteria.lessons_completed && (
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-3 h-3 text-green-500" />
                      <span>{badge.criteria.lessons_completed} leçons complétées</span>
                    </div>
                  )}
                  {badge.criteria.perfect_qcm_count && (
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-purple-500" />
                      <span>{badge.criteria.perfect_qcm_count} QCM parfaits</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Message d'encouragement */}
      <div className="mt-6 bg-gradient-to-r from-master-turquoise/10 to-master-blue/10 border border-master-turquoise/20 rounded-lg p-4">
        <p className="text-sm text-master-dark">
          <span className="font-semibold">💡 Astuce :</span> Connectez-vous régulièrement et complétez vos leçons pour débloquer de nouveaux badges !
        </p>
      </div>
    </div>
  )
}


