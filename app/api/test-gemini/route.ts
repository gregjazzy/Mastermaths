import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    
    // Tenter de lister les modèles disponibles
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY
    )
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
      models: data.models?.map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        supportedGenerationMethods: m.supportedGenerationMethods
      })) || []
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message,
        apiKeyConfigured: !!process.env.GEMINI_API_KEY,
        apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
      },
      { status: 500 }
    )
  }
}

