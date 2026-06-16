'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { utils, writeFile } from 'xlsx'

type Product = {
  id: string
  name: string
  description?: string | null
  price: number
  stock: number
  createdAt?: string | null
}

export default function ProductosPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) {
          setError('Error cargando productos')
          return
        }
        const data = await res.json()
        setProducts(data.products ?? [])
      } catch (err) {
        setError('No se pudo conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
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

  function exportProducts() {
    const worksheet = utils.json_to_sheet(
      products.map((product) => ({
        Nombre: product.name,
        Descripcion: product.description || '',
        Precio: product.price,
        Stock: product.stock,
        Creado: product.createdAt || '',
      })),
    )
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Productos')
    writeFile(workbook, 'productos.xlsx')
  }

  async function deleteProduct(id: string) {
    setError('')

    const verified = await confirmAuth()
    if (!verified) return

    if (!window.confirm('¿Eliminar este producto?')) return

    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'No se pudo eliminar el producto')
      return
    }

    setProducts((current) => current.filter((product) => product.id !== id))
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
            onClick={exportProducts}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-white font-semibold transition-colors duration-200"
          >
            <Download className="w-5 h-5" />
            Exportar productos (.xlsx)
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white">Productos</h1>
        <p className="mt-2 text-gray-400">Datos guardados y sincronizados desde la base de datos.</p>

        {error ? <div className="mt-8 rounded-2xl border border-red-600/50 bg-red-900/20 p-4 text-red-300">{error}</div> : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-700 bg-gray-900/60 shadow-2xl shadow-black/20">
          <table className="min-w-full divide-y divide-gray-700 text-left text-sm text-gray-200">
            <thead className="bg-gray-800 text-xs uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Creado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Cargando productos...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No hay productos registrados.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/80">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4">{product.description || '---'}</td>
                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">{product.createdAt ? new Date(product.createdAt).toLocaleString() : '---'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteProduct(product.id)}
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