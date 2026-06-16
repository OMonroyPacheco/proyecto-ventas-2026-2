export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    )
  }

  const { name, description, price, stock } =
    await request.json()

  if (!name || typeof price !== 'number') {
    return NextResponse.json(
      { error: 'Nombre y precio son obligatorios' },
      { status: 400 }
    )
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price,
      stock: typeof stock === 'number' ? stock : 0,
    },
  })

  return NextResponse.json(
    { product },
    { status: 201 }
  )
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    )
  }

  const { id } = await request.json()

  if (!id) {
    return NextResponse.json(
      { error: 'ID de producto requerido' },
      { status: 400 }
    )
  }

  try {
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudo eliminar el producto' },
      { status: 400 }
    )
  }
}