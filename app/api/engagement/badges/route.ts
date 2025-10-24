import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/access-control'
import { BadgeService } from '@/lib/badge-service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Évaluer et débloquer les nouveaux badges
    const newBadges = await BadgeService.evaluateUserBadges(user.id)

    return NextResponse.json({ 
      success: true,
      newBadges,
      message: newBadges.length > 0 
        ? `${newBadges.length} nouveau(x) badge(s) débloqué(s)!`
        : 'Aucun nouveau badge'
    })
  } catch (error) {
    console.error('Erreur lors de l\'évaluation des badges:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les badges de l'utilisateur
    const badges = await BadgeService.getUserBadges(user.id)

    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Erreur lors de la récupération des badges:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


