import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'


// PUT : Mettre à jour une question
export async function PUT(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      question, 
      options, 
      correctAnswer, 
      correctAnswers, 
      isMultipleChoice, 
      explanation, 
      order,
      questionImageUrl,
      questionPdfUrl,
      questionVideoUrl,
      explanationImageUrl,
      explanationPdfUrl,
      explanationVideoUrl
    } = body

    const qcmQuestion = await prisma.qcmQuestion.update({
      where: { id: params.questionId },
      data: {
        question,
        options,
        correctAnswer: isMultipleChoice ? null : correctAnswer,
        correctAnswers: isMultipleChoice ? correctAnswers : [],
        isMultipleChoice: isMultipleChoice || false,
        explanation: explanation || null,
        order,
        questionImageUrl: questionImageUrl || null,
        questionPdfUrl: questionPdfUrl || null,
        questionVideoUrl: questionVideoUrl || null,
        explanationImageUrl: explanationImageUrl || null,
        explanationPdfUrl: explanationPdfUrl || null,
        explanationVideoUrl: explanationVideoUrl || null
      }
    })

    return NextResponse.json({ question: qcmQuestion, success: true })
  } catch (error) {
    console.error('[QCM PUT ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE : Supprimer une question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    await prisma.qcmQuestion.delete({
      where: { id: params.questionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[QCM DELETE ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


