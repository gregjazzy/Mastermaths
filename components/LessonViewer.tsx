'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import VimeoPlayer from './VimeoPlayer'
import QcmComponent from './QcmComponent'

interface Lesson {
  id: string
  title: string
  type: string
  contentUrl?: string
  isCorrectionVideo: boolean
  linkedQcmId?: string
  subChapter: {
    title: string
    chapter: {
      title: string
    }
  }
}

interface UnlockStatus {
  isUnlocked: boolean
  prerequisiteRequired: boolean
  prerequisiteLesson?: {
    id: string
    title: string
    type: string
  }
}

interface LessonViewerProps {
  lessonId: string
  onComplete?: () => void
}

export default function LessonViewer({ lessonId, onComplete }: LessonViewerProps) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [unlockStatus, setUnlockStatus] = useState<UnlockStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCorrectionVideo, setShowCorrectionVideo] = useState(false)
  const [correctionVideoUrl, setCorrectionVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchLessonAndUnlockStatus()
  }, [lessonId])

  const fetchLessonAndUnlockStatus = async () => {
    try {
      const [lessonRes, unlockRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}`),
        fetch(`/api/lessons/${lessonId}/unlock-status`)
      ])
      
      const lessonData = await lessonRes.json()
      const unlockData = await unlockRes.json()
      
      setLesson(lessonData)
      setUnlockStatus(unlockData)

      // Vérifier si on doit afficher la vidéo de correction
      if (lessonData.type === 'QCM' && unlockData.isUnlocked) {
        checkCorrectionVideoAvailability(lessonData.id)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la leçon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLesson = fetchLessonAndUnlockStatus

  const checkCorrectionVideoAvailability = async (qcmId: string) => {
    try {
      const response = await fetch(`/api/lessons/${qcmId}/correction-status`)
      const data = await response.json()
      
      if (data.shouldShowCorrection) {
        setShowCorrectionVideo(true)
        setCorrectionVideoUrl(data.correctionVideoUrl)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la correction:', error)
    }
  }

  const handleMarkComplete = async () => {
    setIsCompleting(true)
    try {
      await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
      })

      // Évaluer les badges après complétion de la leçon
      await fetch('/api/engagement/badges', {
        method: 'POST'
      })

      onComplete?.()
      router.refresh()
    } catch (error) {
      console.error('Erreur lors du marquage comme complété:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleQcmComplete = async (score: number) => {
    // Évaluer les badges après complétion du QCM
    try {
      await fetch('/api/engagement/badges', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Erreur lors de l\'évaluation des badges:', error)
    }

    // Recharger la leçon pour vérifier si la vidéo de correction doit être affichée
    // La vidéo de correction s'affiche SEULEMENT si score < 100%
    if (score < 100 && lesson?.type === 'QCM') {
      await checkCorrectionVideoAvailability(lesson.id)
    } else if (score === 100) {
      // Si score parfait, on s'assure de ne pas afficher la correction
      setShowCorrectionVideo(false)
      setCorrectionVideoUrl(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p>Leçon non trouvée</p>
      </div>
    )
  }

  // Si la leçon est verrouillée
  if (unlockStatus && !unlockStatus.isUnlocked) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            {lesson.subChapter.chapter.title} / {lesson.subChapter.title}
          </div>
          <h1 className="text-3xl font-bold text-master-dark mb-2 flex items-center gap-3">
            <Lock className="w-8 h-8 text-orange-500" />
            {lesson.title}
          </h1>
          <div className="inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
            🔒 Leçon verrouillée
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8 text-center">
          <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-orange-900 mb-4">
            Cette leçon est verrouillée
          </h2>
          <p className="text-gray-700 mb-6">
            Vous devez d'abord terminer la leçon prérequise :
          </p>
          {unlockStatus.prerequisiteLesson && (
            <div className="bg-white border border-orange-300 rounded-lg p-4 mb-6 inline-block">
              <p className="font-semibold text-lg text-master-dark">
                {unlockStatus.prerequisiteLesson.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {getLessonTypeLabel(unlockStatus.prerequisiteLesson.type)}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-600">
            💡 Complétez la leçon prérequise pour débloquer celle-ci
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          {lesson.subChapter.chapter.title} / {lesson.subChapter.title}
        </div>
        <h1 className="text-3xl font-bold text-master-dark mb-2">{lesson.title}</h1>
        <div className="inline-block px-3 py-1 bg-master-turquoise/10 text-master-turquoise rounded-full text-sm font-medium">
          {getLessonTypeLabel(lesson.type)}
        </div>
      </div>

      {/* Contenu dynamique selon le type */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {lesson.type === 'VIDEO_COURS' && lesson.contentUrl && (
          <VimeoPlayer
            videoUrl={lesson.contentUrl}
            lessonId={lesson.id}
            onProgress={(percent) => console.log('Progression:', percent)}
          />
        )}

        {lesson.type === 'CORRECTION_VIDEO' && lesson.contentUrl && (
          <div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900">Vidéo de correction</h3>
                  <p className="text-sm text-orange-700">
                    Cette vidéo vous aide à comprendre les erreurs communes et à maîtriser le sujet.
                  </p>
                </div>
              </div>
            </div>
            <VimeoPlayer
              videoUrl={lesson.contentUrl}
              lessonId={lesson.id}
              isCorrectionVideo={true}
            />
          </div>
        )}

        {lesson.type === 'QCM' && (
          <div>
            <QcmComponent lessonId={lesson.id} onComplete={handleQcmComplete} />
            
            {/* Afficher la vidéo de correction si nécessaire */}
            {showCorrectionVideo && correctionVideoUrl && (
              <div className="mt-8 border-t pt-8">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-900">Vidéo de correction disponible</h3>
                      <p className="text-sm text-orange-700">
                        Votre score est inférieur à 100%. Regardez cette vidéo pour comprendre vos erreurs.
                      </p>
                    </div>
                  </div>
                </div>
                <VimeoPlayer
                  videoUrl={correctionVideoUrl}
                  lessonId={lessonId}
                  isCorrectionVideo={true}
                />
              </div>
            )}
          </div>
        )}

        {(lesson.type === 'EXO_ECRIT' || lesson.type === 'DS' || lesson.type === 'CARTOGRAPHIE' || lesson.type === 'METHODE') && (
          <div>
            {lesson.contentUrl && (
              <div className="mb-6">
                {/* Si c'est un PDF, l'afficher directement */}
                {lesson.contentUrl.toLowerCase().includes('.pdf') || 
                 lesson.contentUrl.includes('drive.google.com') ||
                 lesson.contentUrl.includes('dropbox.com') ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {lesson.type === 'DS' ? 'Sujet du Devoir Surveillé' : 'Document de l\'exercice'}
                        </span>
                      </div>
                      <a
                        href={lesson.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Ouvrir dans un nouvel onglet
                      </a>
                    </div>
                    <div className="w-full h-[800px] border rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        src={lesson.contentUrl.includes('drive.google.com') 
                          ? lesson.contentUrl.replace('/view', '/preview')
                          : lesson.contentUrl}
                        className="w-full h-full"
                        title={lesson.title}
                      />
                    </div>
                  </div>
                ) : (
                  // Sinon, juste un lien de téléchargement
                  <a
                    href={lesson.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-primary"
                  >
                    <FileText className="w-5 h-5" />
                    Télécharger le document
                  </a>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6 text-center mt-6">
              <FileText className="w-16 h-16 text-master-turquoise mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-master-dark mb-2">
                {lesson.type === 'EXO_ECRIT' && 'Exercice écrit'}
                {lesson.type === 'DS' && 'Devoir Surveillé (DS)'}
                {lesson.type === 'CARTOGRAPHIE' && 'Cartographie'}
                {lesson.type === 'METHODE' && 'Méthode'}
              </h3>
              <p className="text-gray-600 mb-6">
                {lesson.type === 'DS' 
                  ? 'Complétez ce devoir surveillé et marquez-le comme terminé une fois que vous avez fini.'
                  : 'Complétez cet exercice et marquez-le comme terminé une fois que vous avez fini.'}
              </p>
              <button
                onClick={handleMarkComplete}
                disabled={isCompleting}
                className="btn-primary inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isCompleting ? 'Enregistrement...' : 'Marquer comme complété'}
              </button>
            </div>
          </div>
        )}

        {lesson.type === 'CORRECTION_DOCUMENT' && lesson.contentUrl && (
          <div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900">Correction PDF</h3>
                  <p className="text-sm text-purple-700">
                    Consultez la correction détaillée de l'exercice.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Correction détaillée</span>
                </div>
                <a
                  href={lesson.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Ouvrir dans un nouvel onglet
                </a>
              </div>
              <div className="w-full h-[800px] border rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={lesson.contentUrl.includes('drive.google.com') 
                    ? lesson.contentUrl.replace('/view', '/preview')
                    : lesson.contentUrl}
                  className="w-full h-full"
                  title={lesson.title}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getLessonTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    VIDEO_COURS: 'Vidéo de cours',
    QCM: 'Quiz',
    CORRECTION_VIDEO: 'Correction vidéo',
    CORRECTION_DOCUMENT: 'Correction PDF',
    EXO_ECRIT: 'Exercice écrit',
    DS: 'Devoir Surveillé',
    CARTOGRAPHIE: 'Cartographie',
    METHODE: 'Méthode',
  }
  return labels[type] || type
}

