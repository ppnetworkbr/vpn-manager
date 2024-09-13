/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { db as prisma } from './lib/db'
import bcrypt from 'bcryptjs'
import { Roles, User } from '@prisma/client'
import NextAuth, { CredentialsSignin, type DefaultSession } from 'next-auth'
import { findUser } from './lib/actions/user.db.action'
export class InvalidLoginError extends CredentialsSignin {
  code = 'invalid_credentials'
  constructor(message: string) {
    super(message)
    this.code = message
  }
}

export type ExtendedUser = DefaultSession['user'] & {
  role: Roles
}
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
  interface User {
    role: Roles
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      id: 'credentials',
      authorize: async (credentials) => {
        const email = credentials.email as string
        const password = credentials.password as string
        let user: User | null = null
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidLoginError('Campos Vazios')
        }

        try {
          user = await findUser({ email })
        } catch (e) {
          throw new InvalidLoginError('Usuário e/ou senha incorretos')
        }
        if (!user || !user.password) {
          throw new InvalidLoginError('Usuário e/ou senha incorretos')
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) throw new Error('Usuário e/ou senha incorretos')

        return user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as Roles
      }

      return session
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
})
