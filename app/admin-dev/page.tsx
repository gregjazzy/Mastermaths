'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, FileText, Users, BarChart3, Settings, Video } from 'lucide-react'

export default function AdminDashboard() {
  const [stats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    completionRate: 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-master-dark">
            🎓 Admin Master Maths
          </h1>
          <Link href="/" className="text-master-turquoise hover:text-master-turquoise-dark">
            ← Retour au site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alert - Base de données requise */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Base de données non configurée
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Pour utiliser l'interface admin, vous devez d'abord configurer une base de données.</p>
                <p className="mt-2 font-semibold">Options :</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Supabase (gratuit) : Voir <code className="bg-yellow-100 px-1 rounded">DEPLOIEMENT_SUPABASE_NETLIFY.md</code></li>
                  <li>PostgreSQL local : <code className="bg-yellow-100 px-1 rounded">createdb mastermaths</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cours</p>
                <p className="text-3xl font-bold text-master-dark">{stats.totalCourses}</p>
              </div>
              <BookOpen className="w-12 h-12 text-master-turquoise opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Étudiants</p>
                <p className="text-3xl font-bold text-master-dark">{stats.totalStudents}</p>
              </div>
              <Users className="w-12 h-12 text-master-turquoise opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Leçons</p>
                <p className="text-3xl font-bold text-master-dark">{stats.totalLessons}</p>
              </div>
              <FileText className="w-12 h-12 text-master-turquoise opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Taux de complétion</p>
                <p className="text-3xl font-bold text-master-dark">{stats.completionRate}%</p>
              </div>
              <BarChart3 className="w-12 h-12 text-master-turquoise opacity-50" />
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <h2 className="text-xl font-bold text-master-dark mb-4">Gestion du contenu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cours */}
          <Link href="/admin/courses" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-master-turquoise/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-master-turquoise" />
              </div>
              <h3 className="text-lg font-semibold text-master-dark">Cours</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Créer et gérer les cours (Première, Terminale, etc.)
            </p>
          </Link>

          {/* Chapitres */}
          <Link href="/admin/chapters" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-master-turquoise/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-master-turquoise" />
              </div>
              <h3 className="text-lg font-semibold text-master-dark">Chapitres</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Organiser les chapitres et sous-chapitres
            </p>
          </Link>

          {/* Leçons */}
          <Link href="/admin/lessons" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-master-turquoise">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-master-turquoise/10 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-master-turquoise" />
              </div>
              <h3 className="text-lg font-semibold text-master-dark">Leçons & Exercices</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Ajouter des vidéos, exercices, QCM, corrections
            </p>
          </Link>
        </div>

        {/* Guide rapide */}
        <div className="mt-8 bg-master-dark rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Guide de configuration
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Configurer la base de données</h3>
              <p className="text-white/80 text-sm">
                Créez un fichier <code className="bg-white/20 px-2 py-1 rounded">.env</code> avec :
              </p>
              <pre className="bg-black/30 p-3 rounded mt-2 text-xs overflow-x-auto">
{`DATABASE_URL="postgresql://user:password@host:5432/mastermaths"
NEXTAUTH_SECRET="votre-secret-32-caracteres-minimum"
NEXTAUTH_URL="http://localhost:3002"`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Appliquer les migrations</h3>
              <pre className="bg-black/30 p-3 rounded text-xs">
npx prisma db push
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Créer un compte admin</h3>
              <p className="text-white/80 text-sm">
                Une fois la base configurée, inscrivez-vous sur <code className="bg-white/20 px-2 py-1 rounded">/auth/register</code>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Ajouter du contenu</h3>
              <p className="text-white/80 text-sm">
                Utilisez cette interface pour créer vos cours, chapitres et leçons !
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-white/80">
              📚 Documentation complète : <code className="bg-white/20 px-2 py-1 rounded">ADMIN_GUIDE.md</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


