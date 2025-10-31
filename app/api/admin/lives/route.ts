import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/lives - Liste tous les lives
export async function GET() {
  try {
    const lives = await prisma.live.findMany({
      orderBy: { scheduledAt: 'desc' }
    })

    return NextResponse.json({ lives })
  } catch (error) {
    console.error('Erreur GET lives:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/admin/lives - Créer un live
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, niveau, theme, scheduledAt, duration, everwebinarUrl, isActive } = body

    const live = await prisma.live.create({
      data: {
        title,
        description,
        niveau,
        theme,
        scheduledAt: new Date(scheduledAt),
        duration,
        everwebinarUrl,
        isActive
      }
    })

    return NextResponse.json({ live })
  } catch (error) {
    console.error('Erreur POST live:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

