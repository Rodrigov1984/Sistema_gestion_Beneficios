# 🎁 Sistema de Gestión de Beneficios

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-6.0.11-646cff.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)

**Sistema integral para la gestión y entrega de beneficios corporativos con validación mediante códigos QR**

[Características](#-características) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Roles](#-roles-del-sistema) •
[Personalización](#-personalización) •
[Tecnologías](#-tecnologías)

</div>

---

## 📋 Descripción

El **Sistema de Gestión de Beneficios** es una aplicación web moderna desarrollada para gestionar la entrega de beneficios corporativos a empleados. El sistema permite la administración completa del ciclo de vida de los beneficios, desde la carga de nóminas hasta la validación y registro de entregas mediante códigos QR.

Diseñado originalmente para **Tresmontes Lucchetti**, el sistema es completamente personalizable y puede adaptarse a cualquier organización mediante su potente editor de temas.

---

## ✨ Características

### 🔐 Sistema de Autenticación por Roles
- **Empleados**: Acceso mediante RUT para consultar información y generar códigos QR
- **Guardias**: Login con usuario y contraseña para validar entregas
- **Administradores**: Acceso completo con credenciales seguras

### 📊 Panel de Administrador
- **Dashboard Estadístico**: Visualización de métricas clave con gráficos interactivos
- **Gestión de Nómina**: Carga masiva de empleados mediante Excel (.xlsx)
- **Gestión de Guardias**: CRUD completo de usuarios guardia
- **Gestión de Beneficios**: Asignación y seguimiento de beneficios
- **Reportes**: Estadísticas por contrato, rol, localidad y planta
- **Exportación de Datos**: Descarga de reportes en Excel

### 👤 Portal del Empleado
- **Visualización de Datos**: Información personal y de contrato
- **Generación de QR**: Código QR personalizado con datos del beneficio
- **Descarga de QR**: Imagen con información completa para retiro
- **Estado del Beneficio**: Seguimiento en tiempo real

### 🛡️ Portal del Guardia
- **Escaneo de QR**: Validación mediante cámara del dispositivo
- **Búsqueda Manual**: Verificación por RUT
- **Registro de Entregas**: Confirmación y registro de beneficios entregados
- **Escaneo de Paquetes**: Validación de códigos de cajas/paquetes

### 🎨 Sistema de Personalización Completo
El editor de temas permite personalizar completamente la apariencia:

| Categoría | Opciones |
|-----------|----------|
| **Empresa** | Nombre, slogan, logo personalizado |
| **Colores** | Primario, secundario, acento, fondos, estados |
| **Tipografía** | Familia de fuente (11 opciones), tamaños, pesos |
| **Botones** | Radio de bordes, padding, tamaño de fuente |
| **Bordes** | Grosor, color, radio general |
| **Sombras** | Intensidad, color |
| **Espaciado** | Unidad base, ancho máximo de contenedor |
| **Animaciones** | Velocidad de transición, activar/desactivar |
| **Avanzado** | CSS personalizado, imagen de fondo |

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 18.x o superior
- npm 9.x o superior

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sistema-gestion-beneficios.git

# Navegar al directorio
cd sistema-gestion-beneficios

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 🌐 Despliegue en Vercel

Este proyecto está configurado para desplegarse en Vercel. Sigue estos pasos:

#### Opción 1: Despliegue desde GitHub

1. Sube tu proyecto a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Haz clic en "New Project"
4. Importa tu repositorio desde GitHub
5. Vercel detectará automáticamente la configuración de Vite
6. Haz clic en "Deploy"

#### Opción 2: Despliegue con Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar (desde el directorio del proyecto)
vercel

# Para producción
vercel --prod
```

#### Configuración Incluida

El proyecto incluye un archivo `vercel.json` con la siguiente configuración:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Esta configuración asegura:
- ✅ Build automático con Vite
- ✅ Directorio de salida correcto (`dist`)
- ✅ Soporte para Single Page Application (SPA)
- ✅ Rutas dinámicas funcionando correctamente

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run test` | Ejecuta tests en modo watch |
| `npm run test:ui` | Ejecuta tests con UI interactiva |
| `npm run test:run` | Ejecuta tests una sola vez |

---

## 📖 Uso

### Acceso al Sistema

Al iniciar la aplicación, se presenta una pantalla de selección de rol:

1. **Usuario/Empleado**: Ingresa tu RUT para acceder a tu portal
2. **Guardia**: Ingresa tus credenciales (usuario y contraseña)
3. **Administrador**: Ingresa las credenciales de administrador

### Credenciales de Demo

#### Administrador
```
Usuario: admin
Contraseña: admin123
```

#### Guardias de Demo
| Nombre | Usuario | Contraseña |
|--------|---------|------------|
| Juan Pérez | 15123456-7 | 15123456 |
| Pedro González | 16234567-8 | 16234567 |

#### Empleados de Demo
Los empleados acceden con su RUT. Ejemplos:
- `16.234.567-8` - María Fernández
- `18.345.678-9` - Carlos Muñoz

---

## 👥 Roles del Sistema

### 🧑‍💼 Empleado
Los empleados pueden:
- Ver su información personal y de contrato
- Consultar el beneficio asignado y su estado
- Generar un código QR personalizado
- Descargar el QR con toda la información del beneficio
- Ver instrucciones de retiro

### 🛡️ Guardia
Los guardias pueden:
- Escanear códigos QR de empleados
- Buscar empleados por RUT manualmente
- Validar la elegibilidad del beneficio
- Registrar la entrega del beneficio
- Escanear códigos de paquetes/cajas

### ⚙️ Administrador
Los administradores tienen acceso completo:
- **Dashboard**: Estadísticas globales con gráficos
- **Gestión de Empleados**: 
  - Carga masiva mediante Excel
  - Edición y eliminación de registros
  - Filtros por contrato, rol, localidad y estado
- **Gestión de Guardias**:
  - Crear, editar, activar/desactivar guardias
  - Gestión de contraseñas
- **Gestión de Beneficios**:
  - Configurar tipos de beneficios
  - Asignar beneficios a empleados
  - Notificaciones masivas
- **Reportes**: Estadísticas detalladas exportables
- **Personalización**: Editor de temas completo

---

## 🎨 Personalización

### Editor de Temas

El sistema incluye un potente editor de personalización accesible desde el panel de administrador (ícono ⚙️ Personalizar).

#### Categorías de Personalización:

1. **Logo de la Empresa**
   - Subir imagen personalizada
   - Ajustar dimensiones (ancho y alto)

2. **Información de Empresa**
   - Nombre de la empresa
   - Slogan o descripción

3. **Colores Principales**
   - Color primario (botones, enlaces, títulos)
   - Color secundario (acentos, cabecera)
   - Color de acento
   - Color de fondo general
   - Color de fondo de tarjetas

4. **Colores de Estado**
   - Éxito (verde)
   - Advertencia (amarillo)
   - Error (rojo)
   - Información (azul)

5. **Tipografía**
   - Familia de fuente (11 opciones disponibles)
   - Tamaño de texto base (12-24px)
   - Tamaño de títulos (16-48px)
   - Peso de fuente normal (300-800)
   - Peso de fuente para títulos (300-800)

6. **Estilo de Botones**
   - Radio de bordes (0-24px)
   - Padding horizontal (8-40px)
   - Padding vertical (4-24px)
   - Tamaño de fuente (10-20px)

7. **Bordes y Esquinas**
   - Grosor de bordes (0-5px)
   - Color de bordes
   - Radio general (0-24px)

8. **Sombras**
   - Intensidad (0-50%)
   - Color de sombra

9. **Espaciado**
   - Unidad de espaciado (2-12px)
   - Ancho máximo del contenedor (800-1920px)

10. **Animaciones**
    - Velocidad de transición (0-1000ms)
    - Activar/desactivar animaciones

11. **CSS Personalizado**
    - Campo de texto para estilos CSS adicionales

### Persistencia

Todas las configuraciones de tema se guardan automáticamente en `localStorage` y persisten entre sesiones.

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | 18.3.1 | Biblioteca de UI |
| TypeScript | 5.7.3 | Tipado estático |
| Vite | 6.0.11 | Build tool y dev server |
| Tailwind CSS | 4.0 | Framework CSS utility-first |

### Componentes UI
| Librería | Descripción |
|----------|-------------|
| Radix UI | Componentes accesibles y sin estilo |
| Lucide React | Iconos SVG |
| Recharts | Gráficos y visualizaciones |
| CMDK | Componente de comandos |

### Funcionalidades Específicas
| Librería | Descripción |
|----------|-------------|
| qrcode | Generación de códigos QR |
| jsQR | Lectura de códigos QR |
| @zxing/library | Escaneo de códigos de barras/QR |
| xlsx | Lectura/escritura de archivos Excel |
| react-hook-form | Manejo de formularios |
| sonner | Notificaciones toast |

### Testing
| Herramienta | Descripción |
|-------------|-------------|
| Vitest | Framework de testing |
| Testing Library | Utilidades de testing para React |
| Happy DOM / JSDOM | Entorno de DOM para tests |

---

## 📁 Estructura del Proyecto

```
src/
├── assets/              # Recursos estáticos (imágenes, logos)
├── components/          # Componentes React
│   ├── ui/             # Componentes UI reutilizables
│   ├── AdminDashboard.tsx
│   ├── EmpleadoDashboard.tsx
│   ├── GuardiaDashboard.tsx
│   ├── LoginForm.tsx
│   ├── ThemeEditor.tsx
│   └── ThemeLogo.tsx
├── context/            # Contextos React
│   └── ThemeContext.tsx
├── lib/                # Utilidades
│   └── utils.ts
├── styles/             # Estilos globales
│   └── globals.css
├── tests/              # Tests
│   ├── casosBeneficios.test.tsx
│   └── setup.ts
├── types/              # Definiciones de tipos
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos base
```

---

## 🔧 Configuración

### Variables de Entorno

Actualmente el sistema funciona completamente en el frontend sin necesidad de backend. Los datos se persisten en `localStorage`.

### Formato de Excel para Carga de Nómina

El archivo Excel debe contener las siguientes columnas:

| Columna | Descripción | Valores Permitidos |
|---------|-------------|-------------------|
| nombre | Nombre completo | Texto |
| rut | RUT del empleado | Formato: XX.XXX.XXX-X |
| correo | Email | Email válido |
| tipoContrato | Tipo de contrato | "Planta" o "Plazo Fijo" |
| rol | Rol del empleado | "Guardia", "Personal de Base", "Oficina", "Supervisión", "Administración" |
| localidad | Ubicación | Texto |
| planta | Planta asignada | Texto |
| beneficio | Beneficio asignado | Texto (ej: "Caja de Navidad") |

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests una vez
npm run test:run
```

### Casos de Prueba Incluidos
- ✅ Login de administrador (credenciales correctas e incorrectas)
- ✅ Login de guardia
- ✅ Generación de códigos QR
- ✅ Validación de QR
- ✅ Gestión de empleados
- ✅ Gestión de guardias

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto integrado. Todos los derechos reservados.

---

## 👨‍💻 Autor

Desarrollado como proyecto integrado del programa Analista Programador.

---

<div align="center">

**Sistema de Gestión de Beneficios** - Simplificando la entrega de beneficios corporativos

</div>
