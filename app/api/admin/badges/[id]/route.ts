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
        // Mise à jour des critères JSON avec les animations
        criteria: {
          ...(data.criteria || {}),
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

