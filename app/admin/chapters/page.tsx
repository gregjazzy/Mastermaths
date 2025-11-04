'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

interface Chapter {
  id: string
  courseId: string
  title: string
  description: string | null
  order: number
  isDemoContent: boolean
  mentalMapUrl: string | null
  lyceesRepertoireUrl: string | null
  course: {
    title: string
  }
  _count?: {
    subChapters: number
  }
}

interface Course {
  id: string
  title: string
}

export default function ChaptersAdminPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    order: 1,
    isDemoContent: false,
    mentalMapUrl: '',
    lyceesRepertoireUrl: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [chaptersRes, coursesRes] = await Promise.all([
        fetch('/api/admin/chapters'),
        fetch('/api/admin/courses')
      ])
      
      if (chaptersRes.ok && coursesRes.ok) {
        const chaptersData = await chaptersRes.json()
        const coursesData = await coursesRes.json()
        setChapters(chaptersData.chapters)
        setCourses(coursesData.courses)
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
      const url = editingChapter 
        ? `/api/admin/chapters/${editingChapter.id}`
        : '/api/admin/chapters'
      
      const response = await fetch(url, {
        method: editingChapter ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        alert(editingChapter ? 'Chapitre modifié !' : 'Chapitre créé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setFormData({
      courseId: chapter.courseId,
      title: chapter.title,
      description: chapter.description || '',
      order: chapter.order,
      isDemoContent: chapter.isDemoContent,
      mentalMapUrl: chapter.mentalMapUrl || '',
      lyceesRepertoireUrl: chapter.lyceesRepertoireUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (chapterId: string) => {
    if (!confirm('Supprimer ce chapitre et tout son contenu ?')) return

    try {
      const response = await fetch(`/api/admin/chapters/${chapterId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        alert('Chapitre supprimé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      order: 1,
      isDemoContent: false,
      mentalMapUrl: '',
      lyceesRepertoireUrl: ''
    })
    setEditingChapter(null)
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
              📁 Gestion des Chapitres
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
            disabled={courses.length === 0}
          >
            <Plus className="w-5 h-5" />
            Nouveau chapitre
          </button>
        </div>

        {courses.length === 0 && (
          <div className="card bg-yellow-50 border border-yellow-200 mb-8">
            <p className="text-yellow-700">
              ⚠️ Vous devez d'abord créer un cours avant d'ajouter des chapitres.
            </p>
            <Link href="/admin/courses" className="btn-primary mt-4 inline-block">
              Créer un cours
            </Link>
          </div>
        )}

        {/* Formulaire */}
        {showForm && courses.length > 0 && (
          <div className="card mb-8 bg-green-50 border-2 border-green-200">
            <h3 className="text-xl font-bold mb-4">
              {editingChapter ? '✏️ Modifier le chapitre' : '➕ Créer un chapitre'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cours parent *</label>
                <select
                  required
                  className="input"
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                >
                  <option value="">Sélectionner un cours...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Titre du chapitre *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Chapitre 1 - Les limites"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="input font-mono text-sm"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du chapitre...&#10;&#10;**Gras**, *italique*, listes"
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

              <div>
                <label className="block text-sm font-medium mb-1">URL Carte mentale (optionnel)</label>
                <input
                  type="url"
                  className="input"
                  value={formData.mentalMapUrl}
                  onChange={(e) => setFormData({...formData, mentalMapUrl: e.target.value})}
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">URL vers une image ou PDF de la carte mentale</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Répertoire lycées (optionnel)</label>
                <input
                  type="url"
                  className="input"
                  value={formData.lyceesRepertoireUrl}
                  onChange={(e) => setFormData({...formData, lyceesRepertoireUrl: e.target.value})}
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">URL vers le document du répertoire</p>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingChapter ? 'Mettre à jour' : 'Créer le chapitre'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des chapitres */}
        <div className="space-y-4">
          {chapters.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucun chapitre créé</p>
              {courses.length > 0 && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Créer le premier chapitre
                </button>
              )}
            </div>
          ) : (
            chapters.map((chapter) => (
              <div key={chapter.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-master-dark">
                        {chapter.title}
                      </h3>
                      {chapter.isDemoContent && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          🆓 DEMO
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Ordre: {chapter.order}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      📚 Cours: <span className="font-semibold">{chapter.course.title}</span>
                    </p>
                    
                    {chapter.description && (
                      <div className="text-gray-600 mb-3 prose prose-sm max-w-none [&>p]:mb-2 [&>p]:leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{chapter.description}</ReactMarkdown>
                      </div>
                    )}
                    
                    <div className="flex gap-4 text-sm text-gray-500 mb-2">
                      {chapter.mentalMapUrl && (
                        <span>🗺️ Carte mentale ✓</span>
                      )}
                      {chapter.lyceesRepertoireUrl && (
                        <span>🏫 Répertoire lycées ✓</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      📖 {chapter._count?.subChapters || 0} sous-chapitres • ID: {chapter.id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(chapter)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(chapter.id)}
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


