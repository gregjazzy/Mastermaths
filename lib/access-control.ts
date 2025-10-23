import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'
import { UserStatus } from '@prisma/client'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      isSubscribed: true,
    }
  })
  
  return user
}

export async function checkCourseAccess(courseId: string, userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true }
  })
  
  if (!user) return false
  
  // Les utilisateurs PREMIUM ont accès à tout
  if (user.status === UserStatus.PREMIUM) return true
  
  // Vérifier si le cours est un contenu démo
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { isDemoContent: true }
  })
  
  if (!course) return false
  
  // Les utilisateurs DEMO ont accès au contenu démo
  if (user.status === UserStatus.DEMO && course.isDemoContent) return true
  
  // Les utilisateurs FREE n'ont pas accès aux cours
  return false
}

export async function checkLessonAccess(lessonId: string, userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true }
  })
  
  if (!user) return false
  
  // Les utilisateurs PREMIUM ont accès à tout
  if (user.status === UserStatus.PREMIUM) return true
  
  // Remonter l'arborescence pour vérifier l'accès
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      subChapter: {
        include: {
          chapter: {
            include: {
              course: {
                select: { isDemoContent: true }
              }
            }
          }
        }
      }
    }
  })
  
  if (!lesson) return false
  
  // Les utilisateurs DEMO ont accès au contenu démo
  if (user.status === UserStatus.DEMO && lesson.subChapter.chapter.course.isDemoContent) {
    return true
  }
  
  return false
}


