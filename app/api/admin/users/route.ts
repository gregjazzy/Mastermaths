import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET : Liste des utilisateurs
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        isSubscribed: true,
        subscriptionType: true,
        subscriptionEndDate: true,
        totalMasteryPoints: true,
        currentStreak: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Erreur GET users:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

