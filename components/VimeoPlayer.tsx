'use client'

import { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'

interface VimeoPlayerProps {
  videoUrl: string
  lessonId: string
  isCorrectionVideo?: boolean
  onProgress?: (percent: number) => void
}

export default function VimeoPlayer({ 
  videoUrl, 
  lessonId, 
  isCorrectionVideo = false,
  onProgress 
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [vimeoId, setVimeoId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Extraire l'ID Vimeo
  const extractVimeoId = (url: string): string | null => {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
      /^(\d+)$/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  useEffect(() => {
    const id = extractVimeoId(videoUrl)
    console.log('🎬 Vimeo ID extrait:', id)
    
    if (!id) {
      console.error('❌ URL Vimeo invalide:', videoUrl)
      setError('URL vidéo invalide')
      return
    }
    
    setVimeoId(id)
  }, [videoUrl])

  // Fonction de tracking simple
  const trackProgress = async (percent: number) => {
    try {
      await fetch(`/api/lessons/${lessonId}/video-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          progress: percent,
          isCorrectionVideo: isCorrectionVideo 
        }),
      })

      if (percent >= 95) {
        await fetch('/api/engagement/badges', {
          method: 'POST'
        })
      }
    } catch (error) {
      console.error('Erreur progression:', error)
    }
  }

  // Pas d'ID = erreur
  if (!vimeoId) {
    return (
      <div className="w-full aspect-video bg-gray-900 dark:bg-gray-950 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold mb-2">❌ Erreur</p>
          <p className="text-sm opacity-80">URL vidéo invalide</p>
        </div>
      </div>
    )
  }

  // SOLUTION SIMPLE : iframe Vimeo native pour TOUS les devices
  return (
    <div className="relative w-full">
      <div className="w-full aspect-video bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&autopause=1&playsinline=1&portrait=0&byline=0&title=0&controls=1&quality=auto`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          title="Vidéo du cours"
          loading="lazy"
        />
      </div>
      
      {/* Info utilisateur */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Cliquez sur la vidéo pour lancer la lecture
      </div>
    </div>
  )
}
