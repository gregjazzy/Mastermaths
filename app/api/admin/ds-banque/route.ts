import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/ds-banque - Liste tous les DS
export async function GET() {
  try {
    const ds = await prisma.dSBanque.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ ds })
  } catch (error) {
    console.error('Erreur GET DS:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/admin/ds-banque - Créer un DS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, niveau, chapter, difficulty, level, duration, pdfUrl, correctionPdfUrl, isPublic } = body

    const ds = await prisma.dSBanque.create({
      data: {
        title,
        description,
        niveau,
        chapter,
        difficulty: difficulty || 3,
        level: level || 'Standard',
        duration,
        pdfUrl,
        correctionPdfUrl,
        isPublic
      }
    })

    return NextResponse.json({ ds })
  } catch (error) {
    console.error('Erreur POST DS:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

