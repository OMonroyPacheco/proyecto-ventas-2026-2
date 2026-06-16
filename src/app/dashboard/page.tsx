'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type Client = { id: string; name: string; email?: string | null; phone?: string | null }
type Product = { id: string; name: string; description?: string | null; price: number; stock: number }
type SaleItem = { id: string; quantity: number; price: number; product: Product }
type Sale = { id: string; total: number; createdAt: string; client?: Client | null; items: SaleItem[]; user: { name?: string | null; email: string } }

type User = { id: string; email: string; name?: string | null }

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState(0)
  const [productStock, setProductStock] = useState(0)

  const [saleClientId, setSaleClientId] = useState('')
  const [saleItems, setSaleItems] = useState<Array<{ productId: string; quantity: number }>>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [sessionWarning, setSessionWarning] = useState(false)

  // Validar sesión cada minuto
  useEffect(() => {
    const checkSession = async () => {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) {
          router.push('/?auth=expired')
          return
        }
      } catch {
        router.push('/?auth=expired')
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 60000) // Cada minuto
    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/auth/me')
        if (!authRes.ok) {
          router.push('/')
          return
        }

        const authData = await authRes.json()
        setUser(authData.user)

        const [clientsRes, productsRes, salesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/products'),
          fetch('/api/sales'),
        ])

        if (!clientsRes.ok || !productsRes.ok || !salesRes.ok) {
          setError('Error al cargar los datos')
          return
        }

        const clientsData = await clientsRes.json()
        const productsData = await productsRes.json()
        const salesData = await salesRes.json()

        setClients(clientsData.clients)
        setProducts(productsData.products)
        setSales(salesData.sales)
        setSelectedProductId(productsData.products?.[0]?.id || '')
      } catch (err) {
        setError('No se pudo conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const saleCart = useMemo(() => {
    return saleItems
      .map((item) => {
        const product = products.find((product) => product.id === item.productId)
        if (!product) return null
        return {
          ...item,
          product,
          subTotal: product.price * item.quantity,
        }
      })
      .filter((item): item is { productId: string; quantity: number; product: Product; subTotal: number } => item !== null)
  }, [saleItems, products])

  const saleTotal = saleCart.reduce((sum, item) => sum + item.subTotal, 0)

  async function signOut() {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) {
        throw new Error('No se pudo cerrar sesión')
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      router.replace('/?auth=expired')
    }
  }

  async function addClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: clientName, email: clientEmail, phone: clientPhone }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Error creando cliente')
      return
    }

    setClients([data.client, ...clients])
    setClientName('')
    setClientEmail('')
    setClientPhone('')
  }

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: productName,
        description: productDescription,
        price: productPrice,
        stock: productStock,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Error creando producto')
      return
    }

    setProducts([data.product, ...products])
    setProductName('')
    setProductDescription('')
    setProductPrice(0)
    setProductStock(0)
    setSelectedProductId(data.product.id)
  }

  function addSaleItem() {
    if (!selectedProductId || selectedQuantity < 1) return

    setSaleItems((current) => {
      const existing = current.find((item) => item.productId === selectedProductId)
      if (existing) {
        return current.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item,
        )
      }
      return [...current, { productId: selectedProductId, quantity: selectedQuantity }]
    })
  }

  async function createSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (saleItems.length === 0) {
      setError('Agrega productos a la venta antes de guardar')
      return
    }

    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: saleClientId || null, items: saleItems }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Error creando la venta')
      return
    }

    setSales([data.sale, ...sales])
    setSaleItems([])
    setSaleClientId('')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-16">
        <div className="rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-10 shadow-2xl shadow-black/50 text-gray-200">Cargando datos...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 shadow-2xl shadow-black/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Bienvenido</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{user?.name || user?.email}</h1>
            <p className="mt-2 text-gray-300">Administra clientes, productos y ventas con una base de datos local SQLite.</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Cerrar sesión
          </button>
        </div>

        {error ? <div className="mb-6 rounded-2xl border border-red-600/50 bg-red-900/20 backdrop-blur-sm p-4 text-red-400">{error}</div> : null}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-4 rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 shadow-2xl shadow-black/50">
            <h2 className="text-xl font-semibold text-white">Clientes</h2>
            <form className="space-y-4" onSubmit={addClient}>
              <input
                className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Nombre"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                required
              />
              <input
                className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Correo"
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
              />
              <input
                className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Teléfono"
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
              />
              <button className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                Guardar cliente
              </button>
            </form>
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="rounded-3xl border border-gray-600 bg-gray-700/30 backdrop-blur-sm p-4">
                  <p className="font-semibold text-white">{client.name}</p>
                  <p className="text-sm text-gray-300">{client.email || 'Sin correo'}</p>
                  <p className="text-sm text-gray-300">{client.phone || 'Sin teléfono'}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 shadow-2xl shadow-black/50">
            <h2 className="text-xl font-semibold text-white">Productos</h2>
            <form className="space-y-4" onSubmit={addProduct}>
              <input
                className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Nombre del producto"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />
              <textarea
                className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Descripción"
                value={productDescription}
                onChange={(event) => setProductDescription(event.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Precio"
                  type="number"
                  value={productPrice}
                  min={0}
                  step="0.01"
                  onChange={(event) => setProductPrice(Number(event.target.value))}
                  required
                />
                <input
                  className="rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Stock"
                  type="number"
                  value={productStock}
                  min={0}
                  onChange={(event) => setProductStock(Number(event.target.value))}
                />
              </div>
              <button className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                Guardar producto
              </button>
            </form>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-3xl border border-gray-600 bg-gray-700/30 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{product.name}</p>
                    <span className="rounded-full bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-xs font-medium text-blue-300">{product.stock} en stock</span>
                  </div>
                  <p className="text-sm text-gray-300">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 shadow-2xl shadow-black/50 xl:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Ventas</h2>
              <span className="rounded-full bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-sm text-blue-300">Total: ${saleTotal.toFixed(2)}</span>
            </div>
            <form className="space-y-4" onSubmit={createSale}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-200">Cliente</span>
                  <select
                    className="mt-2 w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    value={saleClientId}
                    onChange={(event) => setSaleClientId(event.target.value)}
                  >
                    <option value="">Seleccionar cliente (opcional)</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-200">Producto</span>
                    <select
                      className="mt-2 w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={selectedProductId}
                      onChange={(event) => setSelectedProductId(event.target.value)}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-200">Cantidad</span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      type="number"
                      min={1}
                      value={selectedQuantity}
                      onChange={(event) => setSelectedQuantity(Number(event.target.value))}
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={addSaleItem}
                className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Agregar producto a la venta
              </button>

              <div className="rounded-3xl border border-gray-600 bg-gray-700/30 backdrop-blur-sm p-4">
                <h3 className="font-semibold text-white">Productos en la venta</h3>
                {saleCart.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-300">Aún no hay productos seleccionados.</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {saleCart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-3">
                        <div>
                          <p className="font-medium text-white">{item.product.name}</p>
                          <p className="text-sm text-gray-300">{item.quantity} x ${item.product.price.toFixed(2)}</p>
                        </div>
                        <p className="font-semibold text-white">${item.subTotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                Guardar venta
              </button>
            </form>

            <div className="space-y-4">
              {sales.map((sale) => (
                <div key={sale.id} className="rounded-3xl border border-gray-600 bg-gray-700/30 backdrop-blur-sm p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">Venta #{sale.id.slice(0, 6)}</p>
                      <p className="text-sm text-gray-300">Cliente: {sale.client?.name || 'Sin cliente'}</p>
                    </div>
                    <p className="text-lg font-semibold text-white">${sale.total.toFixed(2)}</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {sale.items.map((item) => (
                      <p key={item.id} className="text-sm text-gray-300">
                        {item.quantity} x {item.product.name} = ${item.price.toFixed(2)} c/u
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
