'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, Save, Video, FileQuestion, CheckCircle2 } from 'lucide-react'

interface Lesson {
  id: string
  subChapterId: string
  title: string
  type: string
  order: number
  isDemoContent: boolean
  vimeoVideoId: string | null
  countForReporting?: boolean
  isOptional?: boolean
  subChapter: {
    title: string
    chapter: {
      title: string
      course: {
        title: string
      }
    }
  }
}

interface SubChapter {
  id: string
  title: string
  chapter: {
    title: string
    course: {
      title: string
    }
  }
}

const LESSON_TYPES = [
  { value: 'VIDEO_COURS', label: '🎥 Cours vidéo' },
  { value: 'METHODE', label: '💡 Fiche méthode' },
  { value: 'CARTOGRAPHIE', label: '🗺️ Carte mentale' },
]

export default function LessonsAdminPage() {
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [subChapters, setSubChapters] = useState<SubChapter[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  
  const [formData, setFormData] = useState({
    subChapterId: '',
    title: '',
    type: 'VIDEO_COURS' as string,
    order: 1,
    isDemoContent: false,
    vimeoVideoId: '',
    contentUrl: '',
    countForReporting: true,
    isOptional: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [lessonsRes, subChaptersRes] = await Promise.all([
        fetch('/api/admin/lessons'),
        fetch('/api/admin/subchapters')
      ])
      
      if (lessonsRes.ok && subChaptersRes.ok) {
        const lessonsData = await lessonsRes.json()
        const subChaptersData = await subChaptersRes.json()
        setLessons(lessonsData.lessons)
        setSubChapters(subChaptersData.subChapters)
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
      const url = editingLesson 
        ? `/api/admin/lessons/${editingLesson.id}`
        : '/api/admin/lessons'
      
      const response = await fetch(url, {
        method: editingLesson ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        alert(editingLesson ? 'Leçon modifiée !' : 'Leçon créée !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      subChapterId: lesson.subChapterId,
      title: lesson.title,
      type: lesson.type,
      order: lesson.order,
      isDemoContent: lesson.isDemoContent,
      vimeoVideoId: lesson.vimeoVideoId || '',
      contentUrl: '',
      countForReporting: lesson.countForReporting ?? true,
      isOptional: lesson.isOptional ?? false,
    })
    setShowForm(true)
  }

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Supprimer cette leçon ?')) return

    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        alert('Leçon supprimée !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      subChapterId: '',
      title: '',
      type: 'VIDEO_COURS',
      order: 1,
      isDemoContent: false,
      vimeoVideoId: '',
      contentUrl: '',
      countForReporting: true,
      isOptional: false,
    })
    setEditingLesson(null)
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
              📚 Gestion des Leçons
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
            disabled={subChapters.length === 0}
          >
            <Plus className="w-5 h-5" />
            Nouvelle leçon
          </button>
        </div>

        {subChapters.length === 0 && (
          <div className="card bg-yellow-50 border border-yellow-200 mb-8">
            <p className="text-yellow-700">
              ⚠️ Vous devez d'abord créer un cours, des chapitres et des sous-chapitres.
            </p>
          </div>
        )}

        {/* Formulaire */}
        {showForm && subChapters.length > 0 && (
          <div className="card mb-8 bg-purple-50 border-2 border-purple-200">
            <h3 className="text-xl font-bold mb-4">
              {editingLesson ? '✏️ Modifier la leçon' : '➕ Créer une leçon'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sous-chapitre parent *</label>
                  <select
                    required
                    className="input"
                    value={formData.subChapterId}
                    onChange={(e) => setFormData({...formData, subChapterId: e.target.value})}
                  >
                    <option value="">Sélectionner un sous-chapitre...</option>
                    {subChapters.map(sc => (
                      <option key={sc.id} value={sc.id}>
                        {sc.chapter.course.title} → {sc.chapter.title} → {sc.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type de leçon *</label>
                  <select
                    required
                    className="input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    {LESSON_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Titre de la leçon *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Résoudre une équation du second degré"
                  />
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

              {/* Vidéo cours (pour COURS VIDÉO) */}
              {formData.type === 'VIDEO_COURS' && (
                <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    🎥 ID de la vidéo Vimeo *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.vimeoVideoId}
                    onChange={(e) => setFormData({...formData, vimeoVideoId: e.target.value})}
                    placeholder="Ex: 987654321"
                  />
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold">💡 Comment trouver l'ID Vimeo :</p>
                    <p>1. Uploadez votre vidéo sur vimeo.com</p>
                    <p>2. Regardez l'URL : https://vimeo.com/<strong>987654321</strong></p>
                    <p>3. Copiez les chiffres (ex: 987654321) ici 👆</p>
                  </div>
                </div>
              )}

              {/* Document pour MÉTHODE ou CARTOGRAPHIE */}
              {(formData.type === 'METHODE' || formData.type === 'CARTOGRAPHIE') && (
                <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <FileQuestion className="w-4 h-4" />
                    📄 URL du document (optionnel)
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.contentUrl}
                    onChange={(e) => setFormData({...formData, contentUrl: e.target.value})}
                    placeholder="https://drive.google.com/... ou Dropbox, etc."
                  />
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold">💡 Hébergez votre document :</p>
                    <p>• <strong>Google Drive</strong> : Téléversez → Clic droit → Obtenir le lien</p>
                    <p>• <strong>Dropbox</strong> : Partagez → Copiez le lien</p>
                  </div>
                </div>
              )}

              {/* Options avancées */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-800 mb-2">⚙️ Options avancées</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.countForReporting}
                    onChange={(e) => setFormData({...formData, countForReporting: e.target.checked})}
                    className="w-5 h-5 text-master-turquoise rounded focus:ring-master-turquoise"
                  />
                  <div>
                    <span className="font-medium text-gray-700">📊 Compter dans le reporting</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Si décoché, cette leçon ne sera pas comptabilisée dans les statistiques et performances
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOptional}
                    onChange={(e) => setFormData({...formData, isOptional: e.target.checked})}
                    className="w-5 h-5 text-master-turquoise rounded focus:ring-master-turquoise"
                  />
                  <div>
                    <span className="font-medium text-gray-700">⭐ Leçon optionnelle</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Contenu bonus ou supplémentaire (non obligatoire pour la progression)
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingLesson ? 'Mettre à jour' : 'Créer la leçon'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des leçons */}
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucune leçon créée</p>
              {subChapters.length > 0 && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Créer la première leçon
                </button>
              )}
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {lesson.type === 'VIDEO_COURS' && '🎥'}
                        {lesson.type === 'QCM' && '📝'}
                        {lesson.type === 'CORRECTION_VIDEO' && '✅'}
                        {lesson.type === 'EXO_ECRIT' && '📄'}
                        {lesson.type === 'CARTOGRAPHIE' && '🗺️'}
                        {lesson.type === 'METHODE' && '💡'}
                      </span>
                      <h3 className="text-xl font-bold text-master-dark">
                        {lesson.title}
                      </h3>
                      {lesson.isDemoContent && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          🆓 DEMO
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Ordre: {lesson.order}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {lesson.subChapter.chapter.course.title} → {lesson.subChapter.chapter.title} → {lesson.subChapter.title}
                    </p>
                    
                    {lesson.vimeoVideoId && (
                      <p className="text-sm text-blue-600 mb-2">
                        🎥 Vimeo ID: <code className="bg-blue-100 px-2 py-1 rounded">{lesson.vimeoVideoId}</code>
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Type: {LESSON_TYPES.find(t => t.value === lesson.type)?.label} • ID: {lesson.id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/qcm/${lesson.id}`}
                      className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                      title="Gérer les QCM"
                    >
                      <FileQuestion className="w-4 h-4" />
                      QCM
                    </Link>
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
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

