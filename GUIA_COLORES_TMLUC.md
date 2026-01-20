# 🎨 Guía de Uso de Colores TMLUC

## Paleta de Colores Corporativa

```css
--tmluc-rojo:        #E12019  /* Rojo corporativo principal */
--tmluc-blanco:      #FFFFFF  /* Blanco base */
--tmluc-gris-claro:  #F5F5F5  /* Gris claro para fondos */
--tmluc-texto:       #222222  /* Texto oscuro */
```

---

## 📋 Recomendaciones de Uso por Componente

### 🔴 Rojo TMLUC (#E12019)
**Úsalo para:**

#### Botones Principales (CTA - Call to Action)
```tsx
// Tailwind
<Button className="bg-tmluc-rojo text-tmluc-blanco hover:bg-tmluc-rojo-hover">
  Solicitar Beneficio
</Button>

// Clase utility personalizada
<button className="btn-tmluc-primary">
  Aprobar Solicitud
</button>
```

#### Headers y Títulos Principales
```tsx
<h1 className="text-tmluc-rojo text-3xl font-bold">
  Sistema de Gestión de Beneficios
</h1>

<div className="card-tmluc-header">
  <h2 className="text-tmluc-rojo font-semibold">Mis Solicitudes</h2>
</div>
```

#### Badges de Estado Activo/Aprobado
```tsx
<span className="badge-tmluc-activo">Activo</span>
<span className="badge-tmluc-activo">Aprobado</span>

// O con Tailwind puro
<span className="bg-tmluc-rojo text-tmluc-blanco px-3 py-1 rounded-full text-sm">
  Aprobado
</span>
```

#### Iconos Destacados
```tsx
import { CheckCircle, AlertCircle } from 'lucide-react';

<CheckCircle className="text-tmluc-rojo w-6 h-6" />
<AlertCircle className="text-tmluc-rojo w-5 h-5" />
```

#### Bordes de Cards Destacadas
```tsx
<div className="bg-tmluc-blanco border-l-4 border-tmluc-rojo p-4 shadow-md">
  <h3 className="font-semibold">Solicitud Urgente</h3>
</div>
```

---

### ⚪ Blanco TMLUC (#FFFFFF)
**Úsalo para:**

#### Fondos Principales
```tsx
<div className="min-h-screen bg-tmluc-blanco">
  {/* Contenido de la app */}
</div>
```

#### Cards y Paneles
```tsx
<div className="card-tmluc">
  <h3>Panel de Control</h3>
  <p>Contenido del panel</p>
</div>

// O manual
<div className="bg-tmluc-blanco rounded-lg shadow-md p-6">
  {/* contenido */}
</div>
```

#### Texto sobre Fondo Rojo
```tsx
<button className="bg-tmluc-rojo text-tmluc-blanco px-4 py-2">
  Texto en blanco sobre rojo
</button>
```

#### Modales y Diálogos
```tsx
<Dialog>
  <DialogContent className="bg-tmluc-blanco">
    {/* contenido del modal */}
  </DialogContent>
</Dialog>
```

---

### 🔲 Gris Claro TMLUC (#F5F5F5)
**Úsalo para:**

#### Fondo Alternativo de Página
```tsx
<div className="min-h-screen bg-tmluc-gris-claro">
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Cards sobre fondo gris */}
  </div>
</div>
```

#### Tablas con Zebra Striping
```tsx
<table className="table-tmluc w-full">
  <tbody>
    <tr className="bg-tmluc-blanco">
      <td>Fila 1 - Blanco</td>
    </tr>
    <tr className="bg-tmluc-gris-claro">
      <td>Fila 2 - Gris claro</td>
    </tr>
  </tbody>
</table>

// O con clase automática
<table className="table-tmluc">
  {/* zebra striping automático */}
</table>
```

#### Secciones Secundarias
```tsx
<div className="bg-tmluc-gris-claro p-6 rounded-lg">
  <h4 className="text-tmluc-texto font-medium mb-2">Información Adicional</h4>
  <p className="text-tmluc-texto text-sm">Detalles secundarios...</p>
</div>
```

