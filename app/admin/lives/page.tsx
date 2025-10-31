'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, Video } from 'lucide-react'
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
  createdAt: string
}

export default function LivesAdminPage() {
  const [lives, setLives] = useState<Live[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLive, setEditingLive] = useState<Live | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    niveau: 'Terminale' as 'Seconde' | 'Première' | 'Terminale',
    theme: '',
    scheduledAt: '',
    duration: 60,
    everwebinarUrl: '',
    isActive: true
  })

  useEffect(() => {
    fetchLives()
  }, [])

  const fetchLives = async () => {
    try {
      const response = await fetch('/api/admin/lives')
      if (response.ok) {
        const data = await response.json()
        setLives(data.lives)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement lives')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLive 
        ? `/api/admin/lives/${editingLive.id}`
        : '/api/admin/lives'
      
      const response = await fetch(url, {
        method: editingLive ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchLives()
        resetForm()
        toast.success(editingLive ? 'Live modifié !' : 'Live créé !')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (live: Live) => {
    setEditingLive(live)
    // Convertir la date en format datetime-local
    const date = new Date(live.scheduledAt)
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    
    setFormData({
      title: live.title,
      description: live.description || '',
      niveau: live.niveau as any,
      theme: live.theme,
      scheduledAt: localDate,
      duration: live.duration,
      everwebinarUrl: live.everwebinarUrl,
      isActive: live.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (liveId: string) => {
    if (!confirm('Supprimer ce live ?')) return

    try {
      const response = await fetch(`/api/admin/lives/${liveId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchLives()
        toast.success('Live supprimé !')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      niveau: 'Terminale',
      theme: '',
      scheduledAt: '',
      duration: 60,
      everwebinarUrl: '',
      isActive: true
    })
    setEditingLive(null)
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-master-turquoise hover:underline flex items-center gap-2 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Retour admin
            </Link>
            <h1 className="text-3xl font-bold text-master-dark">
              🎥 Gestion des Lives Hebdo
            </h1>
            <p className="text-gray-600 mt-1">
              {lives.filter(l => isUpcoming(l.scheduledAt)).length} lives à venir • {lives.length} total
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau live
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="card mb-8 bg-red-50 border-2 border-red-200">
            <h3 className="text-xl font-bold mb-4">
              {editingLive ? '✏️ Modifier le live' : '➕ Créer un live'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre du live *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Live Maths - Suites numériques"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Méthodes et astuces pour maîtriser les suites..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau *</label>
                  <select
                    required
                    className="input"
                    value={formData.niveau}
                    onChange={(e) => setFormData({...formData, niveau: e.target.value as any})}
                  >
                    <option value="Seconde">Seconde</option>
                    <option value="Première">Première</option>
                    <option value="Terminale">Terminale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Thème *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value})}
                    placeholder="Ex: Suites numériques"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date et heure *</label>
                  <input
                    type="datetime-local"
                    required
                    className="input"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JJ/MM/AAAA HH:MM
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Durée (minutes) *</label>
                  <input
                    type="number"
                    required
                    className="input"
                    min="30"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL EverWebinar *</label>
                <input
                  type="url"
                  required
                  className="input"
                  value={formData.everwebinarUrl}
                  onChange={(e) => setFormData({...formData, everwebinarUrl: e.target.value})}
                  placeholder="https://everwebinar.com/webinar/xxxxx"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Live actif (visible sur le site)
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingLive ? 'Mettre à jour' : 'Créer le live'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des lives */}
        <div className="space-y-4">
          {lives.length === 0 ? (
            <div className="card text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun live créé</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Créer le premier live
              </button>
            </div>
          ) : (
            lives.map((live) => {
              const upcoming = isUpcoming(live.scheduledAt)
              return (
                <div 
                  key={live.id} 
                  className={`card hover:shadow-lg transition-all ${
                    upcoming ? 'border-2 border-red-500' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {upcoming ? (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            À VENIR
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-400 text-white text-xs font-bold rounded-full">
                            TERMINÉ
                          </span>
                        )}
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          ${live.niveau === 'Seconde' ? 'bg-blue-200 text-blue-700' : ''}
                          ${live.niveau === 'Première' ? 'bg-purple-200 text-purple-700' : ''}
                          ${live.niveau === 'Terminale' ? 'bg-red-200 text-red-700' : ''}
                        `}>
                          {live.niveau}
                        </span>
                        {!live.isActive && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                            INACTIF
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-master-dark mb-2">
                        {live.title}
                      </h3>
                      
                      {live.description && (
                        <p className="text-gray-600 mb-3">{live.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>📅 {formatDate(live.scheduledAt)}</span>
                        <span>⏱️ {live.duration} min</span>
                        <span>🎓 {live.theme}</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        ID: {live.id}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(live)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(live.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

