/**
 * Types TypeScript pour l'authentification NextAuth
 */

import { DefaultSession } from 'next-auth'
import { UserStatus } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      status: UserStatus
      isSubscribed: boolean
    } & DefaultSession['user']
  }

  interface User {
    status: UserStatus
    isSubscribed: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    status: UserStatus
    isSubscribed: boolean
  }
}


