import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })
  console.log('Users in database:')
  console.log(JSON.stringify(users, null, 2))
  
  const sessions = await prisma.session.findMany({
    include: { user: true },
  })
  console.log('\nSessions in database:')
  console.log(JSON.stringify(sessions, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
