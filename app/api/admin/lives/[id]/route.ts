import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/lives/[id] - Modifier un live
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, niveau, theme, scheduledAt, duration, everwebinarUrl, isActive } = body

    const live = await prisma.live.update({
      where: { id: params.id },
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
    console.error('Erreur PUT live:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/admin/lives/[id] - Supprimer un live
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.live.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE live:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

