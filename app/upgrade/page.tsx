'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function UpgradePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true)

    try {
      // Créer la session de checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      alert('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-master-dark via-master-blue to-master-turquoise py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-white hover:text-master-turquoise-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Passez au niveau supérieur
          </h1>
          <p className="text-xl text-white/90">
            Déverrouillez tout le contenu Master Maths et excellez en mathématiques
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Plan Gratuit */}
          <div className="card bg-white/95 backdrop-blur">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Gratuit</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">0€</div>
              <p className="text-gray-600">Découverte</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Accès au contenu marketing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Aperçu des cours</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full btn-outline opacity-50 cursor-not-allowed"
            >
              Plan actuel
            </button>
          </div>

          {/* Plan Démo */}
          <div className="card bg-white/95 backdrop-blur border-2 border-master-turquoise">
            <div className="text-center mb-6">
              <Zap className="w-12 h-12 text-master-turquoise mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-master-dark mb-2">Démo</h3>
              <div className="text-4xl font-bold text-master-dark mb-2">Gratuit</div>
              <p className="text-gray-600">Période d'essai</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Tout du plan Gratuit</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Accès à un cours complet</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">QCM et vidéos de correction</span>
              </li>
            </ul>

            <button
              onClick={() => router.push('/auth/register')}
              className="w-full btn-outline"
            >
              Demander l'accès démo
            </button>
          </div>

          {/* Plan Premium */}
          <div className="card bg-gradient-to-br from-master-turquoise to-master-turquoise-dark text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-master-dark px-4 py-1 text-sm font-bold rounded-bl-lg">
              POPULAIRE
            </div>

            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">29,99€</div>
              <p className="text-white/90">Par mois</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>Tout du plan Démo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>Accès illimité à tous les cours</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>Tous les QCM et exercices</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>Vidéos de correction</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>Suivi de performance détaillé</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span>Support prioritaire</span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('price_premium_monthly')}
              disabled={isLoading}
              className="w-full bg-white text-master-turquoise hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : 'Passer à Premium'}
            </button>
          </div>
        </div>

        <div className="text-center text-white/90">
          <p className="text-sm">
            Paiement sécurisé par Stripe • Annulation à tout moment • Garantie satisfait ou remboursé 14 jours
          </p>
        </div>
      </div>
    </div>
  )
}


