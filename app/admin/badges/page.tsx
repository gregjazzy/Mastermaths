'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Save, X, Award, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: string
  masteryPointsRequired: number
  masteryPoints: number
  order: number
  animationType?: string
  animationColor?: string
  glowIntensity?: string
}

const ANIMATION_PRESETS = [
  { value: 'none', label: 'Aucune', description: 'Badge statique' },
  { value: 'pulse', label: 'Pulse', description: 'Pulsation douce' },
  { value: 'glow', label: 'Glow', description: 'Lueur brillante' },
  { value: 'bounce', label: 'Bounce', description: 'Rebond léger' },
  { value: 'shake', label: 'Shake', description: 'Tremblement' },
  { value: 'rotate', label: 'Rotate', description: 'Rotation 360°' },
  { value: 'float', label: 'Float', description: 'Flottement vertical' },
  { value: 'shimmer', label: 'Shimmer', description: 'Éclat lumineux' },
]

const COLOR_PRESETS = [
  { value: 'gold', label: 'Or', class: 'from-yellow-400 to-yellow-600' },
  { value: 'silver', label: 'Argent', class: 'from-gray-300 to-gray-500' },
  { value: 'bronze', label: 'Bronze', class: 'from-orange-400 to-orange-600' },
  { value: 'purple', label: 'Violet', class: 'from-purple-400 to-purple-600' },
  { value: 'blue', label: 'Bleu', class: 'from-blue-400 to-blue-600' },
  { value: 'green', label: 'Vert', class: 'from-green-400 to-green-600' },
  { value: 'red', label: 'Rouge', class: 'from-red-400 to-red-600' },
  { value: 'rainbow', label: 'Arc-en-ciel', class: 'from-pink-400 via-purple-400 to-blue-400' },
]

const GLOW_INTENSITY = [
  { value: 'low', label: 'Faible', class: 'shadow-sm' },
  { value: 'medium', label: 'Moyen', class: 'shadow-md' },
  { value: 'high', label: 'Fort', class: 'shadow-lg shadow-yellow-500/50' },
  { value: 'ultra', label: 'Ultra', class: 'shadow-2xl shadow-yellow-500/70' },
]

export default function BadgesAdminPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null)
  const [previewAnimation, setPreviewAnimation] = useState(false)

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/admin/badges')
      if (response.ok) {
        const data = await response.json()
        setBadges(data.badges || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement badges')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingBadge) return

    try {
      const response = await fetch(`/api/admin/badges/${editingBadge.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animationType: editingBadge.animationType,
          animationColor: editingBadge.animationColor,
          glowIntensity: editingBadge.glowIntensity,
        })
      })

      if (response.ok) {
        await fetchBadges()
        setEditingBadge(null)
        toast.success('Badge mis à jour !')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const getAnimationClass = (type?: string) => {
    switch (type) {
      case 'pulse': return 'animate-pulse'
      case 'bounce': return 'animate-bounce'
      case 'rotate': return 'animate-spin'
      case 'float': return 'animate-float'
      case 'shake': return 'animate-shake'
      case 'shimmer': return 'animate-shimmer'
      case 'glow': return 'animate-glow'
      default: return ''
    }
  }

  const getColorClass = (color?: string) => {
    return COLOR_PRESETS.find(c => c.value === color)?.class || 'from-gray-400 to-gray-600'
  }

  const getGlowClass = (intensity?: string) => {
    return GLOW_INTENSITY.find(g => g.value === intensity)?.class || 'shadow-md'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
            <h1 className="text-3xl font-bold text-master-dark flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              Gestion des Badges
            </h1>
            <p className="text-gray-600 mt-2">
              Personnalisez les animations et couleurs des badges
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Liste des badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div key={badge.id} className="card hover:shadow-lg transition-all">
                  {/* Preview du badge */}
                  <div className="flex items-center justify-center mb-4 py-6">
                    <div 
                      className={`
                        w-24 h-24 rounded-full flex items-center justify-center text-4xl
                        bg-gradient-to-br ${getColorClass(badge.animationColor)}
                        ${getAnimationClass(badge.animationType)}
                        ${getGlowClass(badge.glowIntensity)}
                        transition-all
                      `}
                    >
                      {badge.icon}
                    </div>
                  </div>

                  {/* Infos */}
                  <h3 className="font-bold text-lg text-master-dark mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  
                  {/* Config actuelle */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <div>
                      <span className="font-semibold">Animation:</span>{' '}
                      {ANIMATION_PRESETS.find(a => a.value === badge.animationType)?.label || 'Aucune'}
                    </div>
                    <div>
                      <span className="font-semibold">Couleur:</span>{' '}
                      {COLOR_PRESETS.find(c => c.value === badge.animationColor)?.label || 'Gris'}
                    </div>
                    <div>
                      <span className="font-semibold">Lueur:</span>{' '}
                      {GLOW_INTENSITY.find(g => g.value === badge.glowIntensity)?.label || 'Moyen'}
                    </div>
                  </div>

                  {/* Bouton éditer */}
                  <button
                    onClick={() => setEditingBadge(badge)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Personnaliser
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal d'édition */}
        {editingBadge && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-master-dark flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    Personnaliser : {editingBadge.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingBadge(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Preview en direct */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 text-center">
                    <p className="text-sm text-gray-600 mb-4 font-semibold">Prévisualisation en direct</p>
                    <div 
                      className={`
                        w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl
                        bg-gradient-to-br ${getColorClass(editingBadge.animationColor)}
                        ${getAnimationClass(editingBadge.animationType)}
                        ${getGlowClass(editingBadge.glowIntensity)}
                        transition-all
                      `}
                    >
                      {editingBadge.icon}
                    </div>
                  </div>

                  {/* Type d'animation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type d'animation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ANIMATION_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setEditingBadge({
                            ...editingBadge,
                            animationType: preset.value
                          })}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            editingBadge.animationType === preset.value
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold text-sm">{preset.label}</div>
                          <div className="text-xs text-gray-500">{preset.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Couleur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Couleur du dégradé
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setEditingBadge({
                            ...editingBadge,
                            animationColor: color.value
                          })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            editingBadge.animationColor === color.value
                              ? 'border-purple-600 scale-110'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${color.class} mb-2`}></div>
                          <div className="text-xs font-medium text-center">{color.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intensité lueur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Intensité de la lueur
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {GLOW_INTENSITY.map((glow) => (
                        <button
                          key={glow.value}
                          type="button"
                          onClick={() => setEditingBadge({
                            ...editingBadge,
                            glowIntensity: glow.value
                          })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            editingBadge.glowIntensity === glow.value
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-semibold text-center">{glow.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingBadge(null)}
                    className="flex-1 btn-outline"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.5); }
          50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.8); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

