import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Endpoint de diagnostic SMTP
 * GET /api/debug-smtp
 */
export async function GET(request: NextRequest) {
  const port = parseInt(process.env.SMTP_PORT || '587')
  const secure = port === 465

  return NextResponse.json({
    configured: !!process.env.SMTP_USER,
    config: {
      host: process.env.SMTP_HOST || 'NOT_SET',
      port: port,
      secure: secure,
      requireTLS: !secure,
      user: process.env.SMTP_USER || 'NOT_SET',
      from: process.env.SMTP_FROM || 'NOT_SET',
      hasPassword: !!process.env.SMTP_PASSWORD,
      passwordLength: process.env.SMTP_PASSWORD?.length || 0,
    },
    recommendations: {
      zoho_port_587: 'smtp.zoho.com:587 avec STARTTLS (secure: false, requireTLS: true)',
      zoho_port_465: 'smtp.zoho.com:465 avec SSL (secure: true)',
      gmail_port_587: 'smtp.gmail.com:587 avec STARTTLS',
    },
    timestamp: new Date().toISOString(),
  })
}

