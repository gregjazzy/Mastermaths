'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, Clock, TrendingUp, Star, Filter, BookOpen, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface DS {
  id: string
  title: string
  description: string | null
  lycee: string
  niveau: string
  chapter: string
  difficulty: number
  duration: number | null
  pdfUrl: string | null
  correctionPdfUrl: string | null
  viewCount: number
  createdAt: string
}

export default function DSBanquePage() {
  const router = useRouter()
  const [dsList, setDsList] = useState<DS[]>([])
  const [filteredDS, setFilteredDS] = useState<DS[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClasse, setSelectedClasse] = useState<string>('all')
  const [selectedLycee, setSelectedLycee] = useState<string>('all')

  useEffect(() => {
    fetchDS()
  }, [])

  useEffect(() => {
    filterDS()
  }, [dsList, selectedClasse, selectedLycee])

  const fetchDS = async () => {
    try {
      const response = await fetch('/api/ds-banque')
      if (response.ok) {
        const data = await response.json()
        setDsList(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des DS:', error)
      toast.error('Erreur lors du chargement des DS')
    } finally {
      setLoading(false)
    }
  }

  const filterDS = () => {
    let filtered = [...dsList]

    // Filtre par classe
    if (selectedClasse !== 'all') {
      filtered = filtered.filter(ds => ds.niveau === selectedClasse)
    }

    // Filtre par lycée
    if (selectedLycee !== 'all') {
      const top5Lycees = ['Louis-le-Grand', 'Henri IV', 'Hoche', 'Stanislas', 'Fénelon']
      
      if (selectedLycee === 'top5') {
        filtered = filtered.filter(ds => top5Lycees.includes(ds.lycee))
      } else if (selectedLycee === 'autres') {
        filtered = filtered.filter(ds => !top5Lycees.includes(ds.lycee))
      }
    }

    setFilteredDS(filtered)
  }

  const handleDownload = async (dsId: string, title: string, url: string | null) => {
    if (!url) {
      toast.error('PDF non disponible')
      return
    }

    const loadingToast = toast.loading('📥 Téléchargement...')

    try {
      // Enregistrer le téléchargement
      await fetch('/api/ds-banque/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dsId })
      })

      // Ouvrir le PDF dans un nouvel onglet
      window.open(url, '_blank')
      
      toast.dismiss(loadingToast)
      toast.success('✅ DS ouvert !')
    } catch (error) {
      console.error('Erreur téléchargement:', error)
      toast.dismiss(loadingToast)
      toast.error('Erreur lors du téléchargement')
    }
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < difficulty ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ))
  }

  const uniqueLycees = Array.from(new Set(dsList.map(ds => ds.lycee)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-master-turquoise mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour</span>
        </button>

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-master-dark mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-master-turquoise" />
            Banque de DS
          </h1>
          <p className="text-gray-600">
            Accédez aux DS des meilleurs lycées de France : Louis-le-Grand, Henri IV, Hoche...
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">DS disponibles</p>
                <p className="text-2xl font-bold">{dsList.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Lycées partenaires</p>
                <p className="text-2xl font-bold">{uniqueLycees.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Consultations totales</p>
                <p className="text-2xl font-bold">
                  {dsList.reduce((sum, ds) => sum + ds.viewCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-master-turquoise" />
            <h2 className="font-bold text-lg">Filtres</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classe */}
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-master-turquoise focus:border-transparent"
            >
              <option value="all">Toutes les classes</option>
              <option value="Seconde">Seconde</option>
              <option value="Première">Première</option>
              <option value="Terminale">Terminale</option>
            </select>

            {/* Lycée */}
            <select
              value={selectedLycee}
              onChange={(e) => setSelectedLycee(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-master-turquoise focus:border-transparent"
            >
              <option value="all">Tous les lycées</option>
              <option value="top5">Top 5 Paris</option>
              <option value="autres">Autres</option>
            </select>
          </div>

          {(selectedClasse !== 'all' || selectedLycee !== 'all') && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredDS.length} résultat{filteredDS.length > 1 ? 's' : ''} trouvé{filteredDS.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Liste des DS */}
        {filteredDS.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun DS trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDS.map((ds) => (
              <div key={ds.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="p-3 bg-indigo-100 rounded-xl">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-master-dark mb-2">
                          {ds.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {ds.lycee}
                          </span>
                          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {ds.niveau}
                          </span>
                          <span className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                            {ds.chapter}
                          </span>
                          {ds.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {ds.duration} min
                            </span>
                          )}
                        </div>
                        {ds.description && (
                          <p className="text-gray-600 text-sm mb-2">{ds.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {ds.pdfUrl && (
                      <button
                        onClick={() => handleDownload(ds.id, ds.title, ds.pdfUrl)}
                        className="flex items-center gap-2 px-4 py-2 bg-master-turquoise text-white rounded-lg hover:bg-master-turquoise-dark transition-colors font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Sujet
                      </button>
                    )}
                    {ds.correctionPdfUrl && (
                      <button
                        onClick={() => handleDownload(ds.id, `${ds.title} - Corrigé`, ds.correctionPdfUrl)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Corrigé
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

