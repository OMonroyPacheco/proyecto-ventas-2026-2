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

  return NextResponse.json({ success: true })
}
