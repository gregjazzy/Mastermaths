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
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastProgressUpdate = useRef(0)

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

  const vimeoId = extractVimeoId(videoUrl)

  useEffect(() => {
    // Si pas d'ID valide, mode fallback direct
    if (!vimeoId) {
      console.error('URL Vimeo invalide:', videoUrl)
      setError('URL vidéo invalide')
      setUseFallback(true)
      return
    }

    // Détecter mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Sur mobile, utiliser directement l'iframe HTML native
    if (isMobile) {
      console.log('📱 Mobile détecté - Mode iframe natif')
      setUseFallback(true)
      setIsReady(true)
      return
    }

    // Sur desktop, essayer le SDK Vimeo
    if (!containerRef.current) return

    try {
      const player = new Player(containerRef.current, {
        id: parseInt(vimeoId),
        width: 1920,
        responsive: true,
        playsinline: true,
        controls: true,
        muted: false,
        background: false,
        autopause: true,
        byline: false,
        portrait: false,
        title: false,
        transparent: false,
      })

      playerRef.current = player

      player.ready()
        .then(() => {
          console.log('✅ Vimeo SDK chargé')
          setIsReady(true)
        })
        .catch((err) => {
          console.error('❌ Erreur Vimeo SDK:', err)
          setError('Erreur de chargement du player')
          setUseFallback(true)
        })

      // Tracking progression
      player.on('timeupdate', async (data) => {
        const percent = (data.percent * 100)
        if (Math.abs(percent - lastProgressUpdate.current) >= 5) {
          lastProgressUpdate.current = percent
          onProgress?.(percent)
          await updateVideoProgress(lessonId, percent, isCorrectionVideo)
        }
      })

      player.on('timeupdate', async (data) => {
        if (data.percent >= 0.95) {
          await updateVideoProgress(lessonId, 100, isCorrectionVideo)
        }
      })

      return () => {
        player.destroy()
      }
    } catch (err) {
      console.error('❌ Erreur initialisation Vimeo:', err)
      setError('Impossible d\'initialiser le player')
      setUseFallback(true)
    }
  }, [videoUrl, lessonId, isCorrectionVideo, vimeoId])

  const updateVideoProgress = async (lessonId: string, percent: number, isCorrection: boolean) => {
    try {
      await fetch(`/api/lessons/${lessonId}/video-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          progress: percent,
          isCorrectionVideo: isCorrection 
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

  // MODE FALLBACK : iframe HTML native (mobile + erreurs)
  if (useFallback && vimeoId) {
    return (
      <div className="relative w-full">
        <div className="w-full aspect-video bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&autopause=1&playsinline=1&portrait=0&byline=0&title=0&controls=1`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            title="Vidéo du cours"
          />
        </div>
        {error && (
          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            ⚠️ Mode de compatibilité activé
          </div>
        )}
      </div>
    )
  }

  // MODE NORMAL : SDK Vimeo (desktop)
  return (
    <div className="relative w-full">
      <div 
        ref={containerRef} 
        className="w-full aspect-video bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden touch-manipulation"
        style={{
          WebkitPlaysinline: 'true',
        } as React.CSSProperties}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-950 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise mx-auto mb-4"></div>
            <p className="text-white text-sm">Chargement de la vidéo...</p>
          </div>
        </div>
      )}
    </div>
  )
}