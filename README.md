# Sistema de Gestión de Beneficios

Aplicación React + Vite para gestionar la entrega de beneficios (ej. Cajas de Navidad) a empleados y control por guardias. Persistencia local con `localStorage` (no requiere backend). Diseño original: https://www.figma.com/design/ALnZy0G9D9JQ4kx1A4S60i/Sistema-de-Gesti%C3%B3n-de-Beneficios.

## Requisitos

- Node.js 18+ (recomendado LTS). Verificar: `node -v`.
- npm 9+ o pnpm/yarn (ejemplos aquí con npm).

## Clonar y ejecutar (red con acceso a GitHub)

```powershell
# Clonar el repositorio
git clone https://github.com/Rodrigov1984/Sistema_gestion.git
cd Sistema_gestion

# Instalar dependencias
npm install

# Ejecutar en desarrollo (http://localhost:3000)
npm run dev

# Construir versión de producción (genera carpeta dist/)
npm run build

# Previsualizar build estática
npm run preview
```

## Compartir en otra red (sin acceso a GitHub)

Puedes usar cualquiera de estos métodos según restricciones de la red destino:

### 1. Paquete ZIP (rápido)
1. En tu máquina origen elimina la carpeta `node_modules` para reducir tamaño (se recreará luego).
2. Comprime todo excepto archivos temporales: 
   ```powershell
   Compress-Archive -Path * -DestinationPath SistemaGestion.zip -Force -CompressionLevel Optimal
   ```
3. Copia `SistemaGestion.zip` (USB / transferencia segura) a la otra red.
4. En destino: extraer y dentro de la carpeta ejecutar `npm install` y `npm run dev`.

### 2. Bundle Git (con historial completo)
Permite recrear el repo con commits.
```powershell
git clone https://github.com/Rodrigov1984/Sistema_gestion.git
cd Sistema_gestion
git bundle create sistema_gestion.bundle --all
```
Transfiere `sistema_gestion.bundle` a la otra red y allí:
```powershell
git clone sistema_gestion.bundle Sistema_gestion
cd Sistema_gestion
npm install
```

### 3. Mirror (para mantener todas las refs exactamente)
```powershell
git clone --mirror https://github.com/Rodrigov1984/Sistema_gestion.git sistema_gestion_mirror
```
Transfiere la carpeta y en destino crea un nuevo remote interno:
```powershell
cd sistema_gestion_mirror
git remote set-url --push origin <URL_INTERNA_GIT>
git push --mirror origin
```

### 4. Paquete de dependencias offline
Genera un archivo `.tgz` con el proyecto y caché de dependencias para instalar sin internet:
```powershell
npm pack   # crea sistema-gestion-beneficios-0.1.0.tgz
```
En la red destino:
```powershell
npm install sistema-gestion-beneficios-0.1.0.tgz
```
Si necesitas node_modules completo pre-construido, también puedes comprimirlo, pero aumenta mucho el tamaño.

### 5. Servir sólo el build (entorno de consumo)
En origen:
```powershell
npm run build
Compress-Archive -Path dist -DestinationPath dist.zip -Force
```
En destino descomprime y sirve con cualquier servidor estático (ejemplos):
```powershell
# Opción rápida con Node (requiere instalar 'serve')
npm install -g serve
serve dist
```
O ubica el contenido de `dist` detrás de Nginx/Apache.

## Estructura de datos y sincronización

- Los empleados y estados de retiro se guardan en `localStorage` del navegador.
- Cada usuario/PC mantiene su copia independiente (no se sincroniza automáticamente).
- Para compartir la nómina actual entre equipos:
  1. Exporta (o copia) el archivo fuente original que cargaste (CSV / XLSX).
  2. En la otra máquina, usa la función de Cargar Nómina para regenerar los mismos datos.
  3. Si quieres replicar el estado de retiros, puedes hacer una exportación manual (futuro: implementar botón de exportación JSON).

## Mejoras sugeridas futuras

- Backend centralizado (API REST) para estados y autenticación.
- Exportación/importación JSON del estado (pendiente).
- Carga de foto real del empleado (actualmente placeholder).

## Seguridad básica

- Credenciales demo están presentes sólo para fines de demostración; evita usarlas en producción.
- No se implementa autenticación robusta ni cifrado de datos locales.

## Preguntas frecuentes

| Pregunta | Respuesta |
|----------|-----------|
| ¿Por qué no se comparte automáticamente entre PCs? | Porque sólo usa `localStorage` sin servidor. |
| ¿Necesito Internet para usarlo? | No, salvo para instalar dependencias la primera vez. |
| ¿Puedo subirlo a un servidor interno? | Sí: genera `dist` y sirve con cualquier servidor estático. |
| ¿Cómo mantengo historial de cambios? | Usa Git bundle o mirror para redes aisladas. |

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Desarrollo con HMR en puerto 3000 |
| `npm run build` | Compila TypeScript y genera `dist/` |
| `npm run preview` | Previsualiza `dist/` localmente |

---
Si necesitas otro formato de empaquetado (por ejemplo Docker), puedes añadir un `Dockerfile` sencillo en el futuro.

# Carga de Nómina

Formatos soportados:
- .xlsx
- .xls
- .csv

Columnas esperadas (los nombres son flexibles y no sensibles a mayúsculas; se aceptan estos alias):
- Nombre: "Nombre", "Nombre Completo", "nombre"
- RUT: "RUT", "Rut", "rut"
- TipoContrato: "TipoContrato", "Tipo de Contrato", "contrato"
- Rol: "Rol", "Rol/Departamento", "Departamento", "Departamento/Rol", "rol"
- Localidad: "Localidad", "Sede", "Planta", "Ubicacion"
- Beneficio: "Beneficio", "Beneficio Asignado", "beneficio"
- Estado: "Estado", "Estado Beneficio", "estado" (valores: "Pendiente" o "Retirado")
- FechaRetiro: "FechaRetiro", "Fecha Retiro", "Fecha de Retiro"

Normalización automática:
- Tipo de contrato: cualquier valor que contenga "plazo" se mapea a "Plazo Fijo"; si no, "Planta".
- Rol: se detecta por palabras clave ("guard" → "Guardia", "oficin" → "Oficina", "superv" → "Supervisión", "admin" → "Administración"; resto → "Personal de Base").
- Estado: si inicia con "ret" → "Retirado"; si no → "Pendiente".

Ejemplo CSV mínimo:
```csv
Nombre,RUT,TipoContrato,Rol,Localidad,Beneficio,Estado,FechaRetiro
María Fernanda González,16.234.567-8,Planta,Personal de Base,Valparaíso,Caja Navidad 2024,Pendiente,
Carlos Alberto Muñoz,18.345.678-9,Plazo Fijo,Guardia,Casablanca,Caja Navidad 2024,Retirado,15/12/2024
```

Cómo cargar:
1. Ir a Panel de Administrador → Empleados → “Cargar Nómina”.
2. Seleccionar un archivo en los formatos soportados.
3. Ver la vista previa y la tabla actualizada con los registros cargados.
