import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ clients })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { name, email, phone } = await request.json()
  if (!name) {
    return NextResponse.json({ error: 'El nombre del cliente es obligatorio' }, { status: 400 })
  }

  const client = await prisma.client.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
    },
  })

  return NextResponse.json({ client }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { id } = await request.json()
  if (!id) {
    return NextResponse.json({ error: 'ID de cliente requerido' }, { status: 400 })
  }

  try {
    await prisma.client.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar el cliente' }, { status: 400 })
  }
}
