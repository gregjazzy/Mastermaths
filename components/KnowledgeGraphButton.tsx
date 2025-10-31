'use client'

import { Network } from 'lucide-react'
import Link from 'next/link'

interface KnowledgeGraphButtonProps {
  courseId: string
}

export default function KnowledgeGraphButton({ courseId }: KnowledgeGraphButtonProps) {
  return (
    <Link
      href={`/cours/${courseId}/graphe`}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
      title="Voir le graphe de connaissances"
    >
      <Network className="w-4 h-4" />
      <span className="hidden sm:inline">Graphe du cours</span>
      <span className="sm:hidden">Graphe</span>
    </Link>
  )
}

