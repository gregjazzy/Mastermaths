'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { X, Maximize2, Minimize2, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

// Import dynamique pour éviter les erreurs SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d').then(mod => mod.default), { ssr: false })

interface GraphNode {
  id: string
  name: string
  type: 'course' | 'chapter' | 'subchapter' | 'lesson'
  isCompleted: boolean
  color: string
  size: number
  courseId?: string
}

interface GraphLink {
  source: string
  target: string
  color: string
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export default function KnowledgeGraphPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const router = useRouter()
  
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const graphRef = useRef<any>()

  const handleBack = () => {
    router.back()
  }

  useEffect(() => {
    loadGraphData()
  }, [courseId])

  const loadGraphData = async () => {
    try {
      const res = await fetch(`/api/knowledge-graph/${courseId}`)
      if (!res.ok) throw new Error('Erreur chargement graphe')
      
      const data = await res.json()
      setGraphData(buildGraphData(data))
    } catch (error) {
      console.error('Erreur chargement Knowledge Graph:', error)
    } finally {
      setLoading(false)
    }
  }

  const buildGraphData = (courseData: any): GraphData => {
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []

    // Espacements adaptatifs selon la taille d'écran
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const chapterSpacing = isMobile ? 100 : 180
    const subChapterSpacing = isMobile ? 70 : 120
    const lessonSpacing = isMobile ? 50 : 80
    let chapterX = -((courseData.chapters.length - 1) * chapterSpacing) / 2

    // Nœud du cours (centre)
    nodes.push({
      id: courseData.id,
      name: courseData.title,
      type: 'course',
      isCompleted: false,
      color: '#0891b2',
      size: isMobile ? 15 : 20,
      courseId: courseData.id,
      fx: 0 as any // Force au centre
    } as any)

    courseData.chapters.forEach((chapter: any, chapterIndex: number) => {
      const chapterId = `chapter-${chapter.id}`
      const chapterCompleted = chapter.subChapters.every((sc: any) => 
        sc.lessons.every((l: any) => l.isCompleted)
      )

      nodes.push({
        id: chapterId,
        name: chapter.title,
        type: 'chapter',
        isCompleted: chapterCompleted,
        color: chapterCompleted ? '#22c55e' : '#6366f1',
        size: isMobile ? 12 : 15,
        courseId: courseData.id,
        fx: chapterX as any
      } as any)

      links.push({
        source: courseData.id,
        target: chapterId,
        color: chapterCompleted ? '#22c55e' : '#9ca3af'
      })

      let subChapterX = chapterX - ((chapter.subChapters.length - 1) * subChapterSpacing) / 2

      chapter.subChapters.forEach((subChapter: any) => {
        const subChapterId = `subchapter-${subChapter.id}`
        const subChapterCompleted = subChapter.lessons.every((l: any) => l.isCompleted)

        nodes.push({
          id: subChapterId,
          name: subChapter.title,
          type: 'subchapter',
          isCompleted: subChapterCompleted,
          color: subChapterCompleted ? '#22c55e' : '#8b5cf6',
          size: 12,
          courseId: courseData.id,
          fx: subChapterX as any
        } as any)

        links.push({
          source: chapterId,
          target: subChapterId,
          color: subChapterCompleted ? '#22c55e' : '#9ca3af'
        })

        let lessonX = subChapterX - ((subChapter.lessons.length - 1) * lessonSpacing) / 2

        subChapter.lessons.forEach((lesson: any) => {
          const lessonId = `lesson-${lesson.id}`

          nodes.push({
            id: lessonId,
            name: lesson.title,
            type: 'lesson',
            isCompleted: lesson.isCompleted,
            color: lesson.isCompleted ? '#22c55e' : '#f59e0b',
            size: 8,
            courseId: courseData.id,
            fx: lessonX as any
          } as any)

          links.push({
            source: subChapterId,
            target: lessonId,
            color: lesson.isCompleted ? '#22c55e' : '#9ca3af'
          })

          lessonX += lessonSpacing
        })

        subChapterX += subChapterSpacing
      })

      chapterX += chapterSpacing
    })

    return { nodes, links }
  }