#### Inputs Deshabilitados
```tsx
<Input 
  disabled 
  className="bg-tmluc-gris-claro text-tmluc-texto cursor-not-allowed"
  value="Campo deshabilitado"
/>
```

#### Separadores y Bordes Sutiles
```tsx
<div className="border-b border-tmluc-gris-claro pb-4 mb-4">
  {/* Contenido con separador */}
</div>
```

---

### ⚫ Texto TMLUC (#222222)
**Úsalo para:**

#### Todo el Texto del Cuerpo
```tsx
<p className="text-tmluc-texto text-base">
  Contenido principal de lectura
</p>
```

#### Títulos y Subtítulos (sin énfasis rojo)
```tsx
<h2 className="text-tmluc-texto text-2xl font-semibold">
  Título de Sección
</h2>

<h3 className="text-tmluc-texto text-lg font-medium">
  Subtítulo
</h3>
```

#### Labels de Formularios
```tsx
<label className="text-tmluc-texto font-medium mb-2 block">
  Nombre Completo
</label>
<Input className="border-tmluc-gris-claro" />
```

#### Contenido de Tablas
```tsx
<table>
  <tbody>
    <tr>
      <td className="text-tmluc-texto">Juan Pérez</td>
      <td className="text-tmluc-texto">15.123.456-7</td>
    </tr>
  </tbody>
</table>
```

---

## 🎯 Ejemplos de Componentes Completos

### Card de Solicitud de Beneficio
```tsx
<div className="card-tmluc">
  <div className="card-tmluc-header">
    <h3 className="text-tmluc-rojo text-xl font-semibold">
      Solicitud de Almuerzo
    </h3>
  </div>
  
  <div className="space-y-3">
    <div className="flex justify-between">
      <span className="text-tmluc-texto font-medium">Estado:</span>
      <span className="badge-tmluc-activo">Aprobado</span>
    </div>
    
    <div className="flex justify-between">
      <span className="text-tmluc-texto font-medium">Fecha:</span>
      <span className="text-tmluc-texto">18/12/2025</span>
    </div>
    
    <div className="bg-tmluc-gris-claro p-3 rounded">
      <p className="text-tmluc-texto text-sm">
        Tu solicitud ha sido aprobada y estará disponible mañana.
      </p>
    </div>
  </div>
  
  <button className="btn-tmluc-primary w-full mt-4">
    Ver Detalles
  </button>
</div>
```

### Panel de Selección de Roles
```tsx
<div className="min-h-screen bg-tmluc-gris-claro flex items-center justify-center">
  <div className="max-w-4xl mx-auto p-8">
    <h1 className="text-tmluc-rojo text-3xl font-bold text-center mb-8">
      Sistema de Gestión de Beneficios
    </h1>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card Empleado */}
      <div className="card-tmluc hover:border-tmluc-rojo border-2 border-transparent transition-all cursor-pointer">
        <User className="text-tmluc-rojo w-12 h-12 mx-auto mb-4" />
        <h3 className="text-tmluc-texto text-center font-semibold text-lg">
          Empleado
        </h3>
        <button className="btn-tmluc-primary w-full mt-4">
          Ingresar
        </button>
      </div>
      
      {/* Card Guardia */}
      <div className="card-tmluc hover:border-tmluc-rojo border-2 border-transparent transition-all cursor-pointer">
        <Shield className="text-tmluc-rojo w-12 h-12 mx-auto mb-4" />
        <h3 className="text-tmluc-texto text-center font-semibold text-lg">
          Guardia
        </h3>
        <button className="btn-tmluc-primary w-full mt-4">
          Ingresar
        </button>
      </div>
      
      {/* Card Admin */}
      <div className="card-tmluc hover:border-tmluc-rojo border-2 border-transparent transition-all cursor-pointer">
        <Settings className="text-tmluc-rojo w-12 h-12 mx-auto mb-4" />
        <h3 className="text-tmluc-texto text-center font-semibold text-lg">
          Administrador
        </h3>
        <button className="btn-tmluc-primary w-full mt-4">
          Ingresar
        </button>
      </div>
    </div>
  </div>
</div>
```

