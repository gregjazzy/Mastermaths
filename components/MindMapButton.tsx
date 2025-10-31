'use client'

import { Brain } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface MindMapButtonProps {
  chapterId: string
  chapterTitle: string
  hasMap: boolean
}

export default function MindMapButton({ chapterId, chapterTitle, hasMap }: MindMapButtonProps) {
  const params = useParams()
  const courseId = params.courseId as string

  if (!hasMap) return null

  return (
    <Link
      href={`/cours/${courseId}/carte-mentale/${chapterId}`}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
      title="Voir la carte mentale"
    >
      <Brain className="w-4 h-4" />
      <span>Carte mentale</span>
    </Link>
  )
}

