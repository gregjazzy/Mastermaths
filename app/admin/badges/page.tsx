'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Save, X, Award, Sparkles, Trash2 } from 'lucide-react'
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
  customCSS?: string
  useCustomCSS?: boolean
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
  const [isCreating, setIsCreating] = useState(false)
  const [previewAnimation, setPreviewAnimation] = useState(false)
  const [cssContent, setCssContent] = useState('')

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
      const url = isCreating 
        ? '/api/admin/badges'
        : `/api/admin/badges/${editingBadge.id}`
      
      const response = await fetch(url, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingBadge.name,
          description: editingBadge.description,
          icon: editingBadge.icon,
          rarity: editingBadge.rarity,
          masteryPointsRequired: editingBadge.masteryPointsRequired,
          masteryPoints: editingBadge.masteryPoints,
          order: editingBadge.order,
          animationType: editingBadge.animationType,
          animationColor: editingBadge.animationColor,
          glowIntensity: editingBadge.glowIntensity,
          customCSS: editingBadge.customCSS,
          useCustomCSS: editingBadge.useCustomCSS,
        })
      })

      if (response.ok) {
        await fetchBadges()
        setEditingBadge(null)
        setIsCreating(false)
        toast.success(isCreating ? 'Badge créé !' : 'Badge mis à jour !')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (badgeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce badge ?')) return

    try {
      const response = await fetch(`/api/admin/badges/${badgeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchBadges()
        toast.success('Badge supprimé !')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setEditingBadge({
      id: '',
      name: '',
      description: '',
      icon: '🏆',
      rarity: 'COMMON',
      masteryPointsRequired: 0,
      masteryPoints: 10,
      order: badges.length + 1,
      animationType: 'none',
      animationColor: 'gold',
      glowIntensity: 'medium',
      useCustomCSS: false,
      customCSS: null
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.css')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCssContent(content)
        if (editingBadge) {
          setEditingBadge({
            ...editingBadge,
            customCSS: content,
            useCustomCSS: true
          })
        }
        toast.success('CSS chargé !')
      }
      reader.readAsText(file)
    } else {
      toast.error('Veuillez sélectionner un fichier .css')
    }
  }

  const getAnimationClass = (badge: Badge) => {
    if (badge.useCustomCSS) {
      return 'badge-custom-animation'
    }
    switch (badge.animationType) {
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
              Créez et personnalisez vos badges avec animations CSS
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un badge
          </button>
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
                        badge-preview
                        w-24 h-24 rounded-full flex items-center justify-center text-4xl
                        ${badge.useCustomCSS ? 'badge-custom-animation' : `
                          bg-gradient-to-br ${getColorClass(badge.animationColor)}
                          ${getAnimationClass(badge)}
                          ${getGlowClass(badge.glowIntensity)}
                        `}
                        transition-all
                      `}
                      data-badge-id={badge.id}
                    >
                      {badge.icon}
                    </div>
                    {badge.useCustomCSS && badge.customCSS && (
                      <style>{`
                        [data-badge-id="${badge.id}"].badge-custom-animation {
                          ${badge.customCSS}
                        }
                      `}</style>
                    )}
                  </div>

                  {/* Infos */}
                  <h3 className="font-bold text-lg text-master-dark mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  
                  {/* Config actuelle */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    {badge.useCustomCSS ? (
                      <div className="flex items-center gap-2 text-purple-600">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">CSS Personnalisé</span>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>

                  {/* Boutons actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setEditingBadge(badge)
                      }}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(badge.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    {isCreating ? <Plus className="w-6 h-6 text-green-500" /> : <Sparkles className="w-6 h-6 text-yellow-500" />}
                    {isCreating ? 'Créer un badge' : `Modifier : ${editingBadge.name || 'Badge'}`}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBadge(null)
                      setIsCreating(false)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Informations de base */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">📝 Informations</h3>
                    
                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du badge *
                      </label>
                      <input
                        type="text"
                        value={editingBadge.name}
                        onChange={(e) => setEditingBadge({...editingBadge, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Première Semaine"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={editingBadge.description}
                        onChange={(e) => setEditingBadge({...editingBadge, description: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Connectez-vous pendant 7 jours consécutifs"
                        rows={2}
                        required
                      />
                    </div>

                    {/* Icône */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emoji / Icône *
                      </label>
                      <input
                        type="text"
                        value={editingBadge.icon}
                        onChange={(e) => setEditingBadge({...editingBadge, icon: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-4xl text-center"
                        placeholder="🏆"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Collez un emoji ou tapez un caractère
                      </p>
                    </div>

                    {/* Rareté et Points */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rareté
                        </label>
                        <select
                          value={editingBadge.rarity}
                          onChange={(e) => setEditingBadge({...editingBadge, rarity: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="COMMON">Commun</option>
                          <option value="RARE">Rare</option>
                          <option value="EPIC">Épique</option>
                          <option value="LEGENDARY">Légendaire</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points gagnés
                        </label>
                        <input
                          type="number"
                          value={editingBadge.masteryPoints}
                          onChange={(e) => setEditingBadge({...editingBadge, masteryPoints: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Critères d'obtention */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">🎯 Critères d'obtention</h3>
                    <p className="text-sm text-gray-600">
                      Définissez les conditions pour débloquer ce badge
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Leçons complétées */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Leçons complétées
                          </label>
                          <input
                            type="number"
                            value={editingBadge.masteryPointsRequired || 0}
                            onChange={(e) => setEditingBadge({...editingBadge, masteryPointsRequired: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="0 = aucun"
                            min="0"
                          />
                        </div>

                        {/* Jours de connexion */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Jours de connexion
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="0 = aucun"
                            min="0"
                          />
                        </div>

                        {/* Taux réussite QCM */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Taux réussite QCM (%)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="0 = aucun"
                            min="0"
                            max="100"
                          />
                        </div>

                        {/* QCM parfaits */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            QCM parfaits (100%)
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="0 = aucun"
                            min="0"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 italic">
                        💡 Laissez à 0 ou vide pour ignorer un critère
                      </p>
                    </div>
                  </div>

                  {/* Preview en direct */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">✨ Animation</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 text-center">
                      <p className="text-sm text-gray-600 mb-4 font-semibold">Prévisualisation</p>
                      <div 
                        className={`
                          badge-preview-modal
                          w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl
                          ${editingBadge.useCustomCSS ? 'badge-custom-animation' : `
                            bg-gradient-to-br ${getColorClass(editingBadge.animationColor)}
                            ${getAnimationClass(editingBadge)}
                            ${getGlowClass(editingBadge.glowIntensity)}
                          `}
                          transition-all
                        `}
                      >
                        {editingBadge.icon}
                      </div>
                      {editingBadge.useCustomCSS && editingBadge.customCSS && (
                        <style>{`
                          .badge-preview-modal.badge-custom-animation {
                            ${editingBadge.customCSS}
                          }
                        `}</style>
                      )}
                    </div>
                  </div>

                  {/* Toggle mode */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingBadge({
                        ...editingBadge,
                        useCustomCSS: false
                      })}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        !editingBadge.useCustomCSS
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBadge({
                        ...editingBadge,
                        useCustomCSS: true
                      })}
                      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        editingBadge.useCustomCSS
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      CSS Personnalisé
                    </button>
                  </div>

                  {/* Mode CSS Custom */}
                  {editingBadge.useCustomCSS ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Fichier CSS personnalisé
                      </label>
                      <div className="space-y-3">
                        {/* Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                          <input
                            type="file"
                            accept=".css"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="css-upload"
                          />
                          <label htmlFor="css-upload" className="cursor-pointer">
                            <div className="text-purple-600 mb-2">
                              <Plus className="w-8 h-8 mx-auto" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              Cliquez pour uploader un fichier .css
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Le CSS sera appliqué au badge
                            </p>
                          </label>
                        </div>

                        {/* Aperçu du CSS */}
                        {editingBadge.customCSS && (
                          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                            <pre>{editingBadge.customCSS}</pre>
                          </div>
                        )}

                        {/* Exemple */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-xs font-semibold text-blue-900 mb-2">💡 Exemple de CSS :</p>
                          <code className="text-xs text-blue-800 block">
                            background: linear-gradient(45deg, #ff00ff, #00ffff);<br/>
                            animation: rotate 3s infinite linear;<br/>
                            box-shadow: 0 0 30px rgba(255,0,255,0.8);
                          </code>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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

