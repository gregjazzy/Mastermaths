import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET : Liste des badges
export async function GET(request: NextRequest) {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Erreur GET badges:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

