'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Target, Download, Loader2, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

export default function ResultatBilanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const bilanId = params.bilanId as string

  const [loading, setLoading] = useState(true)
  const [bilan, setBilan] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchBilan()
    }
  }, [status, bilanId])

  const fetchBilan = async () => {
    try {
      const response = await fetch(`/api/orientation/bilan/${bilanId}`)
      
      if (response.ok) {
        const data = await response.json()
        setBilan(data.bilan)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Erreur lors du chargement')
        router.push('/orientation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
      router.push('/orientation')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    toast.error('Fonctionnalité en développement')
    // TODO: Générer un PDF avec le bilan
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (!bilan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center">
          <p className="text-gray-600">Bilan introuvable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="card mb-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">
                  Votre Bilan d'Orientation
                </h1>
                <p className="opacity-90 mt-1">
                  Piloté par IA • Triple Validation • Personnalisé
                </p>
              </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  Créé le {new Date(bilan.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </span>
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg">
                  <Clock className="w-4 h-4" />
                  Valide jusqu'au {new Date(bilan.expiresAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </span>
                <span className="flex items-center gap-2 bg-green-400/30 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Analyse complète
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
          </div>
        </div>

        {/* Bouton mobile pour télécharger */}
        <button
          onClick={handleDownloadPDF}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Télécharger PDF
        </button>

        {/* Contenu du bilan */}
        <div className="card prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-master-dark mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-master-dark mt-8 mb-4" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
              p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
            }}
          >
            {bilan.resultat}
          </ReactMarkdown>
        </div>

        {/* Avertissement de confidentialité */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900 mb-2">🔒 Confidentialité et Protection des Données (RGPD)</p>
              <ul className="text-xs text-gray-700 space-y-1 leading-relaxed">
                <li>✅ <strong>Données du questionnaire supprimées</strong> : Seul ce bilan final est conservé (sans données personnelles identifiables)</li>
                <li>✅ <strong>Aucun partage avec des tiers</strong> : Vos informations ne sont ni vendues, ni communiquées à des partenaires</li>
                <li>✅ <strong>Accès strictement personnel</strong> : Seul vous avez accès à ce bilan</li>
                <li>✅ <strong>Droit à l'oubli</strong> : Vous pouvez demander la suppression complète de votre bilan à tout moment en contactant le support</li>
                <li>📅 <strong>Validité</strong> : Ce bilan est valide 1 an à partir de sa date de création</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-outline"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

