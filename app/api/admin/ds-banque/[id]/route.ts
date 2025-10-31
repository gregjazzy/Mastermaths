import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/ds-banque/[id] - Modifier un DS
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, niveau, chapter, difficulty, level, duration, pdfUrl, correctionPdfUrl, isPublic } = body

    const ds = await prisma.dSBanque.update({
      where: { id: params.id },
      data: {
        title,
        description,
        niveau,
        chapter,
        difficulty,
        level,
        duration,
        pdfUrl,
        correctionPdfUrl,
        isPublic
      }
    })

    return NextResponse.json({ ds })
  } catch (error) {
    console.error('Erreur PUT DS:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/admin/ds-banque/[id] - Supprimer un DS
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.dSBanque.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE DS:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

