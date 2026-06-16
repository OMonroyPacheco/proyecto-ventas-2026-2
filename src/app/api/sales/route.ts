export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: true,
      items: { include: { product: true } },
      user: true,
    },
  })
  return NextResponse.json({ sales })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { clientId, items } = await request.json()
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Debe agregar al menos un producto a la venta' }, { status: 400 })
  }

  const productIds = items.map((item: any) => item.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const saleItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) {
      throw new Error('Producto no encontrado: ' + item.productId)
    }
    const quantity = Number(item.quantity) || 1
    return {
      productId: product.id,
      quantity,
      price: product.price,
    }
  })

  const total = saleItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const sale = await prisma.sale.create({
    data: {
      user: { connect: { email: user.email } },
      client: clientId ? { connect: { id: clientId } } : undefined,
      total,
      items: {
        create: saleItems,
      },
    },
    include: {
      client: true,
      items: { include: { product: true } },
      user: true,
    },
  })

  return NextResponse.json({ sale }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { id } = await request.json()
  if (!id) {
    return NextResponse.json({ error: 'ID de venta requerido' }, { status: 400 })
  }

  try {
    await prisma.sale.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo eliminar la venta' }, { status: 400 })
  }
}
