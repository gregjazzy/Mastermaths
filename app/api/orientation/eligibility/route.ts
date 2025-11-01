import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orientationBilans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    // ========== VÉRIFICATIONS D'ÉLIGIBILITÉ ==========

    // 1. Vérifier si l'utilisateur a un abonnement payant (MONTHLY ou ANNUAL)
    if (!user.subscriptionType || (user.subscriptionType !== 'MONTHLY' && user.subscriptionType !== 'ANNUAL')) {
      return NextResponse.json({
        eligible: false,
        message: `Le bilan d'orientation personnalisé est réservé aux abonnés payants.\n\nVous avez actuellement un compte gratuit.\n\nSouscrivez à un abonnement (mensuel ou annuel) pour débloquer cet outil exclusif.`,
      })
    }

    // 2. Vérifier si l'utilisateur a déjà un bilan valide (< 1 an)
    if (user.orientationBilans.length > 0) {
      const existingBilan = user.orientationBilans[0]
      const expiresAt = new Date(existingBilan.expiresAt)
      const now = new Date()

      if (now < expiresAt) {
        // Bilan encore valide
        return NextResponse.json({
          eligible: false,
          message: `Vous avez déjà un bilan d'orientation en cours de validité.\n\nChaque abonné annuel a droit à un bilan par an.\n\nVotre prochain bilan sera disponible le ${expiresAt.toLocaleDateString('fr-FR', { dateStyle: 'long' })}.`,
          existingBilan: {
            id: existingBilan.id,
            createdAt: existingBilan.createdAt,
            expiresAt: existingBilan.expiresAt,
          },
        })
      }
    }

    // ✅ Toutes les conditions sont remplies
    return NextResponse.json({
      eligible: true,
      message: 'Vous êtes éligible pour un bilan d\'orientation personnalisé !',
    })
  } catch (error) {
    console.error('Erreur lors de la vérification d\'éligibilité:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    )
  }
}

