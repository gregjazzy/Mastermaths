/**
 * Service pour gérer la logique de prérequis en cascade
 * 
 * Exemple de cascade automatique :
 * Vidéo de cours
 *   ├─ Exercice 1
 *   │   ├─ QCM Ex 1 (prérequis: Exercice 1)
 *   │   └─ Correction Ex 1 (prérequis: QCM Ex 1)
 *   ├─ Exercice 2 (prérequis: Correction Ex 1)
 *   │   ├─ QCM Ex 2 (prérequis: Exercice 2)
 *   │   └─ Correction Ex 2 (prérequis: QCM Ex 2)
 *   └─ Exercice 3 (prérequis: Correction Ex 2)
 */

import prisma from '@/lib/prisma'

export interface Lesson {
  id: string
  title: string
  type: string
  order: number
  parentLessonId: string | null
  prerequisiteLessonId: string | null
  subChapterId: string
}

/**
 * Suggère automatiquement le prérequis logique pour une leçon
 * basé sur la hiérarchie et le type de leçon
 */
export async function suggestPrerequisite(
  subChapterId: string,
  parentLessonId: string | null,
  lessonType: string,
  order: number
): Promise<string | null> {
  try {
    // Récupérer toutes les leçons du sous-chapitre
    const lessons = await prisma.lesson.findMany({
      where: { subChapterId },
      orderBy: { order: 'asc' }
    })

    // Si pas de parent (niveau 1), le prérequis devrait être la dernière leçon de niveau 1
    if (!parentLessonId) {
      const lastRootLesson = lessons
        .filter(l => !l.parentLessonId && l.order < order)
        .sort((a, b) => b.order - a.order)[0]
      
      return lastRootLesson?.id || null
    }

    // Si a un parent (niveau 2 ou 3), logique spécifique
    const siblings = lessons.filter(l => l.parentLessonId === parentLessonId)
    const parent = lessons.find(l => l.id === parentLessonId)

    // Si c'est un QCM, le prérequis devrait être l'exercice parent
    if (lessonType === 'QCM' && parent && parent.type === 'EXO_ECRIT') {
      return parentLessonId
    }

    // Si c'est une correction, le prérequis devrait être le QCM du même exercice
    if ((lessonType === 'CORRECTION_VIDEO' || lessonType === 'CORRECTION_DOCUMENT') && parent) {
      const qcm = siblings.find(s => s.type === 'QCM')
      if (qcm) {
        return qcm.id
      }
      // Si pas de QCM, prérequis = exercice parent
      return parentLessonId
    }

    // Pour un exercice (niveau 2), le prérequis devrait être la correction du précédent exercice
    if (lessonType === 'EXO_ECRIT' && parent) {
      // Trouver le précédent exercice au même niveau
      const previousSibling = siblings
        .filter(s => s.order < order && s.type === 'EXO_ECRIT')
        .sort((a, b) => b.order - a.order)[0]
      
      if (previousSibling) {
        // Chercher la correction de cet exercice
        const previousCorrection = lessons.find(
          l => l.parentLessonId === previousSibling.id && 
          (l.type === 'CORRECTION_VIDEO' || l.type === 'CORRECTION_DOCUMENT')
        )
        if (previousCorrection) {
          return previousCorrection.id
        }
        // Si pas de correction, prérequis = exercice précédent
        return previousSibling.id
      }
      
      // Si c'est le premier exercice, prérequis = vidéo de cours (parent du parent)
      if (parent.parentLessonId) {
        return parent.parentLessonId
      }
      return parent.id
    }

    // Par défaut : prérequis = leçon précédente dans l'ordre
    const previousLesson = lessons
      .filter(l => l.order < order)
      .sort((a, b) => b.order - a.order)[0]
    
    return previousLesson?.id || null
  } catch (error) {
    console.error('[SUGGEST_PREREQUISITE ERROR]', error)
    return null
  }
}

/**
 * Valide qu'un prérequis ne crée pas de boucle circulaire
 */
export async function validatePrerequisite(
  lessonId: string,
  prerequisiteId: string
): Promise<boolean> {
  try {
    // Vérifier qu'on ne crée pas une boucle
    let currentId: string | null = prerequisiteId
    const visited = new Set<string>([lessonId])

    while (currentId) {
      if (visited.has(currentId)) {
        // Boucle détectée !
        return false
      }
      visited.add(currentId)

      const lesson = await prisma.lesson.findUnique({
        where: { id: currentId },
        select: { prerequisiteLessonId: true }
      })

      currentId = lesson?.prerequisiteLessonId || null
    }

    return true
  } catch (error) {
    console.error('[VALIDATE_PREREQUISITE ERROR]', error)
    return false
  }
}

/**
 * Crée une séquence complète d'exercices avec cascade automatique
 * 
 * @param videoLessonId - ID de la vidéo de cours parente
 * @param subChapterId - ID du sous-chapitre
 * @param count - Nombre d'exercices à créer
 * @returns Array des leçons créées
 */
export async function createExerciseSequence(
  videoLessonId: string,
  subChapterId: string,
  count: number
): Promise<Lesson[]> {
  const createdLessons: Lesson[] = []
  
  try {
    // Récupérer l'ordre de départ
    const existingLessons = await prisma.lesson.findMany({
      where: { subChapterId },
      orderBy: { order: 'desc' },
      take: 1
    })
    
    let currentOrder = (existingLessons[0]?.order || 0) + 1
    let previousCorrectionId: string | null = null

    for (let i = 1; i <= count; i++) {
      // 1. Créer l'exercice
      const exercise = await prisma.lesson.create({
        data: {
          title: `Exercice ${i}`,
          subChapterId,
          type: 'EXO_ECRIT',
          order: currentOrder++,
          parentLessonId: videoLessonId,
          prerequisiteLessonId: i === 1 ? videoLessonId : previousCorrectionId
        }
      })
      createdLessons.push(exercise as Lesson)

      // 2. Créer le QCM
      const qcm = await prisma.lesson.create({
        data: {
          title: `QCM Exercice ${i}`,
          subChapterId,
          type: 'QCM',
          order: currentOrder++,
          parentLessonId: exercise.id,
          prerequisiteLessonId: exercise.id
        }
      })
      createdLessons.push(qcm as Lesson)

      // 3. Créer la correction
      const correction = await prisma.lesson.create({
        data: {
          title: `Correction Exercice ${i}`,
          subChapterId,
          type: 'CORRECTION_VIDEO',
          order: currentOrder++,
          parentLessonId: exercise.id,
          prerequisiteLessonId: qcm.id
        }
      })
      createdLessons.push(correction as Lesson)

      previousCorrectionId = correction.id
    }

    return createdLessons
  } catch (error) {
    console.error('[CREATE_EXERCISE_SEQUENCE ERROR]', error)
    throw error
  }
}


