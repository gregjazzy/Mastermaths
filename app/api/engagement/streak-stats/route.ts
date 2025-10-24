import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/access-control'
import { ConnectionService } from '@/lib/connection-service'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const stats = await ConnectionService.getUserConnectionStats(user.id)

    if (!stats) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des stats de streak:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


