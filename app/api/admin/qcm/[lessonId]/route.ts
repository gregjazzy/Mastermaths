import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET : Récupérer toutes les questions d'un QCM (déjà existant - on le garde)
export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const questions = await prisma.qcmQuestion.findMany({
      where: { lessonId: params.lessonId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('[QCM GET ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST : Créer une nouvelle question
export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { question, options, correctAnswer, correctAnswers, isMultipleChoice, explanation, order } = body

    // Validation
    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Question et au moins 2 options requises' },
        { status: 400 }
      )
    }

    if (isMultipleChoice && (!correctAnswers || correctAnswers.length === 0)) {
      return NextResponse.json(
        { error: 'Au moins une réponse correcte requise pour un QCM multiple' },
        { status: 400 }
      )
    }

    if (!isMultipleChoice && correctAnswer === undefined) {
      return NextResponse.json(
        { error: 'Réponse correcte requise pour un QCM simple' },
        { status: 400 }
      )
    }

    const qcmQuestion = await prisma.qcmQuestion.create({
      data: {
        lessonId: params.lessonId,
        question,
        options,
        correctAnswer: isMultipleChoice ? null : correctAnswer,
        correctAnswers: isMultipleChoice ? correctAnswers : [],
        isMultipleChoice: isMultipleChoice || false,
        explanation: explanation || null,
        order: order || 1
      }
    })

    return NextResponse.json({ question: qcmQuestion, success: true })
  } catch (error) {
    console.error('[QCM POST ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


