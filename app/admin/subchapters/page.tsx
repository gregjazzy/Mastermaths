'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

interface SubChapter {
  id: string
  title: string
  description: string | null
  order: number
  isDemoContent: boolean
  chapterId: string
  chapter: {
    title: string
    course: {
      title: string
    }
  }
}

interface Chapter {
  id: string
  title: string
  course: {
    title: string
  }
}

export default function SubChaptersAdminPage() {
  const [subChapters, setSubChapters] = useState<SubChapter[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSubChapter, setEditingSubChapter] = useState<SubChapter | null>(null)
  
  const [formData, setFormData] = useState({
    chapterId: '',
    title: '',
    description: '',
    isDemoContent: false,
    order: 1
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Récupérer les sous-chapitres
      const subChaptersRes = await fetch('/api/admin/subchapters')
      if (subChaptersRes.ok) {
        const data = await subChaptersRes.json()
        setSubChapters(data.subChapters || [])
      }

      // Récupérer les chapitres pour le dropdown
      const chaptersRes = await fetch('/api/admin/chapters')
      if (chaptersRes.ok) {
        const data = await chaptersRes.json()
        setChapters(data.chapters || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingSubChapter 
        ? `/api/admin/subchapters/${editingSubChapter.id}`
        : '/api/admin/subchapters'
      
      const response = await fetch(url, {
        method: editingSubChapter ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        alert(editingSubChapter ? 'Sous-chapitre modifié !' : 'Sous-chapitre créé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (subChapter: SubChapter) => {
    setEditingSubChapter(subChapter)
    setFormData({
      chapterId: subChapter.chapterId,
      title: subChapter.title,
      description: subChapter.description || '',
      isDemoContent: subChapter.isDemoContent,
      order: subChapter.order,
    })
    setShowForm(true)
  }

  const handleDelete = async (subChapterId: string) => {
    if (!confirm('Supprimer ce sous-chapitre ? Toutes les leçons associées seront aussi supprimées.')) return

    try {
      const response = await fetch(`/api/admin/subchapters/${subChapterId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        alert('Sous-chapitre supprimé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      chapterId: '',
      title: '',
      description: '',
      isDemoContent: false,
      order: 1
    })
    setEditingSubChapter(null)
    setShowForm(false)
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
              📑 Gestion des Sous-Chapitres
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
            disabled={chapters.length === 0}
          >
            <Plus className="w-5 h-5" />
            Nouveau sous-chapitre
          </button>
        </div>

        {chapters.length === 0 && (
          <div className="card bg-yellow-50 border border-yellow-200 mb-8">
            <p className="text-yellow-700">
              ⚠️ Vous devez d'abord créer un cours et un chapitre avant de créer des sous-chapitres.
            </p>
          </div>
        )}

        {/* Formulaire */}
        {showForm && chapters.length > 0 && (
          <div className="card mb-8 bg-blue-50 border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-4">
              {editingSubChapter ? '✏️ Modifier le sous-chapitre' : '➕ Créer un sous-chapitre'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chapitre parent *</label>
                <select
                  required
                  className="input"
                  value={formData.chapterId}
                  onChange={(e) => setFormData({...formData, chapterId: e.target.value})}
                >
                  <option value="">Sélectionner un chapitre...</option>
                  {chapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.course.title} → {chapter.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Titre du sous-chapitre *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: 1.1 - Introduction aux équations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (optionnelle)</label>
                <textarea
                  className="input font-mono text-sm"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du sous-chapitre...&#10;&#10;**Gras**, *italique*, listes"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Markdown : **gras**, *italique*, listes. Un simple Entrée = saut de ligne ✅
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex items-center gap-2 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <input
                  type="checkbox"
                  id="isDemoContent"
                  checked={formData.isDemoContent}
                  onChange={(e) => setFormData({...formData, isDemoContent: e.target.checked})}
                  className="w-5 h-5 text-master-turquoise rounded"
                />
                <label htmlFor="isDemoContent" className="font-medium">
                  🆓 Contenu GRATUIT accessible aux comptes DEMO
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingSubChapter ? 'Mettre à jour' : 'Créer'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des sous-chapitres */}
        <div className="space-y-4">
          {subChapters.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucun sous-chapitre créé</p>
              {chapters.length > 0 && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Créer le premier sous-chapitre
                </button>
              )}
            </div>
          ) : (
            subChapters.map((subChapter) => (
              <div key={subChapter.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📑</span>
                      <h3 className="text-xl font-bold text-master-dark">
                        {subChapter.title}
                      </h3>
                      {subChapter.isDemoContent && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          🆓 DEMO
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Ordre: {subChapter.order}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {subChapter.chapter.course.title} → {subChapter.chapter.title}
                    </p>
                    
                    {subChapter.description && (
                      <div className="text-gray-600 mb-3 prose prose-sm max-w-none [&>p]:mb-2 [&>p]:leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{subChapter.description}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(subChapter)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(subChapter.id)}
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