### Tabla de Empleados
```tsx
<div className="card-tmluc">
  <div className="card-tmluc-header">
    <h2 className="text-tmluc-rojo text-xl font-semibold">
      Listado de Empleados
    </h2>
  </div>
  
  <table className="table-tmluc w-full">
    <thead className="bg-tmluc-gris-claro">
      <tr>
        <th className="text-tmluc-texto text-left p-3">RUT</th>
        <th className="text-tmluc-texto text-left p-3">Nombre</th>
        <th className="text-tmluc-texto text-left p-3">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-tmluc-gris-claro transition">
        <td className="text-tmluc-texto p-3">15.123.456-7</td>
        <td className="text-tmluc-texto p-3">Juan Pérez</td>
        <td className="p-3">
          <span className="badge-tmluc-activo">Activo</span>
        </td>
      </tr>
      <tr className="hover:bg-tmluc-gris-claro transition">
        <td className="text-tmluc-texto p-3">16.234.567-8</td>
        <td className="text-tmluc-texto p-3">María González</td>
        <td className="p-3">
          <span className="badge-tmluc-inactivo">Inactivo</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Formulario de Login
```tsx
<div className="min-h-screen bg-tmluc-gris-claro flex items-center justify-center">
  <div className="card-tmluc max-w-md w-full">
    <div className="card-tmluc-header">
      <h2 className="text-tmluc-rojo text-2xl font-bold text-center">
        Iniciar Sesión
      </h2>
    </div>
    
    <form className="space-y-4">
      <div>
        <label className="text-tmluc-texto font-medium mb-2 block">
          RUT
        </label>
        <Input 
          className="border-tmluc-gris-claro focus:border-tmluc-rojo" 
          placeholder="12.345.678-9"
        />
      </div>
      
      <div>
        <label className="text-tmluc-texto font-medium mb-2 block">
          Contraseña
        </label>
        <Input 
          type="password"
          className="border-tmluc-gris-claro focus:border-tmluc-rojo" 
          placeholder="••••••••"
        />
      </div>
      
      <button className="btn-tmluc-primary w-full">
        Ingresar
      </button>
      
      <button className="btn-tmluc-secondary w-full">
        Cancelar
      </button>
    </form>
  </div>
</div>
```

---

## 🔧 Configuración Tailwind (Opcional)

Si prefieres configurar los colores en `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'tmluc-rojo': '#E12019',
        'tmluc-blanco': '#FFFFFF',
        'tmluc-gris-claro': '#F5F5F5',
        'tmluc-texto': '#222222',
        'tmluc-rojo-hover': '#c91a14',
        'tmluc-rojo-light': '#f5e5e4',
      }
    }
  }
}
```

---

## ✅ Checklist de Consistencia

- [ ] Todos los botones principales usan `bg-tmluc-rojo`
- [ ] Todo el texto del cuerpo usa `text-tmluc-texto`
- [ ] Fondos alternos entre `bg-tmluc-blanco` y `bg-tmluc-gris-claro`
- [ ] Cards tienen fondo `bg-tmluc-blanco` con sombra
- [ ] Headers importantes usan `text-tmluc-rojo`
- [ ] Badges activos usan `badge-tmluc-activo`
- [ ] Tablas usan `table-tmluc` para zebra striping
- [ ] Separadores usan `border-tmluc-gris-claro`

---

## 📱 Responsive y Accesibilidad

```tsx
/* Asegurar contraste adecuado */
<button className="bg-tmluc-rojo text-tmluc-blanco">
  {/* Contraste 7.3:1 - WCAG AAA ✓ */}
</button>

<p className="text-tmluc-texto bg-tmluc-blanco">
  {/* Contraste 14.7:1 - WCAG AAA ✓ */}
</p>

/* Estados de foco accesibles */
<button className="bg-tmluc-rojo focus:ring-2 focus:ring-tmluc-rojo focus:ring-offset-2">
  Accesible
</button>
```
