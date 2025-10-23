'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock,
  Trophy,
  Target,
  BookOpen,
  ChevronRight,
  Calendar
} from 'lucide-react'

interface ChildPerformance {
  childId: string
  childName: string
  childEmail: string
  status: string
  totalMasteryPoints: number
  monthlyMasteryPoints: number
  currentTitle: string
  connectionStreak: number
  bestStreak: number
  badgesUnlocked: number
  coursesEnrolled: number
  averageCompletion: number
  lastConnection: Date
}

export default function DashboardParent() {
  const [children, setChildren] = useState<ChildPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChildrenPerformances()
  }, [])

  const fetchChildrenPerformances = async () => {
    try {
      const response = await fetch('/api/dashboard/parent')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données')
      }

      const data = await response.json()
      setChildren(data.children || [])
    } catch (err: any) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatLastConnection = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
    return `Il y a ${Math.floor(days / 30)} mois`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-master-dark mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-master-turquoise" />
            Dashboard Parent
          </h1>
          <p className="text-gray-600">
            Suivez la progression de vos enfants sur Master Maths
          </p>
        </div>

        {/* Stats globales */}
        {children.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-gradient-to-br from-master-turquoise to-master-turquoise-dark text-white">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6" />
                <p className="text-sm opacity-90">Enfants inscrits</p>
              </div>
              <p className="text-3xl font-bold">{children.length}</p>
            </div>

            <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6" />
                <p className="text-sm opacity-90">Total PMU</p>
              </div>
              <p className="text-3xl font-bold">
                {children.reduce((sum, child) => sum + child.totalMasteryPoints, 0).toLocaleString()}
              </p>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6" />
                <p className="text-sm opacity-90">Moyenne progression</p>
              </div>
              <p className="text-3xl font-bold">
                {children.length > 0
                  ? Math.round(children.reduce((sum, child) => sum + child.averageCompletion, 0) / children.length)
                  : 0}%
              </p>
            </div>

            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6" />
                <p className="text-sm opacity-90">Total badges</p>
              </div>
              <p className="text-3xl font-bold">
                {children.reduce((sum, child) => sum + child.badgesUnlocked, 0)}
              </p>
            </div>
          </div>
        )}

        {/* Liste des enfants */}
        <div className="space-y-6">
          {children.map((child) => (
            <div key={child.childId} className="card hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-master-turquoise to-master-blue flex items-center justify-center text-white text-2xl font-bold">
                    {child.childName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-master-dark">{child.childName}</h2>
                    <p className="text-gray-600">{child.childEmail}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${child.status === 'PREMIUM' ? 'bg-amber-100 text-amber-800' : ''}
                        ${child.status === 'DEMO' ? 'bg-blue-100 text-blue-800' : ''}
                        ${child.status === 'FREE' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {child.status === 'PREMIUM' && '👑 Premium'}
                        {child.status === 'DEMO' && '⚡ Démo'}
                        {child.status === 'FREE' && '🆓 Gratuit'}
                      </span>
                      <span className="text-sm text-purple-600 font-semibold">
                        {child.currentTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-master-turquoise">
                    {child.totalMasteryPoints.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">PMU Total</div>
                </div>
              </div>

              {/* Stats de l'enfant */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <Trophy className="w-5 h-5" />
                    <span className="text-xs font-semibold">PMU ce mois</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {child.monthlyMasteryPoints.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-green-600">
                    <Target className="w-5 h-5" />
                    <span className="text-xs font-semibold">Progression</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{child.averageCompletion}%</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-semibold">Badges</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">{child.badgesUnlocked}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-purple-600">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs font-semibold">Cours</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{child.coursesEnrolled}</p>
                </div>
              </div>

              {/* Streak et dernière connexion */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Série actuelle</p>
                    <p className="text-xl font-bold text-master-dark">
                      🔥 {child.connectionStreak} jours
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Meilleur streak</p>
                    <p className="text-xl font-bold text-gray-700">
                      ⭐ {child.bestStreak} jours
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Dernière connexion
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatLastConnection(child.lastConnection)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/child/${child.childId}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Voir détails
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Aucun enfant */}
        {children.length === 0 && (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun enfant inscrit
            </h3>
            <p className="text-gray-600 mb-6">
              Ajoutez les adresses email de vos enfants pour suivre leur progression
            </p>
            <Link href="/settings" className="btn-primary">
              Ajouter un enfant
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


