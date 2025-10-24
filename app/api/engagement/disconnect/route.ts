import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/engagement/disconnect
 * Finalise une session de connexion (appelé quand l'utilisateur quitte)
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

    // Finaliser la session
    const now = new Date()
    const connectionLog = await prisma.connectionLog.findUnique({
      where: { id: sessionId }
    })

    if (!connectionLog) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    // Calculer la durée finale
    const connectedAt = new Date(connectionLog.createdAt)
    const durationMs = now.getTime() - connectedAt.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))

    // Mettre à jour la session avec la durée finale
    await prisma.connectionLog.update({
      where: { id: sessionId },
      data: {
        durationMinutes
      }
    })

    console.log(`[DISCONNECT] Session ${sessionId} finalisée - ${durationMinutes} minutes`)

    return NextResponse.json({ 
      success: true,
      durationMinutes
    })

  } catch (error) {
    console.error('[DISCONNECT ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la finalisation de la session' },
      { status: 500 }
    )
  }
}


