'use client'

import { useEffect, useState } from 'react'
import { Flame, Trophy, TrendingUp } from 'lucide-react'

interface StreakStats {
  currentStreak: number
  bestStreak: number
  daysInactive: number
}

export default function StreakDisplay() {
  const [stats, setStats] = useState<StreakStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStreakStats()
  }, [])

  const fetchStreakStats = async () => {
    try {
      const response = await fetch('/api/engagement/streak-stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement du streak:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) return null

  // Message selon le streak
  const getStreakMessage = () => {
    if (stats.currentStreak === 0) return "Connectez-vous quotidiennement pour débuter votre série !"
    if (stats.currentStreak === 1) return "Première connexion ! Revenez demain pour continuer."
    if (stats.currentStreak < 7) return "Vous êtes sur une belle lancée !"
    if (stats.currentStreak < 30) return "Régularité exemplaire !"
    return "Vous êtes un champion de la régularité !"
  }

  // Couleur selon le streak
  const getStreakColor = () => {
    if (stats.currentStreak === 0) return "from-gray-400 to-gray-500"
    if (stats.currentStreak < 7) return "from-orange-400 to-orange-500"
    if (stats.currentStreak < 30) return "from-red-500 to-red-600"
    return "from-purple-500 to-purple-600"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-master-dark flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          Série de connexions
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak actuel */}
        <div className={`bg-gradient-to-br ${getStreakColor()} rounded-xl p-6 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Série actuelle</span>
            <Flame className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-5xl font-bold mb-2">
            {stats.currentStreak}
          </div>
          <div className="text-sm opacity-90">
            jour{stats.currentStreak > 1 ? 's' : ''} consécutif{stats.currentStreak > 1 ? 's' : ''}
          </div>
        </div>

        {/* Meilleur streak */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Record personnel</span>
            <Trophy className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-5xl font-bold mb-2">
            {stats.bestStreak}
          </div>
          <div className="text-sm opacity-90">
            jour{stats.bestStreak > 1 ? 's' : ''} maximum
          </div>
        </div>
      </div>

      {/* Message de motivation */}
      <div className="mt-4 bg-gradient-to-r from-master-turquoise/10 to-master-blue/10 border border-master-turquoise/20 rounded-lg p-4">
        <p className="text-sm text-master-dark flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-master-turquoise" />
          <span className="font-semibold">{getStreakMessage()}</span>
        </p>
      </div>

      {/* Avertissement si inactif */}
      {stats.daysInactive > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-900">
            ⚠️ Vous ne vous êtes pas connecté depuis <strong>{stats.daysInactive} jour{stats.daysInactive > 1 ? 's' : ''}</strong>.
            {stats.currentStreak > 0 && (
              <span> Votre série de <strong>{stats.currentStreak}</strong> va bientôt être réinitialisée !</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}


