import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MasteryBadgeService } from '@/lib/mastery-badge-service'
export const dynamic = 'force-dynamic'

/**
 * API pour compléter un exercice et attribuer les badges
 * POST /api/exercises/[exerciseId]/complete
 */
export async function POST(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { score } = body // Score du QCM de l'exercice (0-100)

    // Vérifier que l'exercice existe
    const exercise = await prisma.exercise.findUnique({
      where: { id: params.exerciseId },
      select: { id: true, title: true }
    })

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercice introuvable' },
        { status: 404 }
      )
    }

    // Créer ou mettre à jour la performance
    // Rechercher d'abord la performance existante
    const existingPerformance = await prisma.performance.findFirst({
      where: {
        userId: user.id,
        exerciseId: params.exerciseId
      }
    })

    let performance
    if (existingPerformance) {
      // Mettre à jour
      performance = await prisma.performance.update({
        where: { id: existingPerformance.id },
        data: {
          quizScorePercent: score,
          isCompleted: true,
          lastAccessedAt: new Date()
        }
      })
    } else {
      // Créer
      performance = await prisma.performance.create({
        data: {
          userId: user.id,
          exerciseId: params.exerciseId,
          quizScorePercent: score,
          isCompleted: true,
          lastAccessedAt: new Date()
        }
      })
    }

    // Attribuer le badge de maîtrise si le score est >= 80
    let masteryBadge = null
    if (score >= 80) {
      masteryBadge = await MasteryBadgeService.awardExerciseBadge(
        user.id,
        params.exerciseId,
        score
      )
    }

    return NextResponse.json({
      success: true,
      performance,
      masteryBadge
    })
  } catch (error) {
    console.error('[EXERCISE COMPLETE ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

