'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    setLoading(false)

    if (!response.ok) {
      setError(data.error || 'No se pudo crear la cuenta')
      return
    }

    setSuccess('Cuenta creada. Inicia sesión con tus credenciales.')
    setTimeout(() => router.push('/'), 1200)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-16">
      <div className="w-full max-w-3xl rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-10 shadow-2xl shadow-black/50">
        <h1 className="text-4xl font-semibold text-white text-center">Regístrate</h1>
        <p className="mt-3 text-gray-300 text-center">Crea tu cuenta para empezar a usar el sistema de ventas.</p>

        <form className="mt-10 space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">Nombre</label>
            <input
              className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

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
          {success ? <p className="text-sm text-green-400 text-center">{success}</p> : null}

          <button
            className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-600 pt-6 text-sm text-center">
          <button className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200" onClick={() => router.push('/')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </main>
  )
}
