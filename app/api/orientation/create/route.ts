import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { EmailService } from '@/lib/email-service'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
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

    // Vérifier l'éligibilité
    if (!user.subscriptionType || (user.subscriptionType !== 'MONTHLY' && user.subscriptionType !== 'ANNUAL')) {
      return NextResponse.json({ error: 'Abonnement payant requis' }, { status: 403 })
    }

    const { questionnaire } = await request.json()

    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire manquant' }, { status: 400 })
    }

    // ========== CRÉATION DU BILAN EN PENDING ==========

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // +1 an

    const bilan = await prisma.orientationBilan.create({
      data: {
        userId: user.id,
        questionnaire: questionnaire as any,
        status: 'PENDING',
        createdAt: now,
        expiresAt: expiresAt,
      },
    })

    // ========== ENVOI EMAIL DE CONFIRMATION DE RÉCEPTION ==========
    
    try {
      await EmailService.sendOrientationQuestionnaireReceived(
        user.email,
        user.name || 'Étudiant',
        user.emailsNotification || []
      )
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError)
      // On continue même si l'email échoue
    }

    // ========== LANCER LA GÉNÉRATION EN ARRIÈRE-PLAN ==========
    
    // Appel asynchrone non-bloquant
    fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orientation/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bilanId: bilan.id }),
    }).catch(error => {
      console.error('Erreur lancement génération:', error)
    })

    return NextResponse.json({
      success: true,
      bilanId: bilan.id,
      message: 'Bilan en cours de génération',
    })
  } catch (error: any) {
    console.error('Erreur lors de la génération du bilan:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur lors de la génération' },
      { status: 500 }
    )
  }
}

