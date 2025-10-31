import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT : Mettre à jour un badge
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const badge = await prisma.badge.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        rarity: data.rarity,
        masteryPointsRequired: data.masteryPointsRequired,
        masteryPoints: data.masteryPoints,
        order: data.order,
        // Mise à jour des critères JSON avec les animations
        criteria: {
          animation: {
            type: data.animationType || 'none',
            color: data.animationColor || 'gold',
            glowIntensity: data.glowIntensity || 'medium',
            useCustomCSS: data.useCustomCSS || false,
            customCSS: data.customCSS || null
          }
        }
      }
    })
    
    return NextResponse.json({ badge })
  } catch (error) {
    console.error('Erreur PUT badge:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE : Supprimer un badge
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.badge.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE badge:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

