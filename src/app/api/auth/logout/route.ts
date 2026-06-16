export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const cookiesStore = await cookies()
  const sessionToken = cookiesStore.get('sessionToken')?.value

  // Eliminar la sesión de la BD
  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { token: sessionToken },
    })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: 'sessionToken',
    value: '',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  })
  return response
}
