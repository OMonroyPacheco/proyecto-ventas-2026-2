import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function resolveDatabaseUrl(url: string) {
  if (!url.startsWith('file:')) return url

  const filePath = url.slice(5)
  // Simple check for absolute path (starts with / or drive letter)
  if (filePath.startsWith('/') || /^[a-zA-Z]:/.test(filePath)) {
    return url
  }

  // For relative paths, just prepend file:
  // The project root context will handle resolution
  return url
}

const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL ?? 'file:./prisma/dev.db')

export const prisma = global.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
