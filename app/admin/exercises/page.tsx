'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, Video, FileText, CheckCircle } from 'lucide-react'

interface Exercise {
  id: string
  lessonId: string
  title: string
  order: number
  isDemoContent: boolean
  exerciseUrl: string | null
  correctionVideoUrl: string | null
  correctionDocumentUrl: string | null
  lesson: {
    title: string
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
}

interface Lesson {
  id: string
  title: string
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

export default function ExercisesAdminPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  
  const [formData, setFormData] = useState({
    lessonId: '',
    title: '',
    order: 1,
    isDemoContent: false,
    exerciseUrl: '',
    correctionVideoUrl: '',
    correctionDocumentUrl: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [exercisesRes, lessonsRes] = await Promise.all([
        fetch('/api/admin/exercises'),
        fetch('/api/admin/lessons')
      ])
      
      if (exercisesRes.ok && lessonsRes.ok) {
        const exercisesData = await exercisesRes.json()
        const lessonsData = await lessonsRes.json()
        setExercises(exercisesData.exercises)
        setLessons(lessonsData.lessons)
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
      const url = editingExercise 
        ? `/api/admin/exercises/${editingExercise.id}`
        : '/api/admin/exercises'
      
      const response = await fetch(url, {
        method: editingExercise ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        alert(editingExercise ? 'Exercice modifié !' : 'Exercice créé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setFormData({
      lessonId: exercise.lessonId,
      title: exercise.title,
      order: exercise.order,
      isDemoContent: exercise.isDemoContent,
      exerciseUrl: exercise.exerciseUrl || '',
      correctionVideoUrl: exercise.correctionVideoUrl || '',
      correctionDocumentUrl: exercise.correctionDocumentUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (exerciseId: string) => {
    if (!confirm('Supprimer cet exercice ?')) return

    try {
      const response = await fetch(`/api/admin/exercises/${exerciseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        alert('Exercice supprimé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      lessonId: '',
      title: '',
      order: 1,
      isDemoContent: false,
      exerciseUrl: '',
      correctionVideoUrl: '',
      correctionDocumentUrl: ''
    })
    setEditingExercise(null)
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
              📝 Gestion des Exercices
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
            disabled={lessons.length === 0}
          >
            <Plus className="w-5 h-5" />
            Nouvel exercice
          </button>
        </div>

        {lessons.length === 0 && (
          <div className="card bg-yellow-50 border border-yellow-200 mb-8">
            <p className="text-yellow-700">
              ⚠️ Vous devez d'abord créer des leçons avant de pouvoir ajouter des exercices.
            </p>
          </div>
        )}

        {/* Formulaire */}
        {showForm && lessons.length > 0 && (
          <div className="card mb-8 bg-green-50 border-2 border-green-200">
            <h3 className="text-xl font-bold mb-4">
              {editingExercise ? '✏️ Modifier l\'exercice' : '➕ Créer un exercice'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leçon parente */}
              <div>
                <label className="block text-sm font-medium mb-1">Leçon parente *</label>
                <select
                  required
                  className="input"
                  value={formData.lessonId}
                  onChange={(e) => setFormData({...formData, lessonId: e.target.value})}
                >
                  <option value="">Sélectionner une leçon...</option>
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.subChapter.chapter.course.title} → {lesson.subChapter.chapter.title} → {lesson.subChapter.title} → {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium mb-1">Titre de l'exercice *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Exercice 1 - Équations du second degré"
                />
              </div>

              {/* Ordre */}
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

              {/* Énoncé PDF */}
              <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  📄 URL du PDF d'énoncé
                </label>
                <input
                  type="url"
                  className="input"
                  value={formData.exerciseUrl}
                  onChange={(e) => setFormData({...formData, exerciseUrl: e.target.value})}
                  placeholder="https://drive.google.com/... ou Dropbox, etc."
                />
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p className="font-semibold">💡 Hébergez votre énoncé :</p>
                  <p>• <strong>Google Drive</strong> : Téléversez → Clic droit → Obtenir le lien</p>
                  <p>• <strong>Dropbox</strong> : Partagez → Copiez le lien</p>
                </div>
              </div>

              {/* Vidéo correction */}
              <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  🎥 ID Vimeo de la vidéo correction (optionnel)
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.correctionVideoUrl}
                  onChange={(e) => setFormData({...formData, correctionVideoUrl: e.target.value})}
                  placeholder="Ex: 123456789"
                />
              </div>

              {/* PDF correction */}
              <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  📄 URL du PDF correction (optionnel)
                </label>
                <input
                  type="url"
                  className="input"
                  value={formData.correctionDocumentUrl}
                  onChange={(e) => setFormData({...formData, correctionDocumentUrl: e.target.value})}
                  placeholder="https://drive.google.com/... ou Dropbox, etc."
                />
              </div>

              {/* Info QCM */}
              <div className="bg-orange-50 border-2 border-orange-300 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-900">✅ QCM de validation</span>
                </div>
                <p className="text-sm text-gray-700">
                  Une fois l'exercice créé, allez dans <strong className="text-master-turquoise">Admin → Gestion QCM</strong> pour ajouter les questions liées à cet exercice !
                </p>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingExercise ? 'Mettre à jour' : 'Créer l\'exercice'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des exercices */}
        <div className="space-y-4">
          {exercises.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucun exercice créé</p>
              {lessons.length > 0 && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Créer le premier exercice
                </button>
              )}
            </div>
          ) : (
            exercises.map((exercise) => (
              <div key={exercise.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📝</span>
                      <h3 className="text-xl font-bold text-master-dark">
                        {exercise.title}
                      </h3>
                      {exercise.isDemoContent && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          🆓 DEMO
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Ordre: {exercise.order}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {exercise.lesson.subChapter.chapter.course.title} → {exercise.lesson.subChapter.chapter.title} → {exercise.lesson.subChapter.title} → <strong>{exercise.lesson.title}</strong>
                    </p>
                    
                    <div className="flex gap-4 text-sm mt-2">
                      {exercise.exerciseUrl && (
                        <span className="text-blue-600">📄 Énoncé PDF ✓</span>
                      )}
                      {exercise.correctionVideoUrl && (
                        <span className="text-yellow-600">🎥 Correction vidéo ✓</span>
                      )}
                      {exercise.correctionDocumentUrl && (
                        <span className="text-purple-600">📄 Correction PDF ✓</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/qcm-exercise/${exercise.id}`}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                      title="Gérer le QCM"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </Link>
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(exercise.id)}
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

