#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('🔧 Inicializando aplicación...')

try {
  const appPath = path.resolve(__dirname, '..')
  
  // Generar cliente de Prisma
  console.log('📦 Generando cliente de Prisma...')
  execSync('prisma generate', {
    cwd: appPath,
    stdio: 'inherit'
  })
  
  console.log('✅ Aplicación inicializada correctamente')
} catch (error) {
  console.error('❌ Error durante la inicialización:', error.message)
  process.exit(1)
}
