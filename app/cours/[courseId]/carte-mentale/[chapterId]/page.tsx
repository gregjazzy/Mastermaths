'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

interface Concept {
  id: string
  label: string
  x: number
  y: number
  radius: number
}

interface MindMapConfig {
  chapterId: string
  imageUrl: string
  concepts: Concept[]
}

export default function MindMapPage() {
  const params = useParams()
  const chapterId = params.chapterId as string
  const courseId = params.courseId as string
  const router = useRouter()
  
  const [config, setConfig] = useState<MindMapConfig | null>(null)
  const [checkedConcepts, setCheckedConcepts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [hoveredConcept, setHoveredConcept] = useState<string | null>(null)

  const handleBack = () => {
    router.back()
  }

  // Charger la configuration et la progression
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger la config
        const configRes = await fetch(`/mindmaps/${chapterId}-config.json`)
        const configData = await configRes.json()
        setConfig(configData)

        // Charger la progression utilisateur
        const progressRes = await fetch(`/api/mindmap/progress?chapterId=${chapterId}`)
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          setCheckedConcepts(new Set(progressData.checkedConcepts || []))
        }
      } catch (error) {
        console.error('Erreur chargement Mind Map:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [chapterId])

  // Toggle concept
  const handleToggleConcept = async (conceptId: string) => {
    const newChecked = new Set(checkedConcepts)
    const isChecked = newChecked.has(conceptId)
    
    if (isChecked) {
      newChecked.delete(conceptId)
    } else {
      newChecked.add(conceptId)
    }
    
    setCheckedConcepts(newChecked)

    // Sauvegarder en BDD
    try {
      await fetch('/api/mindmap/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId,
          conceptKey: conceptId,
          isChecked: !isChecked
        })
      })
    } catch (error) {
      console.error('Erreur sauvegarde progression:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <p className="text-gray-600">Chargement de la carte mentale...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <p className="text-red-600">Erreur: Carte mentale non trouvée</p>
          <button onClick={handleBack} className="btn-primary mt-4">
            Retour
          </button>
        </div>
      </div>
    )
  }

  const progress = (checkedConcepts.size / config.concepts.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Retour"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Carte Mentale</h1>
                <p className="text-sm text-gray-600">Cliquez sur les concepts pour les valider</p>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progression</span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">
              {checkedConcepts.size} / {config.concepts.length} concepts
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Carte mentale interactive */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Carte interactive</h3>
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              <div className="absolute inset-0">
                <Image
                  src={config.imageUrl}
                  alt="Carte mentale"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
                <svg className="absolute inset-0 w-full h-full">
                  {config.concepts.map((concept) => {
                    const isChecked = checkedConcepts.has(concept.id)
                    const isHovered = hoveredConcept === concept.id

                    return (
                      <g key={concept.id}>
                        {/* Zone cliquable */}
                        <circle
                          cx={concept.x}
                          cy={concept.y}
                          r={concept.radius}
                          fill={
                            isChecked
                              ? 'rgba(34, 197, 94, 0.3)'
                              : isHovered
                              ? 'rgba(59, 130, 246, 0.3)'
                              : 'transparent'
                          }
                          stroke={isChecked ? '#22c55e' : isHovered ? '#3b82f6' : '#94a3b8'}
                          strokeWidth={isChecked ? 3 : isHovered ? 2 : 1}
                          className="cursor-pointer transition-all"
                          onClick={() => handleToggleConcept(concept.id)}
                          onMouseEnter={() => setHoveredConcept(concept.id)}
                          onMouseLeave={() => setHoveredConcept(null)}
                        />
                        {isChecked && (
                          <text
                            x={concept.x}
                            y={concept.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={concept.radius * 0.8}
                            fill="#22c55e"
                            pointerEvents="none"
                          >
                            ✓
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Liste des concepts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Concepts du chapitre</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {config.concepts.map((concept) => {
                const isChecked = checkedConcepts.has(concept.id)
                return (
                  <button
                    key={concept.id}
                    onClick={() => handleToggleConcept(concept.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isChecked
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-left font-medium ${
                      isChecked ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {concept.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Message de félicitations si tout est coché */}
            {checkedConcepts.size === config.concepts.length && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  🎉 Chapitre maîtrisé !
                </h3>
                <p className="text-green-600">
                  Vous avez validé tous les concepts de ce chapitre. Excellent travail !
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au cours
          </button>
        </div>
      </div>
    </div>
  )
}

