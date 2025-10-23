'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Download, ZoomIn, X } from 'lucide-react'

interface MentalMapViewerProps {
  mapUrl: string
  title: string
  description?: string
}

export default function MentalMapViewer({ mapUrl, title, description }: MentalMapViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* En-tête */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-master-dark mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Carte mentale */}
      <div className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
        <div className="relative w-full aspect-video cursor-pointer" onClick={() => setIsFullscreen(true)}>
          <Image
            src={mapUrl}
            alt={title}
            fill
            className="object-contain p-4"
            priority
          />
          
          {/* Overlay zoom */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all flex items-center justify-center group">
            <div className="bg-white/90 text-master-dark px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <ZoomIn className="w-5 h-5" />
              <span className="font-semibold">Cliquer pour agrandir</span>
            </div>
          </div>
        </div>

        {/* Bouton télécharger */}
        <div className="absolute top-4 right-4">
          <a
            href={mapUrl}
            download
            className="bg-white/95 hover:bg-white text-master-dark p-2 rounded-lg shadow-lg transition-all flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Télécharger</span>
          </a>
        </div>
      </div>

      {/* Informations */}
      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-900">
          <span className="font-semibold">💡 Conseil :</span> Utilisez cette carte mentale pour réviser et mémoriser les concepts clés du chapitre.
        </p>
      </div>

      {/* Modal plein écran */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={mapUrl}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}


