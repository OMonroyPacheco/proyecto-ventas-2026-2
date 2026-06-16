import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const cookiesStore = await cookies()
  const sessionToken = cookiesStore.get('sessionToken')?.value
  if (!sessionToken) return null

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  })
  if (!session) return null

  // Validar que la sesión no haya expirado
  if (session.expires && session.expires < new Date()) {
    // Eliminar sesión expirada
    await prisma.session.delete({ where: { id: session.id } })
    return null
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  }
}
