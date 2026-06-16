#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔧 Verificando instalación de Proyecto Ventas 2026...')

try {
  // Verificar que todas las dependencias estén instaladas
  console.log('📦 Verificando dependencias...')
  
  const packageJsonPath = path.join(__dirname, 'package.json')
  const nodeModulesPath = path.join(__dirname, 'node_modules')
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('⚠️ node_modules no encontrado. Instalando dependencias...')
    execSync('npm install', {
      cwd: __dirname,
      stdio: 'inherit'
    })
  }

  // Generar cliente de Prisma
  console.log('📦 Generando cliente de Prisma...')
  // Intentar eliminar posibles archivos bloqueados por procesos anteriores (Windows)
  try {
    const prismaEngine = path.join(__dirname, 'node_modules', '.prisma', 'client', 'query_engine-windows.dll.node')
    if (fs.existsSync(prismaEngine)) {
      console.log('⚠️ Archivo de Prisma detectado:', prismaEngine)
      let removed = false
      function sleep(ms) {
        const end = Date.now() + ms
        while (Date.now() < end) {}
      }
      for (let i = 0; i < 5; i++) {
        try {
          fs.unlinkSync(prismaEngine)
          removed = true
          console.log('✅ Archivo bloqueado eliminado')
          break
        } catch (e) {
          console.log('⏳ Esperando y reintentando eliminar archivo bloqueado...')
          sleep(500)
        }
      }
      if (!removed) {
        console.warn('❌ No se pudo eliminar el archivo bloqueado de Prisma. Intentando renombrarlo...')
        try {
          const bakPath = prismaEngine + '.bak'
          if (fs.existsSync(bakPath)) fs.unlinkSync(bakPath)
          fs.renameSync(prismaEngine, bakPath)
          console.log('✅ Archivo renombrado a .bak para liberar bloqueo')
        } catch (e) {
          console.warn('❌ Falló renombrar el archivo bloqueado:', e.message)
          console.warn('Cierra cualquier instancia de la app y vuelve a intentar manualmente.')
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Error al intentar limpiar archivos bloqueados:', e.message)
  }

  execSync('npx prisma generate', {
    cwd: __dirname,
    stdio: 'inherit'
  })

  // Verificar estructura de carpetas críticas
  console.log('📁 Verificando estructura de carpetas...')
  const requiredDirs = [
    path.join(__dirname, '.next'),
    path.join(__dirname, 'prisma'),
  ]

  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`📁 Creando directorio: ${path.relative(__dirname, dir)}`)
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  console.log('✅ Verificación completada exitosamente')
  console.log('💡 Tip: Si hay errores, ejecuta: npm install && npx prisma generate')

} catch (error) {
  console.error('❌ Error durante la verificación:', error.message)
  process.exit(1)
}
