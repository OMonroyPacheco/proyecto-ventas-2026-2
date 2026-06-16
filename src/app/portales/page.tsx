'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ExternalLink, ArrowLeft } from 'lucide-react'

interface Portal {
  id: string
  titulo: string
  url: string
  categoria: string
}

export default function PortalesPage() {
  const router = useRouter()

  const portales: Portal[] = [
    {
      id: '1',
      titulo: 'Walmart Mexico Wilson',
      url: 'https://retaillink.login.wal-mart.com/login',
      categoria: 'Walmart',
    },
    {
      id: '2',
      titulo: 'Walmart Mexico Fruit',
      url: 'https://retaillink.login.wal-mart.com/login',
      categoria: 'Walmart',
    },
    {
      id: '3',
      titulo: 'Walmart CentroAmerica',
      url: 'https://retaillink.login.wal-mart.com/login',
      categoria: 'Walmart',
    },
    {
      id: '4',
      titulo: 'Walmart Chile',
      url: 'https://retaillink.login.wal-mart.com/login',
      categoria: 'Walmart',
    },
    {
      id: '5',
      titulo: 'DSW Control',
      url: 'https://artusweb.dswenlinea.mx/artus_login/projects/main.php',
      categoria: 'DSW',
    },
    {
      id: '6',
      titulo: 'City Fresko Wilson',
      url: 'https://www.provecomer.com.mx/webPrvd/LoginProvecomerNpSrv',
      categoria: 'City Fresko',
    },
    {
      id: '7',
      titulo: 'City Fresko Fruit',
      url: 'https://www.provecomer.com.mx/webPrvd/LoginProvecomerNpSrv',
      categoria: 'City Fresko',
    },
    {
      id: '8',
      titulo: 'Chedraui',
      url: 'https://chedlink.chedraui.com.mx/Artus/g940/projects/main.php?LoginError=4',
      categoria: 'Chedraui',
    },
  ]

  const logos: Record<string, string> = {
    Walmart: '/images/Walmart.png',
    DSW: '/images/DSW.png',
    'City Fresko': '/images/Fresko.png',
    Chedraui: '/images/Chedraui.png',
  }

  const categorias = Array.from(
    new Set(portales.map((p) => p.categoria))
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Botón regresar */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Menú
        </button>

        {/* Título */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Portales
        </h1>

        <p className="text-gray-400 mb-8">
          Accesos directos a los portales de nuestros clientes
        </p>

        {/* Categorías */}
        <div className="space-y-10">
          {categorias.map((categoria) => (
            <div key={categoria} className="space-y-5">

              {/* Encabezado con logo SIN recuadro */}
              <div className="flex items-center gap-4 border-b border-blue-500 pb-4">

                <div className="w-40 h-20 flex items-center">
                  <Image
                    src={logos[categoria]}
                    alt={categoria}
                    width={180}
                    height={90}
                    className="max-h-20 w-auto object-contain"
                  />
                </div>

                <h2 className="text-2xl font-semibold text-blue-400">
                  {categoria}
                </h2>

              </div>

              {/* Tarjetas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {portales
                  .filter((p) => p.categoria === categoria)
                  .map((portal) => (

                    <a
                      key={portal.id}
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 transition-all duration-300 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20"
                    >
                      <div className="flex items-start justify-between">

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {portal.titulo}
                          </h3>

                          <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                            {portal.url
                              .replace('https://', '')
                              .split('/')[0]}
                          </p>
                        </div>

                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />

                      </div>

                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                    </a>

                  ))}
              </div>

            </div>
          ))}
        </div>

        {/* Información */}
        <div className="mt-12 p-6 rounded-xl bg-gray-800/50 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">
            💡 Información
          </h3>

          <p className="text-gray-400 text-sm">
            Haz clic en cualquier portal para acceder directamente.
            Se abrirá en una nueva pestaña.
          </p>
        </div>

      </div>
    </main>
  )
}