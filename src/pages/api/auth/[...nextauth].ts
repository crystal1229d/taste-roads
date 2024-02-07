import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Adapter } from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 2,
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/users/login',
  },
}

export default NextAuth(authOptions)
