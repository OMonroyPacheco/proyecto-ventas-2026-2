'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function ConfiguracionPage() {
  const router = useRouter()
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Menú
        </button>
        <h1 className="text-4xl font-bold text-white">Configuración</h1>
        <p className="mt-4 text-gray-400">Aquí puedes ajustar la configuración del sistema.</p>
      </div>
    </main>
  );
}