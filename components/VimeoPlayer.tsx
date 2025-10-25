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
  const [useUltraSimple, setUseUltraSimple] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vimeoId, setVimeoId] = useState<string | null>(null)
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

  useEffect(() => {
    const id = extractVimeoId(videoUrl)
    setVimeoId(id)
    
    if (!id) {
      console.error('❌ URL Vimeo invalide:', videoUrl)
      setError('URL vidéo invalide')
      setUseUltraSimple(true)
      return
    }

    // Détecter mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    
    console.log('📱 Device:', { isMobile, isIOS, userAgent: navigator.userAgent })

    // STRATÉGIE 1 : Sur iOS, toujours utiliser le mode ultra-simple
    if (isIOS) {
      console.log('🍎 iOS détecté → Mode ultra-simple direct')
      setUseUltraSimple(true)
      setIsReady(true)
      return
    }

    // STRATÉGIE 2 : Sur Android, utiliser iframe native
    if (isMobile && !isIOS) {
      console.log('📱 Mobile Android détecté → Mode iframe natif')
      setUseFallback(true)
      setIsReady(true)
      return
    }

    // STRATÉGIE 3 : Desktop - essayer SDK avec timeout
    console.log('🖥️ Desktop détecté → Tentative SDK Vimeo')
    
    if (!containerRef.current) {
      console.warn('⚠️ Container ref not ready, retrying...')
      return
    }
    
    // Timeout de 5 secondes pour le SDK
    const sdkTimeout = setTimeout(() => {
      console.warn('⏰ SDK Vimeo timeout → Basculement iframe')
      if (!isReady) {
        setUseFallback(true)
        setIsReady(true)
      }
    }, 5000)

    try {
      const player = new Player(containerRef.current, {
        id: parseInt(id),
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
          clearTimeout(sdkTimeout)
          console.log('✅ SDK Vimeo chargé avec succès')
          setIsReady(true)
        })
        .catch((err) => {
          clearTimeout(sdkTimeout)
          console.error('❌ Erreur SDK Vimeo:', err)
          setUseFallback(true)
          setIsReady(true)
        })

      // Tracking progression (desktop uniquement)
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
        clearTimeout(sdkTimeout)
        if (playerRef.current) {
          try {
            playerRef.current.destroy()
          } catch (e) {
            console.warn('Player already destroyed')
          }
        }
      }
    } catch (err) {
      clearTimeout(sdkTimeout)
      console.error('❌ Exception SDK Vimeo:', err)
      setUseFallback(true)
      setIsReady(true)
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

      if (percent >= 95) {
        await fetch('/api/engagement/badges', {
          method: 'POST'
        })
      }
    } catch (error) {
      console.error('Erreur progression:', error)
    }
  }

  // MODE ULTRA-SIMPLE : Lien direct Vimeo (iOS + fallback ultime)
  if (useUltraSimple && vimeoId) {
    console.log('🎬 Rendu mode ULTRA-SIMPLE (lien direct)')
    return (
      <div className="w-full space-y-4">
        {/* Lien direct vers Vimeo */}
        <a 
          href={`https://vimeo.com/${vimeoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full aspect-video bg-gradient-to-br from-master-dark to-master-blue 
            rounded-lg overflow-hidden relative group hover:shadow-2xl transition-all duration-300"
        >
          {/* Overlay avec icône play */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4
              group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-lg font-semibold">Ouvrir la vidéo</p>
            <p className="text-sm opacity-80">Vimeo</p>
          </div>
          
          {/* Thumbnail Vimeo en background */}
          <img 
            src={`https://vumbnail.com/${vimeoId}.jpg`}
            alt="Aperçu vidéo"
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </a>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 Tapez pour ouvrir la vidéo dans Vimeo
        </div>
      </div>
    )
  }

  // MODE FALLBACK : iframe HTML native (mobile Android + desktop fallback)
  if (useFallback && vimeoId) {
    console.log('🎬 Rendu mode FALLBACK (iframe native)')
    return (
      <div className="relative w-full">
        <div className="w-full aspect-video bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}?h=&autoplay=0&autopause=1&playsinline=1&portrait=0&byline=0&title=0&controls=1&quality=auto`}
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
          />
        </div>
        {error && (
          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Mode de compatibilité activé
          </div>
        )}
      </div>
    )
  }

  // MODE NORMAL : SDK Vimeo (desktop)
  console.log('🎬 Rendu mode NORMAL (SDK Vimeo)')
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
