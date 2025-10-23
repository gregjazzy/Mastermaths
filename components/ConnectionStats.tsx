'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, TrendingUp, Zap } from 'lucide-react'

interface ConnectionStats {
  today: number
  thisWeek: number
  total: number
  last7Days: Array<{ date: string; count: number }>
}

export default function ConnectionStats() {
  const [stats, setStats] = useState<ConnectionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConnectionStats()
  }, [])

  const fetchConnectionStats = async () => {
    try {
      const response = await fetch('/api/engagement/connection-history')
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Connexions aujourd'hui */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Aujourd'hui</p>
            <p className="text-3xl font-bold">{stats.today}</p>
            <p className="text-xs opacity-80 mt-1">connexion{stats.today > 1 ? 's' : ''}</p>
          </div>
          <Calendar className="w-10 h-10 opacity-80" />
        </div>
      </div>

      {/* Connexions cette semaine */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Cette semaine</p>
            <p className="text-3xl font-bold">{stats.thisWeek}</p>
            <p className="text-xs opacity-80 mt-1">connexion{stats.thisWeek > 1 ? 's' : ''}</p>
          </div>
          <TrendingUp className="w-10 h-10 opacity-80" />
        </div>
      </div>

      {/* Total connexions */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Total</p>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-xs opacity-80 mt-1">connexion{stats.total > 1 ? 's' : ''}</p>
          </div>
          <Zap className="w-10 h-10 opacity-80" />
        </div>
      </div>
    </div>
  )
}


