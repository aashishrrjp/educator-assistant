import { PrismaClient } from '@prisma/client'

// This prevents TypeScript errors in development when `global` is modified.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // In development, prevent multiple instances of Prisma Client from being created
  // by hot-reloading.
  if (!global.prisma) {
    global.prisma = new PrismaClient({
       log: ['query', 'error', 'warn'],
    })
  }
  prisma = global.prisma
}

export default prisma
