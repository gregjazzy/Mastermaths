'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Calendar, Clock, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Live {
  id: string
  title: string
  description: string | null
  niveau: string
  theme: string
  scheduledAt: string
  duration: number
  everwebinarUrl: string
  isActive: boolean
}

export default function LivesPage() {
  const router = useRouter()
  const [lives, setLives] = useState<{ [key: string]: Live[] }>({
    Seconde: [],
    Première: [],
    Terminale: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLives()
  }, [])

  const fetchLives = async () => {
    try {
      const response = await fetch('/api/lives')
      if (response.ok) {
        const data = await response.json()
        
        // Organiser par niveau
        const organized: { [key: string]: Live[] } = {
          Seconde: [],
          Première: [],
          Terminale: []
        }
        
        data.forEach((live: Live) => {
          if (organized[live.niveau]) {
            organized[live.niveau].push(live)
          }
        })
        
        setLives(organized)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des lives:', error)
      toast.error('Erreur lors du chargement des lives')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  const handleJoinLive = (url: string, title: string) => {
    window.open(url, '_blank')
    toast.success(`🎥 Ouverture du live : ${title}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  const niveaux = ['Seconde', 'Première', 'Terminale']

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
            <Video className="w-8 h-8 text-red-600" />
            Lives Hebdomadaires
          </h1>
          <p className="text-gray-600">
            Rejoignez nos cours en direct chaque semaine. Sessions interactives avec Q&A en temps réel.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Lives programmés</p>
                <p className="text-2xl font-bold">
                  {Object.values(lives).flat().filter(l => isUpcoming(l.scheduledAt)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Niveaux disponibles</p>
                <p className="text-2xl font-bold">{niveaux.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Fréquence</p>
                <p className="text-2xl font-bold">Hebdo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lives par niveau */}
        {niveaux.map((niveau) => (
          <div key={niveau} className="mb-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-master-dark mb-6 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  niveau === 'Seconde' ? 'bg-blue-500' :
                  niveau === 'Première' ? 'bg-purple-500' :
                  'bg-red-500'
                }`} />
                {niveau}
              </h2>

              {lives[niveau].length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun live programmé pour le moment</p>
                  <p className="text-sm mt-2">Les prochaines dates seront bientôt annoncées</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {lives[niveau].map((live) => {
                    const upcoming = isUpcoming(live.scheduledAt)
                    return (
                      <div
                        key={live.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          upcoming
                            ? 'border-red-500 bg-red-50 hover:shadow-lg'
                            : 'border-gray-200 bg-white opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {upcoming && (
                                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                  À VENIR
                                </span>
                              )}
                              {!upcoming && (
                                <span className="px-3 py-1 bg-gray-400 text-white text-xs font-bold rounded-full">
                                  TERMINÉ
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-bold text-master-dark mb-2">
                              {live.title}
                            </h3>

                            {live.description && (
                              <p className="text-gray-600 mb-4">{live.description}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-red-600" />
                                <span className="font-medium">{formatDate(live.scheduledAt)}</span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-red-600" />
                                <span>{live.duration} minutes</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium text-xs">
                                  {live.theme}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bouton rejoindre */}
                          {upcoming && (
                            <button
                              onClick={() => handleJoinLive(live.everwebinarUrl, live.title)}
                              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
                            >
                              <ExternalLink className="w-5 h-5" />
                              Rejoindre
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Message si aucun live */}
        {Object.values(lives).flat().length === 0 && (
          <div className="card text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun live programmé
            </h3>
            <p className="text-gray-600">
              Les prochaines sessions seront bientôt annoncées. Restez connecté !
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

