export const dynamic = 'force-dynamic'
import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 409 })
  }

  const hashedPassword = await hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      password: hashedPassword,
      role: 'user',
    },
  })

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
}
