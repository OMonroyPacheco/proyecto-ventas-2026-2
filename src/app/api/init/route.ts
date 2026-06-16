import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verificar si ya existe un usuario (base de datos ya inicializada)
    const existingUser = await prisma.user.findFirst()
    if (existingUser) {
      // Actualizar usuario existente si no tiene role
      if (!existingUser.role) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'admin' },
        })
      }
      return NextResponse.json({ message: 'Sistema ya inicializado' })
    }

    // Crear usuario por defecto
    const hashedPassword = await hash('admin123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'admin@tecnosocks.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'admin',
      },
    })

    // Crear sesión inicial
    const token = crypto.randomUUID()
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      },
    })

    const response = NextResponse.json({ 
      message: 'Sistema inicializado',
      user: { email: user.email, name: user.name }
    })

    response.cookies.set({
      name: 'sessionToken',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })

    return response
  } catch (error) {
    console.error('Error en inicialización:', error)
    return NextResponse.json({ error: 'Error inicializando' }, { status: 500 })
  }
}
