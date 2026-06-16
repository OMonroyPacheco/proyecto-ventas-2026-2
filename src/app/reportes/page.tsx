'use client'
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import * as XLSX from 'xlsx'

interface ComparisonResult {
  barcode: string
  portalName?: string
  sapName?: string
  status: 'match' | 'only_portal' | 'only_sap'
}

export default function ReportesPage() {
  const router = useRouter()
  const [portalFile, setPortalFile] = useState<File | null>(null)
  const [sapFile, setSapFile] = useState<File | null>(null)
  const [results, setResults] = useState<ComparisonResult[]>([])
  const [loading, setLoading] = useState(false)

  const parseExcelFile = async (file: File): Promise<Array<{ [key: string]: any }>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'array' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(sheet) as Array<{ [key: string]: any }>
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const handleComparison = async () => {
    if (!portalFile || !sapFile) {
      alert('Por favor sube ambos archivos')
      return
    }

    setLoading(true)
    try {
      const portalData = await parseExcelFile(portalFile)
      const sapData = await parseExcelFile(sapFile)

      // Normalizar datos y extraer códigos de barras
      const portalMap = new Map()
      const sapMap = new Map()

      portalData.forEach((row) => {
        const barcode = row.codigo_barras || row.barcode || row['Código de Barras'] || row['codigo']
        if (barcode) {
          portalMap.set(String(barcode).trim(), row)
        }
      })

      sapData.forEach((row) => {
        const barcode = row.codigo_barras || row.barcode || row['Código de Barras'] || row['codigo']
        if (barcode) {
          sapMap.set(String(barcode).trim(), row)
        }
      })

      // Realizar comparación
      const comparisonResults: ComparisonResult[] = []
      const allBarcodes = new Set([...portalMap.keys(), ...sapMap.keys()])

      allBarcodes.forEach((barcode) => {
        const portalItem = portalMap.get(barcode)
        const sapItem = sapMap.get(barcode)

        let status: 'match' | 'only_portal' | 'only_sap'
        if (portalItem && sapItem) {
          status = 'match'
        } else if (portalItem) {
          status = 'only_portal'
        } else {
          status = 'only_sap'
        }

        comparisonResults.push({
          barcode,
          portalName: portalItem?.nombre || portalItem?.name || portalItem?.Nombre || '-',
          sapName: sapItem?.nombre || sapItem?.name || sapItem?.Nombre || '-',
          status,
        })
      })

      setResults(comparisonResults.sort((a, b) => a.barcode.localeCompare(b.barcode)))
    } catch (error) {
      console.error('Error al procesar archivos:', error)
      alert('Error al procesar los archivos')
    } finally {
      setLoading(false)
    }
  }

  const exportResults = () => {
    if (results.length === 0) {
      alert('No hay resultados para exportar')
      return
    }

    const exportData = results.map((row) => ({
      'Código de Barras': row.barcode,
      'Nombre Portales': row.portalName || '-',
      'Nombre SAP': row.sapName || '-',
      'Estado': row.status === 'match' ? 'Coincide' : row.status === 'only_portal' ? 'Solo en Portales' : 'Solo en SAP',
    }))

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparación')
    XLSX.writeFile(workbook, 'comparacion_portales_sap.xlsx')
  }

  const matchCount = results.filter((r) => r.status === 'match').length
  const onlyPortalCount = results.filter((r) => r.status === 'only_portal').length
  const onlySapCount = results.filter((r) => r.status === 'only_sap').length

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

        <h1 className="text-4xl font-bold text-white">Reportes</h1>
        <p className="mt-4 text-gray-400">Comparación de datos entre Portales y SAP por código de barras</p>

        {/* Sección de carga de archivos */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Archivo Portales */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Archivo Portales</h2>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setPortalFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {portalFile && <p className="text-sm text-green-400">✓ {portalFile.name}</p>}
            </div>
          </div>

          {/* Archivo SAP */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Archivo SAP</h2>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setSapFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {sapFile && <p className="text-sm text-green-400">✓ {sapFile.name}</p>}
            </div>
          </div>
        </div>

        {/* Botón de comparación */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleComparison}
            disabled={loading || !portalFile || !sapFile}
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold transition-colors duration-200"
          >
            {loading ? 'Procesando...' : 'Realizar Comparación'}
          </button>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="mt-10 space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-green-700 bg-green-900/30 p-4">
                <p className="text-gray-300 text-sm">Coincidencias</p>
                <p className="text-3xl font-bold text-green-400">{matchCount}</p>
              </div>
              <div className="rounded-lg border border-orange-700 bg-orange-900/30 p-4">
                <p className="text-gray-300 text-sm">Solo en Portales</p>
                <p className="text-3xl font-bold text-orange-400">{onlyPortalCount}</p>
              </div>
              <div className="rounded-lg border border-red-700 bg-red-900/30 p-4">
                <p className="text-gray-300 text-sm">Solo en SAP</p>
                <p className="text-3xl font-bold text-red-400">{onlySapCount}</p>
              </div>
            </div>

            {/* Botón de exportación */}
            <button
              onClick={exportResults}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
            >
              Descargar Resultado (.xlsx)
            </button>

            {/* Tabla de resultados */}
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 font-semibold text-white">Código de Barras</th>
                    <th className="px-4 py-3 font-semibold text-white">Nombre Portales</th>
                    <th className="px-4 py-3 font-semibold text-white">Nombre SAP</th>
                    <th className="px-4 py-3 font-semibold text-white">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-300 font-mono">{row.barcode}</td>
                      <td className="px-4 py-3 text-gray-300">{row.portalName || '-'}</td>
                      <td className="px-4 py-3 text-gray-300">{row.sapName || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            row.status === 'match'
                              ? 'bg-green-900/50 text-green-300'
                              : row.status === 'only_portal'
                                ? 'bg-orange-900/50 text-orange-300'
                                : 'bg-red-900/50 text-red-300'
                          }`}
                        >
                          {row.status === 'match' ? 'Coincide' : row.status === 'only_portal' ? 'Solo en Portales' : 'Solo en SAP'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
