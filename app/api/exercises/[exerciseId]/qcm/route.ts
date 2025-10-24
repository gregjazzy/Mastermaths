import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

/**
 * API pour récupérer les questions QCM d'un exercice
 * GET /api/exercises/[exerciseId]/qcm
 */
export async function GET(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const questions = await prisma.qcmQuestion.findMany({
      where: { exerciseId: params.exerciseId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('[EXERCISE QCM GET ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

