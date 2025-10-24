import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/access-control'
import { MasteryBadgeService } from '@/lib/mastery-badge-service'

/**
 * GET /api/mastery-badges
 * Récupère tous les badges de maîtrise de l'utilisateur connecté
 */
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const badges = await MasteryBadgeService.getUserMasteryBadges(user.id)

    // Grouper les badges par type
    const grouped = {
      lesson: badges.filter(b => b.type === 'LESSON'),
      chapter: badges.filter(b => b.type === 'CHAPTER'),
      course: badges.filter(b => b.type === 'COURSE')
    }

    // Compter par niveau
    const stats = {
      gold: badges.filter(b => b.level === 'GOLD').length,
      silver: badges.filter(b => b.level === 'SILVER').length,
      bronze: badges.filter(b => b.level === 'BRONZE').length,
      total: badges.length
    }

    return NextResponse.json({
      badges: grouped,
      stats
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des badges:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

