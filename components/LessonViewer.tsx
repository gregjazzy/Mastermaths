'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import VimeoPlayer from './VimeoPlayer'
import QcmComponent from './QcmComponent'

interface Lesson {
  id: string
  title: string
  type: string
  contentUrl?: string
  exerciseUrl?: string
  correctionVideoUrl?: string
  correctionDocumentUrl?: string
  subChapter: {
    title: string
    chapter: {
      title: string
    }
  }
  qcmQuestions?: any[]
}

interface LessonViewerProps {
  lessonId: string
  onComplete?: () => void
}

export default function LessonViewer({ lessonId, onComplete }: LessonViewerProps) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCorrections, setShowCorrections] = useState(false)
  const [qcmCompleted, setQcmCompleted] = useState(false)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      console.log('🔍 LessonViewer: Fetching lesson', lessonId)
      const lessonRes = await fetch(`/api/lessons/${lessonId}`)
      
      if (!lessonRes.ok) {
        console.error('❌ LessonViewer: Failed to fetch lesson', lessonRes.status)
        return
      }
      
      const lessonData = await lessonRes.json()
      console.log('✅ LessonViewer: Lesson fetched successfully', lessonData.title)
      setLesson(lessonData)
    } catch (error) {
      console.error('❌ LessonViewer: Error loading lesson:', error)
    } finally {
      setIsLoading(false)
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

    // Marquer le QCM comme terminé et afficher les corrections
    setQcmCompleted(true)
    setShowCorrections(true)
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 space-y-8">
        {/* 1. COURS VIDÉO */}
        {lesson.type === 'VIDEO_COURS' && lesson.contentUrl && (
          <div className="w-full">
            <VimeoPlayer
              videoUrl={lesson.contentUrl}
              lessonId={lesson.id}
              onProgress={(percent) => console.log('Progression:', percent)}
            />
          </div>
        )}

        {/* 2. EXERCICE OU DS */}
        {(lesson.type === 'EXO_ECRIT' || lesson.type === 'DS') && (
          <div className="space-y-8">
            {/* Énoncé PDF */}
            {lesson.exerciseUrl && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {lesson.type === 'DS' ? '📋 Sujet du Devoir Surveillé' : '📝 Énoncé de l\'exercice'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Document PDF</span>
                    </div>
                    <a
                      href={lesson.exerciseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                  <div className="w-full h-[800px] border rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={lesson.exerciseUrl.includes('drive.google.com') 
                        ? lesson.exerciseUrl.replace('/view', '/preview')
                        : lesson.exerciseUrl}
                      className="w-full h-full"
                      title={`Énoncé - ${lesson.title}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* QCM intégré */}
            {lesson.qcmQuestions && lesson.qcmQuestions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ✅ QCM de validation
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                  <QcmComponent lessonId={lesson.id} onComplete={handleQcmComplete} />
                </div>
              </div>
            )}

            {/* Corrections (après QCM) */}
            {showCorrections && qcmCompleted && (
              <div className="space-y-6 border-t-4 border-orange-200 pt-8">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-900 text-lg">🎓 Corrections disponibles</h3>
                      <p className="text-sm text-orange-700 mt-1">
                        Consultez les corrections ci-dessous pour comprendre la méthode et consolider vos connaissances.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vidéo correction */}
                {lesson.correctionVideoUrl && (
                  <div>
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      🎥 Correction en vidéo
                    </h4>
                    <VimeoPlayer
                      videoUrl={lesson.correctionVideoUrl}
                      lessonId={lesson.id}
                      isCorrectionVideo={true}
                    />
                  </div>
                )}

                {/* PDF correction */}
                {lesson.correctionDocumentUrl && (
                  <div>
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      📄 Correction PDF
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-900">Document de correction</span>
                        </div>
                        <a
                          href={lesson.correctionDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-700 underline"
                        >
                          Ouvrir dans un nouvel onglet
                        </a>
                      </div>
                      <div className="w-full h-[800px] border rounded-lg overflow-hidden shadow-lg">
                        <iframe
                          src={lesson.correctionDocumentUrl.includes('drive.google.com') 
                            ? lesson.correctionDocumentUrl.replace('/view', '/preview')
                            : lesson.correctionDocumentUrl}
                          className="w-full h-full"
                          title={`Correction - ${lesson.title}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. AUTRES TYPES (MÉTHODE, CARTOGRAPHIE) */}
        {(lesson.type === 'METHODE' || lesson.type === 'CARTOGRAPHIE') && lesson.contentUrl && (
          <div>
            {lesson.contentUrl.toLowerCase().includes('.pdf') || 
             lesson.contentUrl.includes('drive.google.com') ||
             lesson.contentUrl.includes('dropbox.com') ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {lesson.type === 'METHODE' ? 'Fiche méthode' : 'Carte mentale'}
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

        {/* Bouton de complétion pour les types simples */}
        {!['EXO_ECRIT', 'DS'].includes(lesson.type) && (
          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleMarkComplete}
              disabled={isCompleting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isCompleting ? 'Enregistrement...' : 'Marquer comme complété'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function getLessonTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    VIDEO_COURS: '🎥 Cours vidéo',
    EXO_ECRIT: '📝 Exercice',
    DS: '📋 Devoir Surveillé',
    METHODE: '💡 Fiche méthode',
    CARTOGRAPHIE: '🗺️ Carte mentale',
  }
  return labels[type] || type
}

