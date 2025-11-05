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

export default function QcmAdminPage({ params }: { params: { lessonId: string } }) {
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
  }, [params.lessonId])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/admin/qcm/${params.lessonId}`)
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
        : `/api/admin/qcm/${params.lessonId}`

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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/lessons" className="btn-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour aux leçons
          </Link>
          <h1 className="text-3xl font-bold text-master-dark">Gestion des Questions QCM</h1>
        </div>

        {/* Bouton Ajouter */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mb-6 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter une question
          </button>
        )}

        {/* Formulaire */}
        {showForm && (
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingQuestion ? 'Modifier la question' : 'Nouvelle question'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium mb-1">Question *</label>
                <textarea
                  required
                  className="input min-h-[100px]"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Quelle est la dérivée de x² ?"
                />
              </div>

              {/* Type de QCM */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMultipleChoice}
                    onChange={(e) => setFormData({
                      ...formData,
                      isMultipleChoice: e.target.checked,
                      correctAnswers: e.target.checked ? [] : []
                    })}
                    className="w-5 h-5"
                  />
                  <span className="font-medium">Choix multiples (plusieurs réponses correctes)</span>
                </label>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-2">Options (minimum 2) *</label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => {
                    const isCorrect = formData.isMultipleChoice
                      ? formData.correctAnswers.includes(index)
                      : formData.correctAnswer === index
                    
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleCorrectAnswer(index)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCorrect
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {isCorrect && '✓'}
                        </button>
                        <input
                          type="text"
                          className="input flex-1"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Cliquez sur le cercle pour marquer une réponse comme correcte
                </p>
              </div>

              {/* Explication */}
              <div>
                <label className="block text-sm font-medium mb-1">Explication (optionnelle)</label>
                <textarea
                  className="input min-h-[80px]"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explication de la bonne réponse..."
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
                <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
                <input
                  type="number"
                  className="input w-32"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingQuestion ? 'Mettre à jour' : 'Créer'}
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
            questions.map((question, idx) => (
              <div key={question.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-master-turquoise">
                        Q{idx + 1}
                      </span>
                      {question.isMultipleChoice && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Choix multiple
                        </span>
                      )}
                    </div>

                    <p className="text-lg font-medium text-gray-800 mb-4">{question.question}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optIdx) => {
                        const isCorrect = question.isMultipleChoice
                          ? question.correctAnswers.includes(optIdx)
                          : question.correctAnswer === optIdx

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrect && <span className="text-green-600 font-bold">✓</span>}
                              <span>{option}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">💡 Explication :</span> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
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


