'use client'

import { ExternalLink } from 'lucide-react'

interface AppLinkButtonProps {
  url: string
  title?: string | null
  description?: string | null
  source: 'subchapter' | 'lesson'
}

export default function AppLinkButton({ url, title, description, source }: AppLinkButtonProps) {
  const displayTitle = title || (source === 'subchapter' ? 'Application externe' : 'Outil complémentaire')
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      title={description || displayTitle}
    >
      <ExternalLink className="w-5 h-5" />
      <div className="flex flex-col items-start">
        <span className="font-semibold text-sm">{displayTitle}</span>
        {description && (
          <span className="text-xs opacity-90">{description}</span>
        )}
      </div>
    </a>
  )
}

