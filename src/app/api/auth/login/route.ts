export const dynamic = 'force-dynamic'
import { compare } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const passwordMatch = await compare(password, user.password)
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const token = crypto.randomUUID()
  // Sesión expira en 2 horas
  const expiresIn = 1000 * 60 * 60 * 2
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expires: new Date(Date.now() + expiresIn),
    },
  })

  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  response.cookies.set({
    name: 'sessionToken',
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2,
  })

  return response
}
