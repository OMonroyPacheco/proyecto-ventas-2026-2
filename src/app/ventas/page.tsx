'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { utils, writeFile } from 'xlsx'

type Client = { id: string; name: string }
type Product = { id: string; name: string }
type SaleItem = { id: string; quantity: number; price: number; product: Product }
type Sale = { id: string; total: number; createdAt: string; client?: Client | null; items: SaleItem[]; user: { name?: string | null; email: string } }

export default function VentasPage() {
  const router = useRouter()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSales() {
      try {
        const res = await fetch('/api/sales')
        if (!res.ok) {
          setError('Error cargando ventas')
          return
        }
        const data = await res.json()
        setSales(data.sales ?? [])
      } catch (err) {
        setError('No se pudo conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }
    loadSales()
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

  function exportSales() {
    const worksheet = utils.json_to_sheet(
      sales.map((sale) => ({
        Fecha: new Date(sale.createdAt).toLocaleString(),
        Cliente: sale.client?.name || 'Cliente no asignado',
        Total: sale.total,
        Usuario: sale.user?.email || sale.user?.name || '---',
        Productos: sale.items.map((item) => `${item.product.name} x${item.quantity}`).join(', '),
      })),
    )
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Ventas')
    writeFile(workbook, 'ventas.xlsx')
  }

  async function deleteSale(id: string) {
    setError('')

    const verified = await confirmAuth()
    if (!verified) return

    if (!window.confirm('¿Eliminar esta venta?')) return

    const response = await fetch('/api/sales', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'No se pudo eliminar la venta')
      return
    }

    setSales((current) => current.filter((sale) => sale.id !== id))
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
            onClick={exportSales}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-white font-semibold transition-colors duration-200"
          >
            <Download className="w-5 h-5" />
            Exportar ventas (.xlsx)
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white">Ventas</h1>
        <p className="mt-2 text-gray-400">Datos guardados y sincronizados desde la base de datos.</p>

        {error ? <div className="mt-8 rounded-2xl border border-red-600/50 bg-red-900/20 p-4 text-red-300">{error}</div> : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-700 bg-gray-900/60 shadow-2xl shadow-black/20">
          <table className="min-w-full divide-y divide-gray-700 text-left text-sm text-gray-200">
            <thead className="bg-gray-800 text-xs uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Cargando ventas...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No hay ventas registradas.</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-800/80">
                    <td className="px-6 py-4">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">{sale.client?.name || 'Cliente no asignado'}</td>
                    <td className="px-6 py-4">${sale.total.toFixed(2)}</td>
                    <td className="px-6 py-4">{sale.user?.email || sale.user?.name || '---'}</td>
                    <td className="px-6 py-4">{sale.items.map((item) => `${item.product.name} x${item.quantity}`).join(', ')}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteSale(sale.id)}
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