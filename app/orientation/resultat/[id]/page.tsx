'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type BilanStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

interface Bilan {
  id: string
  status: BilanStatus
  resultat?: string
  errorMessage?: string
  createdAt: string
}

export default function ResultatBilanPage() {
  const params = useParams()
  const router = useRouter()
  const bilanId = params.id as string

  const [bilan, setBilan] = useState<Bilan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bilanId) return

    const fetchBilan = async () => {
      try {
        const response = await fetch(`/api/orientation/bilan/${bilanId}`)
        
        if (!response.ok) {
          throw new Error('Bilan introuvable')
        }

        const data = await response.json()
        setBilan(data)
        setLoading(false)

        // Si le bilan est en PENDING, rafraîchir toutes les 5 secondes
        if (data.status === 'PENDING') {
          setTimeout(fetchBilan, 5000)
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement')
        setLoading(false)
      }
    }

    fetchBilan()
  }, [bilanId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-master-turquoise animate-spin" />
      </div>
    )
  }

  if (error || !bilan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Bilan introuvable'}</p>
          <Link href="/dashboard" className="btn-primary">
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (bilan.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full card text-center">
          <div className="relative mb-6">
            <Clock className="w-20 h-20 text-purple-600 mx-auto animate-pulse" />
            <Loader2 className="w-8 h-8 text-master-turquoise animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Génération en cours... ⚙️
          </h1>
          
          <p className="text-gray-600 mb-8">
            Votre <strong>Bilan d'Orientation Personnalisé</strong> est en cours de génération par notre IA experte.
            <br />
            Cette opération prend généralement <strong>1 à 2 minutes</strong>.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-700">
              💡 <strong>Astuce :</strong> Vous pouvez fermer cette page en toute sécurité.
              <br />
              Vous recevrez un <strong>email de notification</strong> dès que votre bilan sera prêt !
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Rafraîchir
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Page créée le {new Date(bilan.createdAt).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    )
  }

  if (bilan.status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full card text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de génération</h1>
          <p className="text-gray-600 mb-4">
            Une erreur s'est produite lors de la génération de votre bilan.
          </p>
          {bilan.errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{bilan.errorMessage}</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">
            Veuillez contacter le support à <a href="mailto:contact@master-maths.com" className="text-purple-600 hover:underline">contact@master-maths.com</a>
          </p>
          <Link href="/dashboard" className="btn-primary">
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Status === COMPLETED
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Votre Bilan d'Orientation Personnalisé ✨
          </h1>
          <p className="text-gray-600">
            Généré le {new Date(bilan.createdAt).toLocaleString('fr-FR', { dateStyle: 'long' })}
          </p>
        </div>

        {/* Contenu du bilan */}
        <div className="card prose prose-purple max-w-none">
          <ReactMarkdown>{bilan.resultat || ''}</ReactMarkdown>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/dashboard" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary"
          >
            📄 Imprimer / PDF
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ce bilan reste accessible pendant 1 an dans votre espace personnel.
        </p>
      </div>
    </div>
  )
}

