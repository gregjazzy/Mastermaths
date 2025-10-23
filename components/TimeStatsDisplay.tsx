'use client'

import { useState, useEffect } from 'react'
import { Clock, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

interface TimeStats {
  total: { minutes: number; hours: number; sessions: number }
  today: { minutes: number; hours: number; sessions: number }
  week: { minutes: number; hours: number; sessions: number }
  month: { minutes: number; hours: number; sessions: number }
  averages: { sessionMinutes: number; dayMinutes: number }
  activeDays: number
  last7Days: Array<{
    date: string
    dayName: string
    minutes: number
    sessions: number
  }>
}

export default function TimeStatsDisplay() {
  const [stats, setStats] = useState<TimeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimeStats()
  }, [])

  const fetchTimeStats = async () => {
    try {
      const response = await fetch('/api/engagement/time-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur chargement stats temps:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}min`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}min`
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <div className="card">
        <h3 className="text-xl font-bold text-master-dark mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-master-turquoise" />
          Temps de connexion
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Aujourd'hui */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-600 mb-1">Aujourd'hui</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatTime(stats.today.minutes)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {stats.today.sessions} session{stats.today.sessions > 1 ? 's' : ''}
            </p>
          </div>

          {/* Cette semaine */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-green-600 mb-1">Cette semaine</p>
            <p className="text-2xl font-bold text-green-700">
              {formatTime(stats.week.minutes)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats.week.sessions} sessions
            </p>
          </div>

          {/* Ce mois */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-purple-600 mb-1">Ce mois</p>
            <p className="text-2xl font-bold text-purple-700">
              {formatTime(stats.month.minutes)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {stats.month.sessions} sessions
            </p>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-orange-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-orange-700">
              {stats.total.hours}h
            </p>
            <p className="text-xs text-orange-600 mt-1">
              {stats.total.sessions} sessions
            </p>
          </div>
        </div>
      </div>

      {/* Moyennes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-br from-master-turquoise/10 to-master-blue/10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-master-turquoise" />
            <h4 className="font-semibold text-master-dark">Moyenne par session</h4>
          </div>
          <p className="text-3xl font-bold text-master-turquoise">
            {formatTime(stats.averages.sessionMinutes)}
          </p>
        </div>

        <div className="card bg-gradient-to-br from-master-blue/10 to-master-turquoise/10">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-master-blue" />
            <h4 className="font-semibold text-master-dark">Moyenne par jour actif</h4>
          </div>
          <p className="text-3xl font-bold text-master-blue">
            {formatTime(stats.averages.dayMinutes)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.activeDays} jours actifs
          </p>
        </div>
      </div>

      {/* Graphique des 7 derniers jours */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-master-turquoise" />
          <h4 className="font-semibold text-master-dark">7 derniers jours</h4>
        </div>

        <div className="flex items-end justify-between gap-2 h-40">
          {stats.last7Days.map((day, index) => {
            const maxMinutes = Math.max(...stats.last7Days.map(d => d.minutes), 1)
            const heightPercent = (day.minutes / maxMinutes) * 100

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  {day.minutes > 0 && (
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      {formatTime(day.minutes)}
                    </div>
                  )}
                  <div
                    className="w-full bg-gradient-to-t from-master-turquoise to-master-blue rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${heightPercent}%`, minHeight: day.minutes > 0 ? '10%' : '0%' }}
                    title={`${day.dayName}: ${formatTime(day.minutes)} (${day.sessions} sessions)`}
                  />
                </div>
                <div className="text-xs font-medium text-gray-600">{day.dayName}</div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            💡 Temps total cette semaine : <span className="font-bold text-master-dark">{formatTime(stats.week.minutes)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}


