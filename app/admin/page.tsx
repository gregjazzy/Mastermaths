'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, FileText, List, Award, Plus, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    courses: 0,
    chapters: 0,
    lessons: 0,
    users: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-master-dark mb-2">
            ⚙️ Administration Master Maths
          </h1>
          <p className="text-gray-600">
            Gérez le contenu de la plateforme
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Cours</p>
                <p className="text-3xl font-bold">{stats.courses}</p>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Chapitres</p>
                <p className="text-3xl font-bold">{stats.chapters}</p>
              </div>
              <FileText className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Leçons</p>
                <p className="text-3xl font-bold">{stats.lessons}</p>
              </div>
              <List className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Utilisateurs</p>
                <p className="text-3xl font-bold">{stats.users}</p>
              </div>
              <Award className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gérer les cours */}
          <Link href="/admin/courses" className="card hover:shadow-lg transition-all border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-master-dark mb-1">Cours</h3>
                <p className="text-sm text-gray-600">Créer et gérer les cours</p>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          {/* Gérer les chapitres */}
          <Link href="/admin/chapters" className="card hover:shadow-lg transition-all border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-master-dark mb-1">Chapitres</h3>
                <p className="text-sm text-gray-600">Organiser les chapitres</p>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          {/* Gérer les leçons */}
          <Link href="/admin/lessons" className="card hover:shadow-lg transition-all border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <List className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-master-dark mb-1">Leçons</h3>
                <p className="text-sm text-gray-600">Ajouter vidéos et QCM</p>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          {/* Gérer les badges */}
          <Link href="/admin/badges" className="card hover:shadow-lg transition-all border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-master-dark mb-1">Badges</h3>
                <p className="text-sm text-gray-600">Personnaliser les badges</p>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          {/* Utilisateurs */}
          <Link href="/admin/users" className="card hover:shadow-lg transition-all border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                <Settings className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-master-dark mb-1">Utilisateurs</h3>
                <p className="text-sm text-gray-600">Gérer les comptes</p>
              </div>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          {/* Retour au dashboard */}
          <Link href="/dashboard" className="card hover:shadow-lg transition-all bg-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-700 mb-1">Retour</h3>
                <p className="text-sm text-gray-600">Dashboard élève</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Guide rapide */}
        <div className="card mt-8 bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-lg text-master-dark mb-4">
            📚 Guide rapide
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>1. Créer un cours</strong> → Aller dans "Cours" et cliquer sur "Nouveau cours"</p>
            <p><strong>2. Ajouter des chapitres</strong> → Dans "Chapitres", sélectionner le cours et créer des chapitres</p>
            <p><strong>3. Créer des sous-chapitres</strong> → Dans chaque chapitre, organiser en sous-sections</p>
            <p><strong>4. Ajouter des leçons</strong> → Dans "Leçons", ajouter vidéos (ID Vimeo), QCM, exercices</p>
            <p className="text-master-turquoise font-semibold">💡 Pour les vidéos : Uploadez d'abord sur Vimeo, puis copiez l'ID de la vidéo</p>
          </div>
        </div>
      </div>
    </div>
  )
}


