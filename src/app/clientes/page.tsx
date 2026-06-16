'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { utils, writeFile } from 'xlsx'

type Client = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  createdAt?: string | null
}

export default function ClientesPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/clients')
        if (!res.ok) {
          setError('Error cargando clientes')
          return
        }
        const data = await res.json()
        setClients(data.clients ?? [])
      } catch (err) {
        setError('No se pudo conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }
    loadClients()
  }, [])

  async function confirmAuth() {
    const email = window.prompt('Ingresa tu correo para confirmar')
    if (!email) return false

    const password = window.prompt('Ingresa tu contraseña')
    if (!password) return false

    const verifyRes = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!verifyRes.ok) {
      setError('Credenciales inválidas')
      return false
    }

    return true
  }

  function exportClients() {
    const worksheet = utils.json_to_sheet(
      clients.map((client) => ({
        Nombre: client.name,
        Correo: client.email || '',
        Telefono: client.phone || '',
        Creado: client.createdAt || '',
      })),
    )
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Clientes')
    writeFile(workbook, 'clientes.xlsx')
  }

  async function deleteClient(id: string) {
    setError('')

    const verified = await confirmAuth()
    if (!verified) return

    if (!window.confirm('¿Eliminar este cliente?')) return

    const response = await fetch('/api/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'No se pudo eliminar el cliente')
      return
    }

    setClients((current) => current.filter((client) => client.id !== id))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Menú
          </button>
          <button
            onClick={exportClients}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-white font-semibold transition-colors duration-200"
          >
            <Download className="w-5 h-5" />
            Exportar clientes (.xlsx)
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white">Clientes</h1>
        <p className="mt-2 text-gray-400">Datos guardados y sincronizados desde la base de datos.</p>

        {error ? <div className="mt-8 rounded-2xl border border-red-600/50 bg-red-900/20 p-4 text-red-300">{error}</div> : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-700 bg-gray-900/60 shadow-2xl shadow-black/20">
          <table className="min-w-full divide-y divide-gray-700 text-left text-sm text-gray-200">
            <thead className="bg-gray-800 text-xs uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Creado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Cargando clientes...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay clientes registrados.</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-800/80">
                    <td className="px-6 py-4 font-medium text-white">{client.name}</td>
                    <td className="px-6 py-4">{client.email || '---'}</td>
                    <td className="px-6 py-4">{client.phone || '---'}</td>
                    <td className="px-6 py-4">{client.createdAt ? new Date(client.createdAt).toLocaleString() : '---'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}