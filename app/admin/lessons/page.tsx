'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, Video, FileQuestion } from 'lucide-react'

interface Lesson {
  id: string
  subChapterId: string
  title: string
  type: string
  order: number
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
  { value: 'VIDEO_COURS', label: '🎥 Vidéo de cours', requiresVimeo: true, canHaveCorrection: false },
  { value: 'QCM', label: '📝 QCM', requiresVimeo: false, canHaveCorrection: true },
  { value: 'CORRECTION_VIDEO', label: '✅ Vidéo de correction', requiresVimeo: true, isCorrection: true },
  { value: 'CORRECTION_DOCUMENT', label: '📄 Correction PDF', requiresVimeo: false, isCorrection: true },
  { value: 'EXO_ECRIT', label: '📄 Exercice écrit', requiresVimeo: false, canHaveCorrection: true },
  { value: 'DS', label: '📋 Devoir Surveillé (DS)', requiresVimeo: false, canHaveCorrection: true },
  { value: 'CARTOGRAPHIE', label: '🗺️ Cartographie', requiresVimeo: false, canHaveCorrection: false },
  { value: 'METHODE', label: '💡 Méthode', requiresVimeo: false, canHaveCorrection: false },
]

export default function LessonsAdminPage() {
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
    vimeoVideoId: '',
    documentUrl: '',
    linkedExerciseId: '',
    prerequisiteLessonId: '',
    parentLessonId: '',
    countForReporting: true,
    isOptional: false,
    content: ''
  })

  const selectedLessonType = LESSON_TYPES.find(t => t.value === formData.type)

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
      vimeoVideoId: lesson.vimeoVideoId || '',
      documentUrl: '',
      linkedExerciseId: '',
      prerequisiteLessonId: '',
      parentLessonId: '',
      countForReporting: lesson.countForReporting ?? true,
      isOptional: lesson.isOptional ?? false,
      content: ''
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
      vimeoVideoId: '',
      documentUrl: '',
      linkedExerciseId: '',
      prerequisiteLessonId: '',
      parentLessonId: '',
      countForReporting: true,
      isOptional: false,
      content: ''
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
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Ex: Introduction aux limites"
                />
              </div>

              {selectedLessonType?.requiresVimeo && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    ID de la vidéo Vimeo *
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

              {!selectedLessonType?.requiresVimeo && formData.type !== 'QCM' && !selectedLessonType?.isCorrection && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <FileQuestion className="w-4 h-4" />
                    URL du document (PDF, image, etc.) - Optionnel
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.documentUrl}
                    onChange={(e) => setFormData({...formData, documentUrl: e.target.value})}
                    placeholder="https://drive.google.com/... ou https://..."
                  />
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold">💡 Où héberger vos documents :</p>
                    <p>• <strong>Google Drive</strong> : Téléversez le PDF, clic droit → Obtenir le lien → Copier</p>
                    <p>• <strong>Dropbox</strong> : Partagez le fichier, copiez le lien public</p>
                    <p>• <strong>Votre serveur</strong> : URL directe vers le fichier</p>
                    <p className="text-blue-600 mt-2">Le PDF s'affichera directement dans la leçon !</p>
                  </div>
                </div>
              )}

              {selectedLessonType?.isCorrection && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <FileQuestion className="w-4 h-4" />
                    Lier à un exercice/DS/QCM - Optionnel
                  </label>
                  <select
                    className="input"
                    value={formData.linkedExerciseId}
                    onChange={(e) => setFormData({...formData, linkedExerciseId: e.target.value})}
                  >
                    <option value="">-- Aucun lien --</option>
                    {lessons
                      .filter(l => ['EXO_ECRIT', 'DS', 'QCM'].includes(l.type) && l.subChapterId === formData.subChapterId)
                      .map(lesson => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                  </select>
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="font-semibold">💡 Lier cette correction à :</p>
                    <p>• Un exercice écrit</p>
                    <p>• Un DS (Devoir Surveillé)</p>
                    <p>• Un QCM</p>
                    <p className="text-orange-600 mt-2">La correction s'affichera après que l'élève termine l'exercice.</p>
                  </div>
                </div>
              )}

              {formData.type === 'CORRECTION_DOCUMENT' && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <FileQuestion className="w-4 h-4" />
                    URL de la correction PDF *
                  </label>
                  <input
                    type="url"
                    required
                    className="input"
                    value={formData.documentUrl}
                    onChange={(e) => setFormData({...formData, documentUrl: e.target.value})}
                    placeholder="https://drive.google.com/... ou https://..."
                  />
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold">💡 PDF de correction :</p>
                    <p>1. Créez votre correction en PDF</p>
                    <p>2. Uploadez-la sur Google Drive ou Dropbox</p>
                    <p>3. Obtenez le lien public</p>
                    <p>4. Collez-le ici</p>
                    <p className="text-purple-600 mt-2">Le PDF s'affichera après l'exercice !</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  🌳 Leçon Parente (Hiérarchie) - Optionnel
                </label>
                <select
                  className="input"
                  value={formData.parentLessonId}
                  onChange={(e) => setFormData({...formData, parentLessonId: e.target.value})}
                >
                  <option value="">-- Aucune (Niveau 1 - Racine) --</option>
                  {lessons
                    .filter(l => l.subChapterId === formData.subChapterId && l.id !== editingLesson?.id)
                    .sort((a, b) => a.order - b.order)
                    .map(lesson => (
                      <option key={lesson.id} value={lesson.id}>
                        #{lesson.order} - {lesson.title}
                      </option>
                    ))}
                </select>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold">💡 Hiérarchie à 3 niveaux :</p>
                  <p>• <strong>Niveau 1</strong> : Vidéo de cours (pas de parent)</p>
                  <p>• <strong>Niveau 2</strong> : Exercice 1 (parent = Vidéo de cours)</p>
                  <p>• <strong>Niveau 3</strong> : QCM Ex 1 (parent = Exercice 1)</p>
                  <p className="text-blue-600 mt-2">🌳 Les leçons enfants s'afficheront indentées sous leur parent</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  🔒 Prérequis - Optionnel
                </label>
                <select
                  className="input"
                  value={formData.prerequisiteLessonId}
                  onChange={(e) => setFormData({...formData, prerequisiteLessonId: e.target.value})}
                >
                  <option value="">-- Aucun prérequis --</option>
                  {lessons
                    .filter(l => l.subChapterId === formData.subChapterId && l.id !== editingLesson?.id)
                    .sort((a, b) => a.order - b.order)
                    .map(lesson => (
                      <option key={lesson.id} value={lesson.id}>
                        #{lesson.order} - {lesson.title}
                      </option>
                    ))}
                </select>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold">💡 Prérequis (Déblocage) :</p>
                  <p>• L'élève doit TERMINER la leçon prérequise avant d'accéder à celle-ci</p>
                  <p>• Exemple : Correction Ex 1 → débloque → Exercice 2</p>
                  <p className="text-orange-600 mt-2">🔒 Les leçons verrouillées afficheront un cadenas</p>
                </div>
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
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
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