  const handleNodeClick = (node: any) => {
    if (node.type === 'lesson') {
      // Clic sur une leçon → ouvrir la leçon
      const lessonId = node.id.replace('lesson-', '')
      router.push(`/cours/${node.courseId}/lecon/${lessonId}`)
    } else if (node.type === 'course') {
      // Clic sur le cours → retourner à la page du cours
      router.push(`/cours`)
    } else if (node.type === 'chapter' || node.type === 'subchapter') {
      // Clic sur chapitre/sous-chapitre → retourner à la page du cours (timeline)
      // L'utilisateur verra la timeline et pourra naviguer
      router.push(`/cours/${node.courseId}`)
    }
  }

  const getNodeLabel = (node: any) => {
    const statusEmoji = node.isCompleted ? '✓ ' : ''
    
    // Retourner le nom COMPLET pour le tooltip au hover
    return `${statusEmoji}${node.name}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <p className="text-gray-600">Chargement du graphe de connaissances...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'min-h-screen'} bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col`}>
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm p-3 md:p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white mb-1">Graphe de Connaissances</h1>
            <p className="text-xs md:text-sm text-gray-300 hidden sm:block">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Complété
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500 ml-4 mr-2"></span>
              En cours
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400 ml-4 mr-2"></span>
              À faire
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:block"
            title={isFullscreen ? "Réduire" : "Plein écran"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Graphe */}
      <div className="flex-1 relative">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel={getNodeLabel}
          nodeColor={(node: any) => node.color}
          nodeRelSize={8}
          nodeVal={(node: any) => node.size}
          linkColor={(link: any) => link.color}
          linkWidth={2}
          dagMode="td"
          dagLevelDistance={120}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={3}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.3}
          // d3Force désactivé car on utilise fx/fy pour le positionnement manuel
          // d3Force={(engine: any) => {
          //   engine.force('collide', d3.forceCollide()
          //     .radius(80)
          //     .strength(1)
          //   )
          // }}
          onNodeClick={handleNodeClick}
          onNodeDragEnd={(node: any) => {
            node.fx = node.x
            node.fy = node.y
          }}
          nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
            const fontSize = isMobile ? 9 / globalScale : 11 / globalScale
            const nodeSize = node.size * (isMobile ? 1.5 : 1.2)
            
            // Cercle du nœud
            ctx.beginPath()
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI)
            ctx.fillStyle = node.color
            ctx.fill()
            
            // Bordure
            ctx.strokeStyle = node.isCompleted ? '#fff' : 'rgba(255,255,255,0.6)'
            ctx.lineWidth = 2 / globalScale
            ctx.stroke()

            // Label
            const maxLen = 15
            const label = node.name.length > maxLen ? node.name.substring(0, maxLen) + '...' : node.name
            ctx.font = `600 ${fontSize}px Inter, sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            
            // Fond du label
            const textWidth = ctx.measureText(label).width
            const padding = 3
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
            ctx.fillRect(
              node.x - textWidth / 2 - padding,
              node.y + nodeSize + 6,
              textWidth + padding * 2,
              fontSize + padding * 2
            )
            
            // Texte
            ctx.fillStyle = '#ffffff'
            ctx.fillText(label, node.x, node.y + nodeSize + fontSize + 6)

            // Check si complété
            if (node.isCompleted) {
              ctx.font = `bold ${fontSize * 1.3}px Sans-Serif`
              ctx.fillStyle = '#fff'
              ctx.fillText('✓', node.x, node.y)
            }
          }}
          onEngineStop={() => {
            if (graphRef.current) {
              graphRef.current.zoomToFit(400, 100)
            }
          }}
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>

      {/* Légende */}
      <div className="bg-black/30 backdrop-blur-sm p-4 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan-600"></div>
            <span>★ Cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
            <span>◆ Chapitre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500"></div>
            <span>◇ Sous-chapitre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>○ Leçon</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          💡 Cliquez sur une leçon pour l'ouvrir
        </p>
      </div>
    </div>
  )
}

