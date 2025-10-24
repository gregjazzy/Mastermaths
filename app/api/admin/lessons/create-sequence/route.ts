import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createExerciseSequence } from '@/lib/prerequisite-service'
export const dynamic = 'force-dynamic'


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { videoLessonId, subChapterId, count } = body

    if (!videoLessonId || !subChapterId || !count) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Le nombre d\'exercices doit être entre 1 et 20' },
        { status: 400 }
      )
    }

    const lessons = await createExerciseSequence(videoLessonId, subChapterId, count)

    return NextResponse.json({
      success: true,
      message: `${count} exercices créés avec succès (${count * 3} leçons au total)`,
      lessons
    })
  } catch (error) {
    console.error('[CREATE_EXERCISE_SEQUENCE ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


