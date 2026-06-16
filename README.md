# Proyecto Ventas 2026

Sistema ERP de ventas empaquetado con Electron y Next.js. Gestiona clientes, productos y ventas con base de datos SQLite local.

## 📋 Requisitos previos

- Node.js 18+ (descargar desde https://nodejs.org/)
- npm 9+ (incluido con Node.js)

## 🚀 Instalación en tu equipo

### Desarrollo

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <repositorio>
   cd proyecto-ventas-2026-2
   ```

2. **Instalar dependencias** (esto ejecuta automáticamente la configuración)
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá automáticamente. El servidor Next.js corre en puerto 3002.

### Producción (Empaquetar la aplicación)

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Crear ejecutable instalable**
   ```bash
   npm run dist
   ```
   Esto genera el archivo `.exe` en la carpeta `dist/`. Puedes distribuir este archivo.

## 💾 Instalación en otro equipo (Usuario final)

### Método 1: Usando el ejecutable

1. Descargar el archivo `Ventas Tecnosocks Setup 0.1.0.exe` desde `dist/`
2. Ejecutar el instalador
3. La aplicación se instala automáticamente
4. Primera ejecución: Se crea automáticamente la base de datos con usuario admin

### Método 2: Desde código fuente

1. Asegúrate de que Node.js 18+ esté instalado
2. Descarga el código del proyecto
3. Abre terminal en la carpeta del proyecto
4. Ejecuta:
   ```bash
   npm install
   npm start
   ```

## 🔑 Credenciales iniciales

Cuando se ejecuta por primera vez, se crea automáticamente:
- **Email**: admin@tecnosocks.com
- **Contraseña**: admin123

⚠️ **Importante**: Cambiar estas credenciales en la sección de Configuración después del primer login.

## 📁 Estructura de datos

- **Base de datos**: Se guarda automáticamente en `%APPDATA%\Ventas Tecnosocks\prisma\dev.db` (Windows)
- **Configuración**: Datos guardados localmente en SQLite
- **Sin sincronización**: Los datos quedan en la máquina local

## 🛠️ Funcionalidades

- ✅ Login y gestión de usuarios
- ✅ Administración de clientes
- ✅ Catálogo de productos
- ✅ Registro de ventas
- ✅ Reportes
- ✅ Configuración del sistema
- ✅ Portal de clientes
- ✅ Integración SAP

## 📝 Comandos útiles

### Desarrollo
- `npm run dev` - Ejecutar en modo desarrollo (Electron + Next.js)
- `npm run lint` - Verificar código con ESLint

### Base de datos
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run db:push` - Sincronizar esquema con base de datos

### Producción
- `npm run build` - Construir Next.js para producción
- `npm start` - Ejecutar en modo producción (requiere `npm run build` primero)
- `npm run dist` - Crear ejecutable instalable (.exe)

## 🐛 Solución de problemas

### "La aplicación se abre múltiples veces"
- Verificar que no haya otras instancias corriendo
- Revisar que el puerto 3002 esté disponible
- Reiniciar la máquina si persiste el problema

### "Error de base de datos"
- Eliminar la carpeta `node_modules` y ejecutar `npm install`
- Ejecutar `npm run prisma:generate`
- Si persiste, eliminar la carpeta `prisma/` y ejecutar nuevamente

### "No funciona después de instalar en otro equipo"
- Verificar que Node.js 18+ esté instalado: `node --version`
- Ejecutar desde terminal: `npm install` (esto verifica automáticamente todo)
- Revisar que no haya puertos en uso (3002)

### "Errores de permisos"
- Ejecutar como administrador la terminal
- En Linux/Mac: usar `sudo` si es necesario

## 📞 Soporte

Para reportar problemas o solicitar features, contactar al equipo de Tecnosocks.

## 📄 Licencia

Proyecto propietario de Tecnosocks © 2026
