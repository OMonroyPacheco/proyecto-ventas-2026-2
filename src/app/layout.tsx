import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Proyecto Ventas 2026',
  description: 'Dashboard de ventas automatizado',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-white">
        <Header />
        {children}
      </body>
    </html>
  )
}
