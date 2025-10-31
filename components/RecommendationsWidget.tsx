'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, TrendingUp, Target, ArrowRight } from 'lucide-react'

interface RecommendedLesson {
  id: string
  title: string
  type: string
  courseId: string
  courseName: string
  chapterId: string
  chapterName: string
  subChapterId: string
  subChapterName: string
  reason: 'next_logical' | 'weak_area' | 'first_lesson'
  reasonText: string
}

interface Recommendation {
  primary: RecommendedLesson | null
  review?: {
    lesson: RecommendedLesson
    averageScore: number
  }
}

export default function RecommendationsWidget() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations')
      if (response.ok) {
        const data = await response.json()
        setRecommendation(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!recommendation?.primary && !recommendation?.review) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Recommandation principale */}
      {recommendation.primary && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {recommendation.primary.reason === 'first_lesson' && (
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Target className="h-6 w-6" />
                </div>
              )}
              {recommendation.primary.reason === 'next_logical' && (
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">Prochaine Étape</h3>
                <p className="text-white/90 text-sm">{recommendation.primary.reasonText}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-white/80">
              {recommendation.primary.courseName} • {recommendation.primary.chapterName}
            </p>
            <h4 className="font-bold text-xl">{recommendation.primary.title}</h4>
            <p className="text-sm text-white/90">{recommendation.primary.subChapterName}</p>
          </div>

          <Link
            href={`/cours/${recommendation.primary.courseId}/lecon/${recommendation.primary.id}`}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md"
          >
            <BookOpen className="h-5 w-5" />
            Commencer maintenant
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      )}

      {/* Recommandation de révision */}
      {recommendation.review && (
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">À Réviser</h3>
                <p className="text-white/90 text-sm">{recommendation.review.lesson.reasonText}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-white/80">
              {recommendation.review.lesson.courseName} • {recommendation.review.lesson.chapterName}
            </p>
            <h4 className="font-bold text-xl">{recommendation.review.lesson.title}</h4>
            <p className="text-sm text-white/90">{recommendation.review.lesson.subChapterName}</p>
          </div>

          <Link
            href={`/cours/${recommendation.review.lesson.courseId}/lecon/${recommendation.review.lesson.id}`}
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md"
          >
            <BookOpen className="h-5 w-5" />
            Réviser maintenant
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}

