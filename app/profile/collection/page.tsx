import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PremiumBadgeService } from '@/lib/premium-badge-service'
import BadgeCardPremium from '@/components/BadgeCardPremium'

export const metadata: Metadata = {
  title: 'Ma Collection de Badges | Master Maths',
  description: 'Consultez votre collection de badges Premium style Pokémon'
}

export default async function CollectionPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Récupérer tous les chapitres
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      description: true
    }
  })

  // Récupérer les badges Premium de l'utilisateur
  const userPremiumBadges = await PremiumBadgeService.getUserPremiumBadges(session.user.id)

  // Récupérer tous les badges Premium disponibles
  const allPremiumBadges = await prisma.badge.findMany({
    where: {
      // Note: type sera ajouté par la migration
      // type: 'CHAPTER_PREMIUM'
      name: {
        contains: 'APPRENTI' // Temporaire pour filtrer
      }
    },
    orderBy: { name: 'asc' }
  })

  // Construire la collection par chapitre
  const collectionByChapter = await Promise.all(
    chapters.map(async (chapter) => {
      const progress = await PremiumBadgeService.getChapterProgress(session.user!.id, chapter.id)
      
      // Les 5 badges du chapitre
      const levels = ['APPRENTI', 'CONFIRME', 'EXPERT', 'MAITRE', 'VIRTUOSE']
      const badges = levels.map((level, index) => {
        const badgeId = `badge_${chapter.id}_${level.toLowerCase()}`
        const userBadge = userPremiumBadges.find(b => b.id === badgeId)
        const badgeData = allPremiumBadges.find(b => b.id === badgeId)
        
        return {
          id: badgeId,
          name: badgeData?.name || `${chapter.title} - ${level}`,
          level: level as any,
          chapterName: chapter.title,
          unlocked: !!userBadge,
          earnedAt: userBadge?.earnedAt,
          customCSS: badgeData?.customCSS,
          requiredLessons: index + 1
        }
      })

      return {
        chapter,
        progress,
        badges
      }
    })
  )

  // Calculer les statistiques globales
  const totalBadges = allPremiumBadges.length
  const unlockedBadges = userPremiumBadges.length
  const completionPercent = totalBadges > 0 ? Math.round((unlockedBadges / totalBadges) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            🎴 Ma Collection Premium
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Badges de maîtrise par chapitre
          </p>
          
          {/* Statistiques globales */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl px-6 py-4">
              <div className="text-3xl font-bold text-yellow-400">{unlockedBadges}/{totalBadges}</div>
              <div className="text-sm text-gray-300">Badges débloqués</div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl px-6 py-4">
              <div className="text-3xl font-bold text-green-400">{completionPercent}%</div>
              <div className="text-sm text-gray-300">Complétion</div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl px-6 py-4">
              <div className="text-3xl font-bold text-purple-400">{chapters.length}</div>
              <div className="text-sm text-gray-300">Chapitres</div>
            </div>
          </div>
        </div>

        {/* Collection par chapitre */}
        <div className="space-y-12">
          {collectionByChapter.map(({ chapter, progress, badges }) => (
            <div key={chapter.id} className="bg-white bg-opacity-5 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-10">
              {/* En-tête du chapitre */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-white">{chapter.title}</h2>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-400">
                      {progress.completedLessons}/{progress.totalLessons} leçons
                    </div>
                    {progress.currentLevel && (
                      <div className="text-sm text-gray-400">
                        Niveau actuel : {progress.currentLevel}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-500"
                    style={{ width: `${(progress.completedLessons / progress.totalLessons) * 100}%` }}
                  />
                </div>
              </div>

              {/* Grille de badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
                {badges.map((badge) => (
                  <div key={badge.id} className="relative">
                    <BadgeCardPremium
                      badgeId={badge.id}
                      name={badge.name}
                      level={badge.level}
                      chapterName={badge.chapterName}
                      unlocked={badge.unlocked}
                      earnedAt={badge.earnedAt}
                      customCSS={badge.customCSS}
                    />
                    
                    {/* Indicateur de leçons requises */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                      {badge.requiredLessons} leçon{badge.requiredLessons > 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>

              {/* Prochaine étape */}
              {progress.nextLevel && progress.completedLessons < progress.totalLessons && (
                <div className="mt-12 text-center p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-xl">
                  <div className="text-yellow-400 font-semibold mb-1">
                    🎯 Prochain objectif
                  </div>
                  <div className="text-white">
                    Complétez {progress.completedLessons + 1} leçon{progress.completedLessons + 1 > 1 ? 's' : ''} pour débloquer <span className="font-bold">{progress.nextLevel}</span>
                  </div>
                </div>
              )}

              {/* Chapitre terminé */}
              {progress.completedLessons === progress.totalLessons && (
                <div className="mt-12 text-center p-4 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-xl">
                  <div className="text-green-400 font-semibold mb-1">
                    ✅ Chapitre Complété !
                  </div>
                  <div className="text-white">
                    Vous avez débloqué tous les badges de ce chapitre. Félicitations ! 🎉
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message si aucun chapitre */}
        {chapters.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-xl text-gray-400">
              Aucun chapitre disponible pour le moment
            </div>
          </div>
        )}

        {/* Retour au profil */}
        <div className="mt-12 text-center">
          <a 
            href="/profile"
            className="inline-block px-8 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md rounded-xl text-white font-semibold transition-all duration-300 border border-white border-opacity-20"
          >
            ← Retour au profil
          </a>
        </div>
      </div>
    </div>
  )
}

