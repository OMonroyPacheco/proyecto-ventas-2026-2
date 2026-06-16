"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const menuItems: Array<{ name: string; href: string; external?: boolean; adminOnly?: boolean }> = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Clientes', href: '/clientes' },
  { name: 'Productos', href: '/productos' },
  { name: 'Ventas', href: '/ventas' },
  { name: 'Portales', href: '/portales' },
  { name: 'SAP', href: '/sap' },
  { name: 'Reportes', href: '/reportes' },
  { name: 'Configuración', href: '/configuracion' },
  { name: 'Usuarios', href: '/usuarios', adminOnly: true },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string; name: string | null; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const protectedRoutes = [
    '/dashboard',
    '/clientes',
    '/productos',
    '/ventas',
    '/portales',
    '/sap',
    '/reportes',
    '/configuracion',
    '/usuarios',
  ]

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
          if (isProtectedRoute) {
            router.replace('/?auth=required')
          }
        }
      } catch (error) {
        setUser(null)
        if (isProtectedRoute) {
          router.replace('/?auth=required')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isProtectedRoute, pathname, router])

  const linkClass = (active = false, disabled = false) => {
    return [`rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200`,
      disabled
        ? 'text-slate-400 pointer-events-none opacity-50'
        : 'text-slate-200 hover:bg-slate-800/80 hover:text-white',
    ].join(' ')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
<Link
  href="/dashboard"
  className="
    text-3xl
    font-semibold
    tracking-[0.40em]
    uppercase
    bg-gradient-to-r
    from-[#5e4500]
    via-[#ffe27a]
    to-[#5e4500]
    bg-clip-text
    text-transparent
    opacity-90
  "
>
  NEXUS
</Link>

        <nav className="flex flex-wrap items-center gap-2">
          {menuItems.map((item) => {
            const isProtected = item.name !== 'Dashboard'
            const isAdminOnly = item.adminOnly
            const isExternal = item.external || item.href.includes('://')
            const disabled = (isProtected && user === null) || (isAdminOnly && user?.role !== 'admin')

            if (disabled) {
              return (
                <span
                  key={item.href}
                  className={linkClass(false, true)}
                  title={isAdminOnly ? "Requiere permisos de administrador" : "Inicia sesión para navegar"}
                  aria-disabled="true"
                >
                  {item.name}
                </span>
              )
            }

            if (isExternal) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={linkClass(false, false)}
                  title={item.name}
                >
                  {item.name}
                </a>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(false, false)}
                title={item.name}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
