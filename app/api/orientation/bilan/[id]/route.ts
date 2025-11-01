import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const bilan = await prisma.orientationBilan.findUnique({
      where: { id: params.id },
    })

    if (!bilan) {
      return NextResponse.json({ error: 'Bilan introuvable' }, { status: 404 })
    }

    // Vérifier que le bilan appartient bien à l'utilisateur
    if (bilan.userId !== user.id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    return NextResponse.json({
      id: bilan.id,
      status: bilan.status,
      resultat: bilan.resultat,
      errorMessage: bilan.errorMessage,
      createdAt: bilan.createdAt,
      expiresAt: bilan.expiresAt,
    })
  } catch (error: any) {
    console.error('Erreur lors de la récupération du bilan:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

