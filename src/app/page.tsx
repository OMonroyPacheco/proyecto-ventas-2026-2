'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState, Suspense } from 'react'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [redirectMessage, setRedirectMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const authParam = searchParams?.get('auth')
    if (authParam === 'required') {
      setRedirectMessage('Debes iniciar sesión para acceder a esta página.')
    } else if (authParam === 'expired') {
      setRedirectMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
    }

    async function initializeApp() {
      try {
        // Intentar inicializar la aplicación y crear el usuario por defecto si no existe
        const initRes = await fetch('/api/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (initRes.ok) {
          await initRes.json()
        }

        // Si ya hay una sesión activa, redirigir al dashboard
        const authRes = await fetch('/api/auth/me', { cache: 'no-store' })
        if (authRes.ok) {
          router.push('/dashboard')
          return
        }
      } catch (err) {
        console.log('Error inicializando la aplicación:', err)
      } finally {
        setInitializing(false)
      }
    }

    initializeApp()
  }, [router, searchParams])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error || 'No se pudo iniciar sesión')
      return
    }

    router.push('/dashboard')
  }

  if (initializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
          <p className="mt-4 text-gray-300">Inicializando aplicación...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-16">
      <div 
        className="w-full max-w-3xl rounded-3xl backdrop-blur-2xl border border-gray-700/60 p-10 shadow-2xl shadow-black/60 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/logo.png')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '70%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="relative z-10">
          <h1 className="text-4xl font-semibold text-white text-center">Sistema de Ventas</h1>
          <p className="mt-3 text-gray-300 text-center">Inicia sesión para gestionar clientes, productos y ventas con base de datos.</p>

          <form className="mt-10 space-y-6" onSubmit={handleLogin}>
            {redirectMessage ? (
              <div className="rounded-2xl border border-yellow-500/60 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                {redirectMessage}
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">Correo</label>
            <input
              className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">Contraseña</label>
            <input
              className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-400 text-center">{error}</p> : null}
          <button
            className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-600 pt-6 text-sm text-center">
          <p className="text-gray-400">
            ¿No tienes cuenta?{' '}
            <button
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              onClick={() => router.push('/register')}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
        </div>
      </div>
    </main>
  )
}
export default function Home() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500"></div>
          <p className="mt-4 text-gray-300">Cargando...</p>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  )
}