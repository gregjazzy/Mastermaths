import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET : Liste des badges
export async function GET(request: NextRequest) {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { order: 'asc' }
    })
    
    // Parser les critères pour extraire les animations
    const badgesWithAnimation = badges.map(badge => {
      const criteria = badge.criteria as any
      const animation = criteria?.animation || {}
      
      return {
        ...badge,
        animationType: animation.type || 'none',
        animationColor: animation.color || 'gold',
        glowIntensity: animation.glowIntensity || 'medium',
        useCustomCSS: animation.useCustomCSS || false,
        customCSS: animation.customCSS || null,
      }
    })
    
    return NextResponse.json({ badges: badgesWithAnimation })
  } catch (error) {
    console.error('Erreur GET badges:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

