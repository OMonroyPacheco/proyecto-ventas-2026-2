import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const updated = await prisma.user.updateMany({
    where: { email: 'admin@tecnosocks.com' },
    data: { role: 'admin' },
  })
  
  console.log(`Usuarios actualizados: ${updated.count}`)
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })
  console.log('\nUsuarios actualizados:')
  console.log(JSON.stringify(users, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
