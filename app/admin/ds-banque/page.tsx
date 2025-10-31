'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface DS {
  id: string
  title: string
  description: string | null
  niveau: string
  chapter: string
  difficulty: number
  duration: number | null
  pdfUrl: string | null
  correctionPdfUrl: string | null
  isPublic: boolean
  viewCount: number
  createdAt: string
}

export default function DSBanqueAdminPage() {
  const [dsList, setDsList] = useState<DS[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDS, setEditingDS] = useState<DS | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    niveau: 'Terminale' as 'Seconde' | 'Première' | 'Terminale',
    chapter: '',
    difficulty: 3,
    duration: 120,
    pdfUrl: '',
    correctionPdfUrl: '',
    isPublic: true
  })

  useEffect(() => {
    fetchDS()
  }, [])

  const fetchDS = async () => {
    try {
      const response = await fetch('/api/admin/ds-banque')
      if (response.ok) {
        const data = await response.json()
        setDsList(data.ds)
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement DS')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingDS 
        ? `/api/admin/ds-banque/${editingDS.id}`
        : '/api/admin/ds-banque'
      
      const response = await fetch(url, {
        method: editingDS ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchDS()
        resetForm()
        toast.success(editingDS ? 'DS modifié !' : 'DS créé !')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (ds: DS) => {
    setEditingDS(ds)
    setFormData({
      title: ds.title,
      description: ds.description || '',
      niveau: ds.niveau as any,
      chapter: ds.chapter,
      difficulty: ds.difficulty,
      duration: ds.duration || 120,
      pdfUrl: ds.pdfUrl || '',
      correctionPdfUrl: ds.correctionPdfUrl || '',
      isPublic: ds.isPublic
    })
    setShowForm(true)
  }

  const handleDelete = async (dsId: string) => {
    if (!confirm('Supprimer ce DS ?')) return

    try {
      const response = await fetch(`/api/admin/ds-banque/${dsId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchDS()
        toast.success('DS supprimé !')
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
      chapter: '',
      difficulty: 3,
      duration: 120,
      pdfUrl: '',
      correctionPdfUrl: '',
      isPublic: true
    })
    setEditingDS(null)
    setShowForm(false)
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = {
      1: '⭐ Accessible',
      2: '⭐⭐ Solide',
      3: '⭐⭐⭐ Avancé',
      4: '⭐⭐⭐⭐ Expert',
      5: '⭐⭐⭐⭐⭐ Élite'
    }
    return labels[difficulty as keyof typeof labels]
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
              📝 Gestion de la Banque DS
            </h1>
            <p className="text-gray-600 mt-1">
              {dsList.filter(ds => ds.isPublic).length} DS publics • {dsList.length} total
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau DS
          </button>
        </div>

        {/* Disclaimer juridique */}
        <div className="card mb-8 bg-blue-50 border-2 border-blue-200">
          <p className="text-sm text-gray-700">
            ⚖️ <strong>Rappel</strong> : Les DS doivent être substantiellement modifiés par rapport aux sources d'inspiration.
            Format titre : <code className="bg-white px-2 py-1 rounded">DS [Niveau] - [Chapitre] - [Mois Année]</code>
          </p>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="card mb-8 bg-indigo-50 border-2 border-indigo-200">
            <h3 className="text-xl font-bold mb-4">
              {editingDS ? '✏️ Modifier le DS' : '➕ Créer un DS'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre du DS *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: DS Expert - Suites numériques - Novembre 2024"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format : DS [Niveau] - [Chapitre] - [Mois Année]
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Suites arithmétiques et géométriques, récurrence..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-1">Chapitre *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.chapter}
                    onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                    placeholder="Ex: Suites numériques"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Durée (min)</label>
                  <input
                    type="number"
                    className="input"
                    min="30"
                    max="240"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Difficulté *</label>
                <select
                  required
                  className="input"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
                >
                  <option value="1">⭐ Accessible (Bac standard)</option>
                  <option value="2">⭐⭐ Solide (Bon niveau)</option>
                  <option value="3">⭐⭐⭐ Avancé (Très bon niveau)</option>
                  <option value="4">⭐⭐⭐⭐ Expert (Prépa HEC)</option>
                  <option value="5">⭐⭐⭐⭐⭐ Élite (Classes Prépa*)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL PDF Sujet</label>
                <input
                  type="url"
                  className="input"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
                  placeholder="https://storage.supabase.co/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Uploadez d'abord sur Supabase Storage, puis copiez l'URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL PDF Corrigé</label>
                <input
                  type="url"
                  className="input"
                  value={formData.correctionPdfUrl}
                  onChange={(e) => setFormData({...formData, correctionPdfUrl: e.target.value})}
                  placeholder="https://storage.supabase.co/..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-sm font-medium">
                  DS public (visible sur le site)
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingDS ? 'Mettre à jour' : 'Créer le DS'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des DS */}
        <div className="space-y-4">
          {dsList.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun DS créé</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Créer le premier DS
              </button>
            </div>
          ) : (
            dsList.map((ds) => (
              <div 
                key={ds.id} 
                className={`card hover:shadow-lg transition-all ${!ds.isPublic ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${ds.difficulty === 1 ? 'bg-green-100 text-green-700' : ''}
                        ${ds.difficulty === 2 ? 'bg-blue-100 text-blue-700' : ''}
                        ${ds.difficulty === 3 ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${ds.difficulty === 4 ? 'bg-orange-100 text-orange-700' : ''}
                        ${ds.difficulty === 5 ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {getDifficultyLabel(ds.difficulty)}
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {ds.niveau}
                      </span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                        {ds.chapter}
                      </span>
                      {!ds.isPublic && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                          PRIVÉ
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-master-dark mb-2">
                      {ds.title}
                    </h3>
                    
                    {ds.description && (
                      <p className="text-gray-600 mb-3">{ds.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {ds.duration && <span>⏱️ {ds.duration} min</span>}
                      <span>👁️ {ds.viewCount} vues</span>
                      {ds.pdfUrl && <span>📄 Sujet disponible</span>}
                      {ds.correctionPdfUrl && <span>✅ Corrigé disponible</span>}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      ID: {ds.id} • Créé le {new Date(ds.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ds)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(ds.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

