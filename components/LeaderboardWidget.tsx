'use client'

import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  id: string
  name: string | null
  currentTitle: string | null
  totalMasteryPoints?: number
  monthlyMasteryPoints?: number
  weeklyMasteryPoints?: number
  connectionStreak?: number
  badgesCount?: number
  rank: number
}

interface LeaderboardWidgetProps {
  type: 'historical' | 'monthly' | 'weekly'
  limit?: number
  compact?: boolean
}

export default function LeaderboardWidget({ 
  type, 
  limit = 10,
  compact = false 
}: LeaderboardWidgetProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [type, limit])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leaderboard/${type}?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du classement')
      }

      const data = await response.json()
      setLeaderboard(data.leaderboard)
      
      if (type === 'monthly') {
        setPeriod(data.month)
      } else if (type === 'weekly') {
        setPeriod(data.week)
      }
    } catch (err: any) {
      console.error('Erreur leaderboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'historical':
        return '🏆 Hall of Fame Historique'
      case 'monthly':
        return '📅 Classement Mensuel'
      case 'weekly':
        return '⚡ Classement Hebdomadaire'
    }
  }

  const getPoints = (entry: LeaderboardEntry) => {
    switch (type) {
      case 'historical':
        return entry.totalMasteryPoints || 0
      case 'monthly':
        return entry.monthlyMasteryPoints || 0
      case 'weekly':
        return entry.weeklyMasteryPoints || 0
    }
  }

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-master-dark mb-1">
          {getTitle()}
        </h3>
        {period && (
          <p className="text-sm text-gray-500">{period}</p>
        )}
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.id}
            className={`
              flex items-center justify-between p-3 rounded-lg transition-all
              ${entry.rank <= 3 
                ? 'bg-gradient-to-r from-master-turquoise/10 to-master-blue/10 border border-master-turquoise/30' 
                : 'bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`
                font-bold text-lg
                ${entry.rank <= 3 ? 'text-2xl' : 'text-gray-500'}
              `}>
                {getRankEmoji(entry.rank)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-master-dark truncate">
                  {entry.name || 'Anonyme'}
                </div>
                {!compact && entry.currentTitle && (
                  <div className="text-xs text-gray-500 truncate">
                    {entry.currentTitle}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-master-turquoise">
                {getPoints(entry).toLocaleString()} PMU
              </div>
              {!compact && type === 'historical' && entry.badgesCount !== undefined && (
                <div className="text-xs text-gray-500">
                  {entry.badgesCount} badges
                </div>
              )}
              {!compact && type === 'historical' && entry.connectionStreak !== undefined && (
                <div className="text-xs text-gray-500">
                  🔥 {entry.connectionStreak} jours
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!compact && leaderboard.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun classement disponible pour le moment</p>
          <p className="text-sm mt-2">Soyez le premier à gagner des PMU !</p>
        </div>
      )}
    </div>
  )
}


