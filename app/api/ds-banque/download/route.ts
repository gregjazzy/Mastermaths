import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { dsId } = await request.json()

    if (!dsId) {
      return NextResponse.json(
        { error: 'dsId requis' },
        { status: 400 }
      )
    }

    // Enregistrer le téléchargement
    await prisma.dSDownload.create({
      data: {
        userId: session.user.id,
        dsId
      }
    })

    // Incrémenter le compteur de vues
    await prisma.dSBanque.update({
      where: { id: dsId },
      data: {
        viewCount: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du téléchargement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

