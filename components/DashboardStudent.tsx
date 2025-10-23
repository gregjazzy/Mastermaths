'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  Play, 
  Award,
  ChevronDown,
  ChevronRight,
  Trophy,
  Crown
} from 'lucide-react'
import BadgesSection from './BadgesSection'
import ConnectionStats from './ConnectionStats'
import StreakDisplay from './StreakDisplay'
import LeaderboardWidget from './LeaderboardWidget'
import SessionTracker from './SessionTracker'
import TimeStatsDisplay from './TimeStatsDisplay'

interface LessonPerformance {
  lessonId: string
  lessonTitle: string
  lessonType: string
  videoProgressPercent: number
  quizScorePercent: number | null
  isCompleted: boolean
  hasViewedCorrection: boolean
}

interface SubChapterPerformance {
  subChapterId: string
  subChapterTitle: string
  lessons: LessonPerformance[]
  completionPercent: number
}

interface ChapterPerformance {
  chapterId: string
  chapterTitle: string
  subChapters: SubChapterPerformance[]
  completionPercent: number
}

interface CoursePerformance {
  courseId: string
  courseTitle: string
  chapters: ChapterPerformance[]
  overallCompletion: number
}

export default function DashboardStudent() {
  const router = useRouter()
  const [performances, setPerformances] = useState<CoursePerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [expandedSubChapters, setExpandedSubChapters] = useState<Set<string>>(new Set())
  const [userStats, setUserStats] = useState<{
    currentTitle: string
    totalMasteryPoints: number
    monthlyMasteryPoints: number
    weeklyMasteryPoints: number
    hasFreeCourseReward: boolean
  } | null>(null)

  useEffect(() => {
    fetchPerformances()
    fetchUserStats()
    trackConnection()
  }, [])

  const trackConnection = async () => {
    try {
      await fetch('/api/engagement/track-connection', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Erreur lors du tracking de connexion:', error)
    }
  }

  const fetchPerformances = async () => {
    try {
      const response = await fetch('/api/dashboard/performance')
      const data = await response.json()
      setPerformances(data.courses || [])
    } catch (error) {
      console.error('Erreur lors du chargement des performances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/dashboard/user-stats')
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats utilisateur:', error)
    }
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const toggleSubChapter = (subChapterId: string) => {
    const newExpanded = new Set(expandedSubChapters)
    if (newExpanded.has(subChapterId)) {
      newExpanded.delete(subChapterId)
    } else {
      newExpanded.add(subChapterId)
    }
    setExpandedSubChapters(newExpanded)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_COURS':
      case 'CORRECTION_VIDEO':
        return <Play className="w-4 h-4" />
      case 'QCM':
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  const totalCompletion = performances.length > 0
    ? performances.reduce((sum, course) => sum + course.overallCompletion, 0) / performances.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Tracker - invisible mais actif */}
      <SessionTracker />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-master-dark mb-2">
            Tableau de bord de performance
          </h1>
          <p className="text-gray-600">
            Suivez votre progression et vos résultats détaillés
          </p>
        </div>

        {/* Stats Gamification & PMU */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Titre actuel */}
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-6 h-6" />
                <p className="text-sm opacity-90">Titre actuel</p>
              </div>
              <p className="text-lg font-bold">{userStats.currentTitle}</p>
            </div>

            {/* PMU Total */}
            <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6" />
                <p className="text-sm opacity-90">PMU Total</p>
              </div>
              <p className="text-2xl font-bold">{userStats.totalMasteryPoints.toLocaleString()}</p>
            </div>

            {/* PMU Mensuel */}
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-sm opacity-90 mb-2">PMU ce mois</p>
              <p className="text-2xl font-bold">{userStats.monthlyMasteryPoints.toLocaleString()}</p>
            </div>

            {/* PMU Hebdo */}
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <p className="text-sm opacity-90 mb-2">PMU cette semaine</p>
              <p className="text-2xl font-bold">{userStats.weeklyMasteryPoints.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Lien Hall of Fame + Discord */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/hall-of-fame" className="card hover:shadow-lg transition-all bg-gradient-to-r from-master-turquoise/10 to-master-blue/10 border-2 border-master-turquoise">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏆</div>
              <div className="flex-1">
                <h3 className="font-bold text-master-dark text-lg mb-1">Hall of Fame</h3>
                <p className="text-sm text-gray-600">Découvrez les meilleurs élèves</p>
              </div>
              <ChevronRight className="w-6 h-6 text-master-turquoise" />
            </div>
          </Link>

          <a 
            href="https://discord.gg/mastermaths" 
            target="_blank" 
            rel="noopener noreferrer"
            className="card hover:shadow-lg transition-all bg-[#5865F2]/10 border-2 border-[#5865F2]"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">💬</div>
              <div className="flex-1">
                <h3 className="font-bold text-[#5865F2] text-lg mb-1">Discord Master Maths</h3>
                <p className="text-sm text-gray-600">Rejoignez la communauté</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#5865F2]" />
            </div>
          </a>
        </div>

        {/* Classement Top 10 en aperçu */}
        <div className="mb-8">
          <LeaderboardWidget type="historical" limit={10} compact={true} />
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-master-turquoise to-master-turquoise-dark text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Progression globale</p>
                <p className="text-3xl font-bold">{totalCompletion.toFixed(0)}%</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-master-dark to-master-blue text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Cours en cours</p>
                <p className="text-3xl font-bold">{performances.length}</p>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Activités complétées</p>
                <p className="text-3xl font-bold">
                  {performances.reduce((sum, course) => 
                    sum + course.chapters.reduce((chSum, ch) => 
                      chSum + ch.subChapters.reduce((scSum, sc) => 
                        scSum + sc.lessons.filter(l => 
                          l.isCompleted || l.videoProgressPercent >= 95 || (l.quizScorePercent && l.quizScorePercent >= 50)
                        ).length, 0
                      ), 0
                    ), 0
                  )}
                </p>
              </div>
              <Award className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Série de connexions (Streak) */}
        <StreakDisplay />

        {/* Temps de connexion */}
        <TimeStatsDisplay />

        {/* Statistiques de connexion */}
        <ConnectionStats />

        {/* Section Badges */}
        <div className="mb-8">
          <BadgesSection />
        </div>

        {/* Performances par cours */}
        {performances.map((course) => (
          <div key={course.courseId} className="mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-master-dark flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-master-turquoise" />
                  {course.courseTitle}
                </h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-master-turquoise">
                    {course.overallCompletion.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Complétion</div>
                </div>
              </div>

              <div className="progress-bar mb-6">
                <div 
                  className="progress-fill" 
                  style={{ width: `${course.overallCompletion}%` }}
                />
              </div>

              {/* Chapitres */}
              <div className="space-y-4">
                {course.chapters.map((chapter) => (
                  <div key={chapter.chapterId} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleChapter(chapter.chapterId)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {expandedChapters.has(chapter.chapterId) ? (
                          <ChevronDown className="w-5 h-5 text-master-turquoise" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                        <span className="font-semibold text-master-dark">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-master-turquoise">
                          {chapter.completionPercent.toFixed(0)}%
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-master-turquoise rounded-full transition-all"
                            style={{ width: `${chapter.completionPercent}%` }}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Sous-chapitres */}
                    {expandedChapters.has(chapter.chapterId) && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                        {chapter.subChapters.map((subChapter) => (
                          <div key={subChapter.subChapterId} className="bg-white rounded-lg">
                            <button
                              onClick={() => toggleSubChapter(subChapter.subChapterId)}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {expandedSubChapters.has(subChapter.subChapterId) ? (
                                  <ChevronDown className="w-4 h-4 text-master-turquoise" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <span className="font-medium text-gray-700">
                                  {subChapter.subChapterTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-master-turquoise">
                                  {subChapter.completionPercent.toFixed(0)}%
                                </span>
                                <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-full bg-master-turquoise rounded-full transition-all"
                                    style={{ width: `${subChapter.completionPercent}%` }}
                                  />
                                </div>
                              </div>
                            </button>

                            {/* Leçons */}
                            {expandedSubChapters.has(subChapter.subChapterId) && (
                              <div className="border-t border-gray-200 p-3 space-y-2">
                                {subChapter.lessons.map((lesson) => (
                                  <div
                                    key={lesson.lessonId}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      {getLessonIcon(lesson.lessonType)}
                                      <span className="text-sm text-gray-700">
                                        {lesson.lessonTitle}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      {lesson.lessonType === 'VIDEO_COURS' || lesson.lessonType === 'CORRECTION_VIDEO' ? (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-500">Vidéo:</span>
                                          <span className={`text-sm font-medium ${
                                            lesson.videoProgressPercent >= 95 ? 'text-green-600' : 'text-orange-600'
                                          }`}>
                                            {lesson.videoProgressPercent.toFixed(0)}%
                                          </span>
                                          {lesson.hasViewedCorrection && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                              Correction vue
                                            </span>
                                          )}
                                        </div>
                                      ) : lesson.lessonType === 'QCM' && lesson.quizScorePercent !== null ? (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-500">Score:</span>
                                          <span className={`text-sm font-medium ${
                                            lesson.quizScorePercent === 100 ? 'text-green-600' : 'text-orange-600'
                                          }`}>
                                            {lesson.quizScorePercent.toFixed(0)}%
                                          </span>
                                          {lesson.hasViewedCorrection && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                              Correction vue
                                            </span>
                                          )}
                                        </div>
                                      ) : lesson.isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <span className="text-xs text-gray-400">Non commencé</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {performances.length === 0 && (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun cours commencé
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez un cours pour voir vos performances ici
            </p>
            <button
              onClick={() => router.push('/cours')}
              className="btn-primary"
            >
              Explorer les cours
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

