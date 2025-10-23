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
  const playerRef = useRef<Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const lastProgressUpdate = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Extraire l'ID Vimeo de l'URL
    const vimeoId = extractVimeoId(videoUrl)
    if (!vimeoId) {
      console.error('URL Vimeo invalide:', videoUrl)
      return
    }

    // Initialiser le player Vimeo
    const player = new Player(containerRef.current, {
      id: parseInt(vimeoId),
      width: 1920,
      responsive: true,
    })

    playerRef.current = player

    player.ready().then(() => {
      setIsReady(true)
    })

    // Écouter les événements de progression
    player.on('timeupdate', async (data) => {
      const percent = (data.percent * 100)
      
      // Mettre à jour seulement tous les 5%
      if (Math.abs(percent - lastProgressUpdate.current) >= 5) {
        lastProgressUpdate.current = percent
        onProgress?.(percent)
        
        // Enregistrer la progression dans la base de données
        await updateVideoProgress(lessonId, percent, isCorrectionVideo)
      }
    })

    // Marquer comme vu à 95% (presque complété)
    player.on('timeupdate', async (data) => {
      if (data.percent >= 0.95) {
        await updateVideoProgress(lessonId, 100, isCorrectionVideo)
      }
    })

    return () => {
      player.destroy()
    }
  }, [videoUrl, lessonId, isCorrectionVideo])

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

      // Si la vidéo est complétée à 95%+, évaluer les badges
      if (percent >= 95) {
        await fetch('/api/engagement/badges', {
          method: 'POST'
        })
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error)
    }
  }

  const extractVimeoId = (url: string): string | null => {
    // Gérer différents formats d'URL Vimeo
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

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef} 
        className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden"
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
        </div>
      )}
    </div>
  )
}

