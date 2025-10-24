import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/engagement/heartbeat
 * Met à jour la session de connexion active (appelé toutes les 2-3 minutes)
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Mettre à jour le disconnectedAt de la session active
    const now = new Date()
    const connectionLog = await prisma.connectionLog.findUnique({
      where: { id: sessionId }
    })

    if (!connectionLog) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    // Calculer la durée en minutes
    const connectedAt = new Date(connectionLog.createdAt)
    const durationMs = now.getTime() - connectedAt.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))

    // Mettre à jour la session
    await prisma.connectionLog.update({
      where: { id: sessionId },
      data: {
        durationMinutes
      }
    })

    console.log(`[HEARTBEAT] Session ${sessionId} mise à jour - ${durationMinutes} minutes`)

    return NextResponse.json({ 
      success: true,
      durationMinutes
    })

  } catch (error) {
    console.error('[HEARTBEAT ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du heartbeat' },
      { status: 500 }
    )
  }
}


