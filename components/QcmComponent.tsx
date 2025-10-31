'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import BadgeCelebrationPopup, { BadgeEarned } from './BadgeCelebrationPopup'
import { celebrateQcmScore } from '@/lib/celebration'

interface QcmQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number | null
  correctAnswers: number[]
  isMultipleChoice: boolean
  explanation?: string
  order: number
}

interface QcmComponentProps {
  lessonId?: string
  exerciseId?: string
  onComplete?: (score: number) => void
}

export default function QcmComponent({ lessonId, exerciseId, onComplete }: QcmComponentProps) {
  const [questions, setQuestions] = useState<QcmQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({}) // Peut être un nombre ou un tableau
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [badgeEarned, setBadgeEarned] = useState<BadgeEarned | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchQuestions()
  }, [lessonId, exerciseId])

  const fetchQuestions = async () => {
    try {
      // Déterminer l'URL en fonction de ce qui est fourni
      const url = lessonId 
        ? `/api/lessons/${lessonId}/qcm`
        : `/api/exercises/${exerciseId}/qcm`
      
      const response = await fetch(url)
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number, isMultiple: boolean) => {
    if (submitted) return
    
    if (isMultiple) {
      // Choix multiple : ajouter/retirer de la liste
      const currentAnswers = (answers[questionId] as number[]) || []
      const newAnswers = currentAnswers.includes(answerIndex)
        ? currentAnswers.filter(i => i !== answerIndex)
        : [...currentAnswers, answerIndex]
      setAnswers({ ...answers, [questionId]: newAnswers })
    } else {
      // Choix unique
      setAnswers({ ...answers, [questionId]: answerIndex })
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error('❌ Veuillez répondre à toutes les questions')
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading('⏳ Évaluation en cours...')

    try {
      // Calculer le score
      let correct = 0
      questions.forEach((q) => {
        if (q.isMultipleChoice) {
          // Choix multiple : vérifier que les tableaux sont identiques
          const userAnswers = (answers[q.id] as number[]) || []
          const correctAnswers = q.correctAnswers || []
          const isCorrect = userAnswers.length === correctAnswers.length &&
            userAnswers.every(a => correctAnswers.includes(a))
          if (isCorrect) correct++
        } else {
          // Choix unique
          if (answers[q.id] === q.correctAnswer) {
            correct++
          }
        }
      })

      const scorePercent = (correct / questions.length) * 100

      // Envoyer le score à l'API complete (qui attribue les badges)
      const url = lessonId 
        ? `/api/lessons/${lessonId}/complete`
        : `/api/exercises/${exerciseId}/complete`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          score: scorePercent,
          answers: answers 
        }),
      })

      const result = await response.json()

      // Afficher le badge si gagné (pour leçon ou exercice)
      if (result.badges?.lesson || result.masteryBadge) {
        const badge = result.badges?.lesson || result.masteryBadge
        if (badge) {
          // Mapper le badge de l'API vers le format BadgeEarned
          const badgeLevel = badge.level === 'GOLD' ? 'gold' : badge.level === 'SILVER' ? 'silver' : 'bronze'
          const pmuAwarded = badge.pmuAwarded || (badge.level === 'GOLD' ? 60 : badge.level === 'SILVER' ? 40 : 20)
          
          setBadgeEarned({
            emoji: badgeLevel === 'gold' ? '🏆' : badgeLevel === 'silver' ? '🥈' : '🥉',
            level: badgeLevel,
            title: `Badge ${badgeLevel === 'gold' ? 'Or' : badgeLevel === 'silver' ? 'Argent' : 'Bronze'} !`,
            description: badge.entityName || `${badge.type || 'Réussite'} complété${badge.score ? ` à ${badge.score}%` : ''} !`,
            pmu: pmuAwarded
          })
        }
      }

      setScore(scorePercent)
      setSubmitted(true)
      onComplete?.(scorePercent)
      
      // Toast selon le score
      toast.dismiss(loadingToast)
      if (scorePercent === 100) {
        toast.success('🎉 PARFAIT ! Score de 100% !', { duration: 4000 })
      } else if (scorePercent >= 90) {
        toast.success(`✅ Excellent ! Score de ${scorePercent.toFixed(0)}%`)
      } else if (scorePercent >= 80) {
        toast.success(`👍 Bien joué ! Score de ${scorePercent.toFixed(0)}%`)
      } else if (scorePercent >= 50) {
        toast('📚 Pas mal ! Score de ' + scorePercent.toFixed(0) + '% - Continue tes efforts !', {
          icon: '💪',
        })
      } else {
        toast('🔄 Score de ' + scorePercent.toFixed(0) + '% - N\'hésite pas à réviser', {
          icon: '📖',
        })
      }
      
      // Déclencher la célébration visuelle
      setTimeout(() => {
        if (containerRef.current) {
          celebrateQcmScore(containerRef.current, scorePercent)
        }
      }, 300) // Petit délai pour que l'UI se mette à jour d'abord
    } catch (error) {
      console.error('Erreur lors de la soumission du QCM:', error)
      toast.dismiss(loadingToast)
      toast.error('❌ Erreur lors de la soumission')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetQuiz = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p>Aucune question disponible pour ce QCM.</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {submitted && score !== null && (
        <div className={`rounded-lg p-6 ${
          score === 100 
            ? 'bg-green-50 border border-green-200' 
            : score >= 50 
            ? 'bg-orange-50 border border-orange-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-4">
            {score === 100 ? (
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                score === 100 ? 'text-green-900' : 'text-orange-900'
              }`}>
                {score === 100 ? 'Parfait !' : 'Résultat'}
              </h3>
              <p className={`text-lg ${
                score === 100 ? 'text-green-800' : 'text-orange-800'
              }`}>
                Votre score : <span className="font-bold">{score.toFixed(0)}%</span>
              </p>
              <p className={`text-sm mt-1 ${
                score === 100 ? 'text-green-700' : 'text-orange-700'
              }`}>
                {score === 100 
                  ? 'Félicitations ! Vous avez répondu correctement à toutes les questions.'
                  : 'Vous pouvez réessayer ou consulter la vidéo de correction si disponible.'
                }
              </p>
            </div>
          </div>
          <button
            onClick={resetQuiz}
            className="mt-4 btn-outline"
          >
            Réessayer le QCM
          </button>
        </div>
      )}

      {questions.map((question, index) => {
        const userAnswer = answers[question.id]
        
        // Vérifier si la réponse est correcte
        const isCorrect = submitted && (
          question.isMultipleChoice
            ? Array.isArray(userAnswer) && userAnswer.length === question.correctAnswers.length &&
              userAnswer.every(a => question.correctAnswers.includes(a))
            : userAnswer === question.correctAnswer
        )
        
        const isIncorrect = submitted && userAnswer !== undefined && !isCorrect

        return (
          <div 
            key={question.id} 
            className={`card ${
              submitted 
                ? isCorrect 
                  ? 'border-2 border-green-500' 
                  : isIncorrect 
                  ? 'border-2 border-red-500'
                  : ''
                : ''
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 bg-master-turquoise text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-master-dark">
                  {question.question}
                </h3>
                {question.isMultipleChoice && (
                  <p className="text-sm text-gray-600 mt-1">Plusieurs réponses possibles</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => {
                const isSelected = question.isMultipleChoice
                  ? Array.isArray(userAnswer) && userAnswer.includes(optionIndex)
                  : userAnswer === optionIndex
                
                const isCorrectAnswer = question.isMultipleChoice
                  ? question.correctAnswers.includes(optionIndex)
                  : question.correctAnswer === optionIndex
                
                const showCorrect = submitted && isCorrectAnswer
                const showIncorrect = submitted && isSelected && !isCorrectAnswer

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.id, optionIndex, question.isMultipleChoice)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showIncorrect
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-master-turquoise bg-master-turquoise/10'
                        : 'border-gray-300 hover:border-master-turquoise hover:bg-gray-50'
                    } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {question.isMultipleChoice ? (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-master-turquoise border-master-turquoise' : 'border-gray-400'
                          }`}>
                            {isSelected && <span className="text-white text-xs">✓</span>}
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-master-turquoise' : 'border-gray-400'
                          }`}>
                            {isSelected && <div className="w-3 h-3 rounded-full bg-master-turquoise" />}
                          </div>
                        )}
                        <span className={`${showCorrect || showIncorrect ? 'font-semibold' : ''}`}>
                          {option}
                        </span>
                      </div>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {submitted && question.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Explication : </span>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        )
      })}

      {!submitted && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length || isSubmitting}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre mes réponses'}
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        {Object.keys(answers).length} / {questions.length} questions répondues
      </div>

      {/* Badge Popup */}
      <BadgeCelebrationPopup 
        badge={badgeEarned} 
        onClose={() => setBadgeEarned(null)}
        type={lessonId ? 'lesson' : 'exercise'}
      />
    </div>
  )
}

