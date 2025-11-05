'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface QcmQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number | null
  correctAnswers: number[]
  isMultipleChoice: boolean
  explanation: string | null
  order: number
  questionImageUrl?: string | null
  questionPdfUrl?: string | null
  questionVideoUrl?: string | null
  explanationImageUrl?: string | null
  explanationPdfUrl?: string | null
  explanationVideoUrl?: string | null
}

export default function QcmExerciseAdminPage({ params }: { params: { exerciseId: string } }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<QcmQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QcmQuestion | null>(null)

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    correctAnswers: [] as number[],
    isMultipleChoice: false,
    explanation: '',
    order: 1,
    questionImageUrl: '',
    questionPdfUrl: '',
    questionVideoUrl: '',
    explanationImageUrl: '',
    explanationPdfUrl: '',
    explanationVideoUrl: ''
  })

  useEffect(() => {
    fetchQuestions()
  }, [params.exerciseId])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/admin/qcm-exercise/${params.exerciseId}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const validOptions = formData.options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) {
      alert('Au moins 2 options sont requises')
      return
    }

    if (formData.isMultipleChoice && formData.correctAnswers.length === 0) {
      alert('Sélectionnez au moins une réponse correcte')
      return
    }

    try {
      const url = editingQuestion
        ? `/api/admin/qcm/question/${editingQuestion.id}`
        : `/api/admin/qcm-exercise/${params.exerciseId}`

      const response = await fetch(url, {
        method: editingQuestion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          options: validOptions
        })
      })

      if (response.ok) {
        await fetchQuestions()
        resetForm()
        alert(editingQuestion ? 'Question mise à jour !' : 'Question créée !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (question: QcmQuestion) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      options: [...question.options, '', '', '', ''].slice(0, 4),
      correctAnswer: question.correctAnswer || 0,
      correctAnswers: question.correctAnswers || [],
      isMultipleChoice: question.isMultipleChoice,
      explanation: question.explanation || '',
      order: question.order,
      questionImageUrl: question.questionImageUrl || '',
      questionPdfUrl: question.questionPdfUrl || '',
      questionVideoUrl: question.questionVideoUrl || '',
      explanationImageUrl: question.explanationImageUrl || '',
      explanationPdfUrl: question.explanationPdfUrl || '',
      explanationVideoUrl: question.explanationVideoUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm('Supprimer cette question ?')) return

    try {
      const response = await fetch(`/api/admin/qcm/question/${questionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchQuestions()
        alert('Question supprimée !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      correctAnswers: [],
      isMultipleChoice: false,
      explanation: '',
      order: questions.length + 1,
      questionImageUrl: '',
      questionPdfUrl: '',
      questionVideoUrl: '',
      explanationImageUrl: '',
      explanationPdfUrl: '',
      explanationVideoUrl: ''
    })
    setEditingQuestion(null)
    setShowForm(false)
  }

  const toggleCorrectAnswer = (index: number) => {
    if (formData.isMultipleChoice) {
      const newCorrectAnswers = formData.correctAnswers.includes(index)
        ? formData.correctAnswers.filter(i => i !== index)
        : [...formData.correctAnswers, index]
      setFormData({ ...formData, correctAnswers: newCorrectAnswers })
    } else {
      setFormData({ ...formData, correctAnswer: index })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/exercises" className="text-master-turquoise hover:underline flex items-center gap-2 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux exercices
            </Link>
            <h1 className="text-3xl font-bold text-master-dark">
              ✅ QCM de l'exercice
            </h1>
            <p className="text-gray-600 mt-2">
              {questions.length} question{questions.length > 1 ? 's' : ''} créée{questions.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle question
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="card mb-8 bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editingQuestion ? '✏️ Modifier la question' : '➕ Ajouter une question'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium mb-2">Question *</label>
                <textarea
                  required
                  className="input min-h-[100px]"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="Ex: Quelle est la solution de x² - 5x + 6 = 0 ?"
                />
              </div>

              {/* Type de QCM */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isMultipleChoice}
                  onChange={(e) => setFormData({
                    ...formData,
                    isMultipleChoice: e.target.checked,
                    correctAnswers: []
                  })}
                  className="w-5 h-5 text-master-turquoise rounded"
                />
                <label className="font-medium">Réponses multiples autorisées</label>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-2">Options de réponse *</label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type={formData.isMultipleChoice ? 'checkbox' : 'radio'}
                        checked={formData.isMultipleChoice 
                          ? formData.correctAnswers.includes(index)
                          : formData.correctAnswer === index
                        }
                        onChange={() => toggleCorrectAnswer(index)}
                        className="w-5 h-5 text-green-600"
                      />
                      <input
                        type="text"
                        className="input flex-1"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options]
                          newOptions[index] = e.target.value
                          setFormData({...formData, options: newOptions})
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Cochez les bonnes réponses
                </p>
              </div>

              {/* Explication */}
              <div>
                <label className="block text-sm font-medium mb-2">Explication (optionnel)</label>
                <textarea
                  className="input min-h-[80px]"
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  placeholder="Expliquez pourquoi c'est la bonne réponse..."
                />
              </div>

              {/* Médias pour l'énoncé */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">📸 Médias pour l'énoncé</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de l'image</label>
                    <input
                      type="url"
                      className="input"
                      value={formData.questionImageUrl}
                      onChange={(e) => setFormData({ ...formData, questionImageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL du PDF</label>
                    <input
                      type="url"
                      className="input"
                      value={formData.questionPdfUrl}
                      onChange={(e) => setFormData({ ...formData, questionPdfUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de la vidéo</label>
                    <input
                      type="url"
                      className="input"
                      value={formData.questionVideoUrl}
                      onChange={(e) => setFormData({ ...formData, questionVideoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Médias pour l'explication */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">📚 Médias pour l'explication</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de l'image</label>
                    <input
                      type="url"
                      className="input"
                      value={formData.explanationImageUrl}
                      onChange={(e) => setFormData({ ...formData, explanationImageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL du PDF</label>
                    <input
                      type="url"
                      className="input"
                      value={formData.explanationPdfUrl}
                      onChange={(e) => setFormData({ ...formData, explanationPdfUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de la vidéo</label>
                    <input
                      type="url"
                      className="input"
                      value={formData.explanationVideoUrl}
                      onChange={(e) => setFormData({ ...formData, explanationVideoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Ordre */}
              <div>
                <label className="block text-sm font-medium mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  min="1"
                  className="input w-32"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingQuestion ? 'Mettre à jour' : 'Créer la question'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des questions */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucune question créée</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Créer la première question
              </button>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-master-turquoise">
                        #{idx + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-master-dark">
                        {q.question}
                      </h3>
                      {q.isMultipleChoice && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          Réponses multiples
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      {q.options.map((option, optIdx) => {
                        const isCorrect = q.isMultipleChoice
                          ? q.correctAnswers.includes(optIdx)
                          : q.correctAnswer === optIdx
                        
                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2 p-2 rounded ${
                              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                            }`}
                          >
                            {isCorrect && <span className="text-green-600">✓</span>}
                            <span className="text-sm">{option}</span>
                          </div>
                        )
                      })}
                    </div>

                    {q.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          <strong>💡 Explication :</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(q)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
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

