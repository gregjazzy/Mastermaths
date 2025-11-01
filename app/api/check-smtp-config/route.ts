import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint de vérification de la configuration SMTP
 * GET /api/check-smtp-config
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    configured: !!process.env.SMTP_USER,
    smtp_host: process.env.SMTP_HOST || 'NON CONFIGURÉ',
    smtp_port: process.env.SMTP_PORT || 'NON CONFIGURÉ',
    smtp_user: process.env.SMTP_USER ? '✅ Configuré' : '❌ NON CONFIGURÉ',
    smtp_password: process.env.SMTP_PASSWORD ? '✅ Configuré (masqué)' : '❌ NON CONFIGURÉ',
    smtp_from: process.env.SMTP_FROM || 'NON CONFIGURÉ',
    message: process.env.SMTP_USER 
      ? '✅ Configuration SMTP complète' 
      : '❌ Variables SMTP manquantes. Configurez-les sur Netlify → Site settings → Environment variables'
  })
}

