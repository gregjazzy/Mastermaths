'use client'

import { FileText, Download, ExternalLink, School } from 'lucide-react'

interface LyceesRepertoireViewerProps {
  pdfUrl: string
  title: string
  description?: string
}

export default function LyceesRepertoireViewer({ 
  pdfUrl, 
  title, 
  description 
}: LyceesRepertoireViewerProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* En-tête */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <School className="w-6 h-6 text-white" />
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

      {/* Aperçu PDF */}
      <div className="bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden mb-4">
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="w-full h-96"
          title={title}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Télécharger */}
        <a
          href={pdfUrl}
          download
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Télécharger le PDF
        </a>

        {/* Ouvrir dans un nouvel onglet */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          Ouvrir en grand
        </a>
      </div>

      {/* Informations */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">📚 Répertoire :</span> Retrouvez les annales et sujets des grands lycées français pour vous entraîner.
        </p>
      </div>
    </div>
  )
}


