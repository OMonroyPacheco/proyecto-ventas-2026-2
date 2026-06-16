"use client";

export default function SAPPage() {
  const openRemoteDesktop = () => {
    window.location.href = 'mstsc://';
  }

  return (
    <main className="min-h-screen bg-[#031523] px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-800 bg-slate-950/70 p-10 shadow-2xl shadow-slate-950/30">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Conexión remota</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">SAP</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Usa esta sección para abrir la conexión de Escritorio Remoto directamente desde el navegador.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <div className="rounded-3xl bg-slate-800/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Accesorio: Conexión a Escritorio Remoto de Windows</h2>
            <p className="mt-2 text-slate-400">
              Este accesorio te permite abrir el cliente de Escritorio Remoto de Windows para conectarte al servidor SAP que necesitas.
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl bg-slate-950/80 border border-slate-800 p-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-slate-300">Cliente remoto de Windows</p>
              <p className="mt-2 text-sm text-slate-400">
                Usa el botón para iniciar el acceso remoto. Una vez abierto, ingresa el nombre del equipo o la dirección IP del servidor al que deseas conectarte.
              </p>
              <ul className="mt-4 space-y-2 text-slate-400 text-sm">
                <li>• Protocolo: RDP</li>
                <li>• Aplicación: Escritorio remoto de Windows</li>
                <li>• Dirección: ingresa tu servidor en la ventana de conexión</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={openRemoteDesktop}
              className="inline-flex h-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-500"
            >
              Abrir Escritorio Remoto
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
