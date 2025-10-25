import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/access-control'
import { prisma } from '@/lib/prisma'

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

    // Récupérer toutes les connexions de l'utilisateur
    const connections = await prisma.connectionLog.findMany({
      where: { userId: user.id },
      orderBy: { connectionDate: 'desc' },
      take: 50 // Limiter aux 50 dernières
    })

    // Statistiques
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)
    thisWeek.setHours(0, 0, 0, 0)

    const connectionsToday = await prisma.connectionLog.count({
      where: {
        userId: user.id,
        connectionDate: { gte: today }
      }
    })

    const connectionsThisWeek = await prisma.connectionLog.count({
      where: {
        userId: user.id,
        connectionDate: { gte: thisWeek }
      }
    })

    const totalConnections = await prisma.connectionLog.count({
      where: { userId: user.id }
    })

    // Calculer les connexions par jour des 7 derniers jours
    const last7Days = await prisma.$queryRaw`
      SELECT 
        DATE("connectionDate") as date,
        COUNT(*) as count
      FROM "ConnectionLog"
      WHERE "userId" = ${user.id}
        AND "connectionDate" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("connectionDate")
      ORDER BY date DESC
    `

    return NextResponse.json({
      connections,
      stats: {
        today: connectionsToday,
        thisWeek: connectionsThisWeek,
        total: totalConnections,
        last7Days
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


