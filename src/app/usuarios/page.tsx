'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, UserPlus } from 'lucide-react'

type User = {
  id: string
  name?: string | null
  email: string
  role: string
  createdAt: string
}

export default function UsuariosPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) {
        if (res.status === 403) {
          setError('No tienes permisos para ver usuarios')
          return
        }
        setError('Error cargando usuarios')
        return
      }
      const data = await res.json()
      setUsers(data.users ?? [])
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Error creando usuario')
      return
    }

    setUsers([data.user, ...users])
    setFormData({ name: '', email: '', password: '', role: 'user' })
    setShowCreateForm(false)
  }

  async function handleEditUser(event: React.FormEvent) {
    event.preventDefault()
    if (!editingUser) return
    setError('')

    const updateData: any = { ...formData }
    if (!updateData.password) delete updateData.password

    const response = await fetch(`/api/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Error actualizando usuario')
      return
    }

    setUsers(users.map(u => u.id === editingUser.id ? data.user : u))
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'user' })
  }

  async function deleteUser(id: string) {
    if (!confirm('¿Eliminar este usuario?')) return

    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      setError('Error eliminando usuario')
      return
    }

    setUsers(users.filter(u => u.id !== id))
  }

  function startEdit(user: User) {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role,
    })
  }

  function cancelEdit() {
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'user' })
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
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-white font-semibold transition-colors duration-200"
          >
            <UserPlus className="w-5 h-5" />
            Crear Usuario
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white">Usuarios</h1>
        <p className="mt-2 text-gray-400">Gestiona usuarios, roles y permisos del sistema.</p>

        {error && <div className="mt-8 rounded-2xl border border-red-600/50 bg-red-900/20 p-4 text-red-300">{error}</div>}

        {(showCreateForm || editingUser) && (
          <div className="mt-8 rounded-3xl border border-gray-700 bg-gray-900/60 p-6 shadow-2xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
            <form onSubmit={editingUser ? handleEditUser : handleCreateUser} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
                <select
                  className="w-full rounded-2xl border border-gray-600 bg-gray-700/50 text-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    cancelEdit()
                  }}
                  className="inline-flex items-center justify-center rounded-2xl bg-gray-600 hover:bg-gray-700 px-5 py-3 text-sm font-semibold text-white transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-700 bg-gray-900/60 shadow-2xl shadow-black/20">
          <table className="min-w-full divide-y divide-gray-700 text-left text-sm text-gray-200">
            <thead className="bg-gray-800 text-xs uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Creado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Cargando usuarios...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay usuarios registrados.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/80">
                    <td className="px-6 py-4 font-medium text-white">{user.name || 'Sin nombre'}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="rounded-2xl bg-yellow-600 px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-yellow-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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