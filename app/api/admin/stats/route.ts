import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'


/**
 * GET /api/admin/stats
 * Récupère les statistiques pour le dashboard admin
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // TODO: Vérifier que l'utilisateur est admin
    // Pour l'instant, tous les utilisateurs connectés peuvent accéder

    const [courses, chapters, lessons, users] = await Promise.all([
      prisma.course.count(),
      prisma.chapter.count(),
      prisma.lesson.count(),
      prisma.user.count()
    ])

    return NextResponse.json({
      courses,
      chapters,
      lessons,
      users
    })

  } catch (error) {
    console.error('[ADMIN STATS ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}


