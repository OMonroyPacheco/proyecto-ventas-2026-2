# 🚀 Guía de Instalación - Proyecto Ventas 2026

## Para instalar la aplicación en otro equipo

### Opción 1: Instalador ejecutable (Recomendado para usuarios finales)

1. **Descargar el instalador**
   - Obtener el archivo `Ventas Tecnosocks Setup 0.1.0.exe` del desarrollador

2. **Ejecutar el instalador**
   - Hacer doble clic en el archivo `.exe`
   - Seguir las instrucciones del asistente de instalación
   - Seleccionar carpeta de instalación (recomendado: carpeta por defecto)

3. **Primera ejecución**
   - La aplicación se crea automáticamente
   - Se inicializa la base de datos
   - Se crea el usuario administrador por defecto

4. **Iniciar sesión**
   - Email: `admin@tecnosocks.com`
   - Contraseña: `admin123`
   - ⚠️ **IMPORTANTE**: Cambiar estas credenciales inmediatamente en Configuración

---

### Opción 2: Instalación desde código fuente (Para desarrolladores)

#### Requisitos previos
- Windows 7 o superior
- Node.js 18 o superior (descargar desde https://nodejs.org/)

#### Pasos

1. **Descargar el código**
   ```bash
   git clone <enlace-del-repositorio>
   cd proyecto-ventas-2026-2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```
   ⚠️ Esto puede tomar varios minutos. Esperar hasta que termine sin errores.

3. **Ejecutar la aplicación**
   ```bash
   npm start
   ```
   La aplicación se abrirá automáticamente.

---

## 🔐 Credenciales iniciales

Cuando se ejecuta por primera vez:
- **Email**: admin@tecnosocks.com
- **Contraseña**: admin123

**⚠️ URGENTE**: Cambiar estas credenciales en la sección **Configuración** → **Usuarios** después del primer login.

---

## 📁 Ubicación de datos

Los datos se guardan automáticamente en:
- **Windows**: `C:\Users\TuUsuario\AppData\Roaming\Ventas Tecnosocks\prisma\dev.db`
- **Nota**: Los datos solo existen en esta computadora (no se sincronizan)

---

## ⚙️ Primeros pasos después de instalar

1. ✅ Iniciar sesión con admin@tecnosocks.com / admin123
2. ✅ Cambiar contraseña en Configuración
3. ✅ Crear nuevos usuarios en Configuración → Usuarios
4. ✅ Agregar clientes en Clientes
5. ✅ Agregar productos en Productos
6. ✅ Registrar ventas en Ventas

---

## 🐛 Si la aplicación no funciona

### Problema: "La aplicación se abre múltiples veces"
**Solución:**
- Cerrar todas las instancias con Alt+F4
- Esperar 10 segundos
- Iniciar nuevamente

### Problema: "Error de base de datos"
**Solución:**
1. Cerrar la aplicación completamente
2. Abrir terminal (Cmd) como administrador
3. Navegar a la carpeta de instalación
4. Ejecutar: `node verify-setup.js`
5. Reiniciar la aplicación

### Problema: "Puerto 3002 en uso"
**Solución:**
- Ejecutar en terminal: `netstat -ano | findstr :3002`
- Cerrar la aplicación o proceso que usa ese puerto
- Reiniciar

### Problema: "No se puede iniciar el servidor"
**Solución:**
1. Desinstalar completamente (Panel de Control → Desinstalar programas)
2. Eliminar la carpeta `%APPDATA%\Ventas Tecnosocks`
3. Reinstalar desde cero

---

## 📞 Soporte

Si los pasos anteriores no resuelven el problema:
1. Contactar al equipo de Tecnosocks
2. Proporcionar: versión de Windows, version de Node.js (si aplica)
3. Incluir mensajes de error completos

---

## ✨ Características principales

✅ Gestión de clientes
✅ Catálogo de productos
✅ Registro de ventas
✅ Reportes y análisis
✅ Usuarios con roles
✅ Configuración personalizable
✅ Interfaz intuitiva en español

---

**Versión**: 0.1.0
**Última actualización**: Mayo 2026
**Soporte**: support@tecnosocks.com
