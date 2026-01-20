import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Users, 
  Package, 
  CheckCircle, 
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Settings
} from 'lucide-react';
import ThemeEditor from './ThemeEditor';
import ThemeLogo from './ThemeLogo';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
// Dialog modal originally used Radix primitives; replaced by a simple controlled modal
// to ensure it opens reliably across environments.
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  onBack: () => void;
}

interface Empleado {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  tipoContrato: 'Planta' | 'Plazo Fijo';
  rol: 'Guardia' | 'Personal de Base' | 'Oficina' | 'Supervisión' | 'Administración';
  localidad: string;
  planta: string;
  beneficio: string;
  estado: 'Pendiente' | 'Retirado';
  fechaRetiro?: string;
}

interface Guardia {
  id: number;
  nombre: string;
  rut: string;
  usuario: string;
  password: string;
  activo: boolean;
  fechaCreacion: string;
}

// Mock data
const empleadosIniciales: Empleado[] = [
  {
    id: 1,
    nombre: 'María Fernanda González',
    rut: '16.234.567-8',
    correo: 'maria.gonzalez@empresa.cl',
    tipoContrato: 'Planta',
    rol: 'Personal de Base',
    localidad: 'Valparaíso',
    planta: '',
    beneficio: 'Caja Navidad 2024',
    estado: 'Pendiente',
  },
  {
    id: 2,
    nombre: 'Carlos Alberto Muñoz',
    rut: '18.345.678-9',
    correo: 'carlos.munoz@empresa.cl',
    tipoContrato: 'Plazo Fijo',
    rol: 'Guardia',
    localidad: 'Casablanca',
    planta: '',
    beneficio: 'Caja Navidad 2024',
    estado: 'Retirado',
    fechaRetiro: '15/12/2024',
  },
  {
    id: 3,
    nombre: 'Ana María Silva',
    rut: '17.456.789-0',
    correo: 'ana.silva@empresa.cl',
    tipoContrato: 'Planta',
    rol: 'Oficina',
    localidad: 'Valparaíso',
    planta: '',
    beneficio: 'Caja Navidad 2024',
    estado: 'Pendiente',
  },
  {
    id: 4,
    nombre: 'Roberto Díaz',
    rut: '15.567.890-1',
    correo: 'roberto.diaz@empresa.cl',
    tipoContrato: 'Plazo Fijo',
    rol: 'Guardia',
    localidad: 'Valparaíso',
    planta: '',
    beneficio: 'Caja Navidad 2024',
    estado: 'Retirado',
    fechaRetiro: '14/12/2024',
  },
  {
    id: 5,
    nombre: 'Patricia Rojas',
    rut: '19.678.901-2',
    correo: 'patricia.rojas@empresa.cl',
    tipoContrato: 'Planta',
    rol: 'Supervisión',
    localidad: 'Casablanca',
    planta: '',
    beneficio: 'Caja Navidad 2024',
    estado: 'Pendiente',
  },
];

// Mock data inicial de guardias
const guardiasIniciales: Guardia[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    rut: '15123456-7',
    usuario: '15123456-7',
    password: '15123456',
    activo: true,
    fechaCreacion: '10/12/2024',
  },
  {
    id: 2,
    nombre: 'Pedro González',
    rut: '16234567-8',
    usuario: '16234567-8',
    password: '16234567',
    activo: true,
    fechaCreacion: '11/12/2024',
  },
];

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { theme } = useTheme();
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosIniciales);
  const [filtroLocalidad, setFiltroLocalidad] = useState<string>('all');
  const [filtroContrato, setFiltroContrato] = useState<string>('all');
  const [filtroPlanta, setFiltroPlanta] = useState<string>('all');
  const [filtroEstado, setFiltroEstado] = useState<string>('all');
  const [filtroRol, setFiltroRol] = useState<string>('all');
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'empleados' | 'reportes'>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Debug overlay: capture global errors and unhandled rejections to display on screen
  const [debugError, setDebugError] = useState<any>(null);
  useEffect(() => {
    const onError = (ev: ErrorEvent) => {
      try { setDebugError({ message: ev.message, stack: ev.error?.stack || ev.filename + ':' + ev.lineno }); } catch { setDebugError({ message: ev.message }); }
    };
    const onRejection = (ev: any) => {
      try { setDebugError({ message: ev.reason?.message || String(ev.reason), stack: ev.reason?.stack }); } catch { setDebugError({ message: String(ev) }); }
    };
    window.addEventListener('error', onError as any);
    window.addEventListener('unhandledrejection', onRejection as any);
    return () => {
      window.removeEventListener('error', onError as any);
      window.removeEventListener('unhandledrejection', onRejection as any);
    };
  }, []);
  const [guardias, setGuardias] = useState<Guardia[]>(guardiasIniciales);
  const [mostrarFormGuardia, setMostrarFormGuardia] = useState(false);
  const [nuevoGuardia, setNuevoGuardia] = useState({
    nombre: '',
    rut: '',
  });

  // Estado para edición de contraseña
  const [editPassId, setEditPassId] = useState<number | null>(null);
  const [editPassValue, setEditPassValue] = useState('');
  // Resumen última carga de nómina
  const [ultimaCarga, setUltimaCarga] = useState<{ total: number; preview: Empleado[] } | null>(null);
  // Collapsible sections state (start collapsed)
  const [expandedGuardias, setExpandedGuardias] = useState(false);
  const [expandedNomina, setExpandedNomina] = useState(false);
  const [expandedTabla, setExpandedTabla] = useState(false);
  const [expandedReportes, setExpandedReportes] = useState(false);
  // Incidencias (cargadas desde localStorage)
  const [incidencias, setIncidencias] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('incidencias') || '[]');
      if (Array.isArray(stored)) setIncidencias(stored.reverse());
    } catch {
      setIncidencias([]);
    }
  }, []);

  const reloadIncidencias = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('incidencias') || '[]');
      if (Array.isArray(stored)) setIncidencias(stored.reverse());
      else setIncidencias([]);
    } catch {
      setIncidencias([]);
    }
  };

  const handleEliminarIncidencia = (id: string) => {
    if (!confirm('¿Confirma eliminar esta incidencia?')) return;
    try {
      const stored = JSON.parse(localStorage.getItem('incidencias') || '[]');
      const filtered = (stored || []).filter((i: any) => i.id !== id);
      localStorage.setItem('incidencias', JSON.stringify(filtered));
      reloadIncidencias();
      alert('Incidencia eliminada.');
    } catch (e) {
      console.error('Error eliminando incidencia', e);
      alert('No fue posible eliminar la incidencia.');
    }
  };

  const handleExportarIncidencias = async () => {
    try {
      const rows = incidencias.slice().reverse().map((inc: any) => ({
        Fecha: inc.fecha,
        Empleado: inc.empleadoNombre,
        RUT: inc.empleadoRut,
        Guardia: inc.guardiaUsuario || '',
        Tipo: inc.tipo,
        Descripcion: inc.descripcion,
        Adjuntos: (inc.adjuntos || []).length
      }));

      // Intentar usar xlsx desde CDN como en otras partes del app
      // @ts-ignore
      const XLSXMod = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/xlsx@0.20.2/+esm');
      // @ts-ignore
      const XLSX = (XLSXMod as any).default ?? XLSXMod;
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Incidencias');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incidencias_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
    } catch (err) {
      console.error('Export error', err);
      // Fallback a CSV
      const csv = [
        ['Fecha','Empleado','RUT','Guardia','Tipo','Descripcion','Adjuntos'].join(','),
        ...incidencias.slice().reverse().map((inc:any) => [inc.fecha, inc.empleadoNombre, inc.empleadoRut, inc.guardiaUsuario||'', inc.tipo, `"${(inc.descripcion||'').replace(/"/g,'""')}"`, (inc.adjuntos||[]).length].join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incidencias_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  // Al montar: cargar empleados desde localStorage o inicializar
  useEffect(() => {
    const stored = localStorage.getItem('empleados');
    if (stored) {
      try {
        const parsed: Empleado[] = JSON.parse(stored);
        // Migración: agregar campo correo si no existe y normalizar localidad
        const empleadosMigrados = parsed.map(emp => ({
          ...emp,
          correo: emp.correo || '', // Asegurar que todos tengan el campo correo
          localidad: normalizeLocalidad(emp.localidad),
          planta: emp.planta || ''
        }));
        setEmpleados(empleadosMigrados);
        // Actualizar localStorage con la migración
        localStorage.setItem('empleados', JSON.stringify(empleadosMigrados));
      } catch {
        localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
        setEmpleados(empleadosIniciales);
      }
    } else {
      localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
    }
  }, []);

  // Guardar empleados en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem('empleados', JSON.stringify(empleados));
    } catch {
      // noop
    }
  }, [empleados]);

  // Recargar empleados desde localStorage cuando otra vista actualice la nómina
  useEffect(() => {
    const reloadFromStorage = () => {
      try {
        const parsed: Empleado[] = JSON.parse(localStorage.getItem('empleados') || '[]');
        if (Array.isArray(parsed)) setEmpleados(parsed);
      } catch {
        /* noop */
      }
    };
    const onUpdated = () => reloadFromStorage();
    const onFocus = () => reloadFromStorage();

    window.addEventListener('empleados:updated', onUpdated as EventListener);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('empleados:updated', onUpdated as EventListener);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Al montar: cargar guardias desde localStorage o inicializar
  useEffect(() => {
    const stored = localStorage.getItem('guardias');
    if (stored) {
      try {
        const parsed: Guardia[] = JSON.parse(stored);
        setGuardias(parsed);
      } catch {
        localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));
        setGuardias(guardiasIniciales);
      }
    } else {
      localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));
      setGuardias(guardiasIniciales);
    }
  }, []);

  // Utils de mapeo/normalización desde Excel
  const normalize = (v: any) => {
    // Eliminar BOM y caracteres invisibles, normalizar espacios y pasar a minúsculas
    return String(v ?? '')
      .replace(/\uFEFF/g, '')
      .replace(/[\u200B\u200C\u200D\u2060]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  };

  const mapTipoContrato = (v: any): Empleado['tipoContrato'] => {
    const t = normalize(v);
    // Detectar 'plazo' o 'fijo' para mapear a Plazo Fijo. Si no, Planta.
    if (t.includes('plazo') || t.includes('fijo')) return 'Plazo Fijo';
    return 'Planta';
  };
  const mapRol = (v: any): Empleado['rol'] => {
    const t = normalize(v);
    if (t.includes('guard')) return 'Guardia';
    if (t.includes('oficin')) return 'Oficina';
    if (t.includes('superv')) return 'Supervisión';
    if (t.includes('admin')) return 'Administración';
    return 'Personal de Base';
  };
  const mapEstado = (v: any): Empleado['estado'] => {
    const t = normalize(v);
    if (t.startsWith('ret')) return 'Retirado';
    return 'Pendiente';
  };

  const normalizePlanta = (v: any) => {
    return String(v ?? '').replace(/\uFEFF/g, '').replace(/[\u200B\u200C\u200D\u2060]/g, '').trim();
  };

  // Normalizar valores de localidad para unificar plantas
  const normalizeLocalidad = (v: any) => {
    const raw = String(v ?? '').trim();
    const lower = raw.toLowerCase();

    if (!raw) return '';
    // Casablanca
    if (/casablanca/i.test(lower)) return 'Casablanca';

    // Valparaíso - Planta BIF
    if (/\b(bif|planta\s*bif|valpara.*bif)\b/i.test(lower)) return 'Valparaíso - Planta BIF';

    // Valparaíso - Planta BIC
    if (/\b(bic|planta\s*bic|valpara.*bic)\b/i.test(lower)) return 'Valparaíso - Planta BIC';

    // Valparaíso (otros)
    if (/valpara/i.test(lower)) return 'Valparaíso';

    // Por defecto devolver texto original (trimmed)
    return raw;
  };

  // Calcular estadísticas
  const totalEmpleados = empleados.length;
  const beneficiosEntregados = empleados.filter(e => e.estado === 'Retirado').length;
  const beneficiosPendientes = empleados.filter(e => e.estado === 'Pendiente').length;
  const empleadosPlanta = empleados.filter(e => e.tipoContrato === 'Planta').length;
  const empleadosPlazoFijo = empleados.filter(e => e.tipoContrato === 'Plazo Fijo').length;

  // Calcular estadísticas por rol
  const empleadosPorRol = {
    guardia: empleados.filter(e => e.rol === 'Guardia').length,
    personalBase: empleados.filter(e => e.rol === 'Personal de Base').length,
    oficina: empleados.filter(e => e.rol === 'Oficina').length,
    supervision: empleados.filter(e => e.rol === 'Supervisión').length,
    administracion: empleados.filter(e => e.rol === 'Administración').length,
  };

  // Datos para gráficos
  // Conteo por planta: Casablanca, Valparaíso Planta BIF, Valparaíso Planta BIC
  // Conteo por planta: considerar primero el campo `planta` (si existe), si no usar `localidad`
  const countCasablanca = empleados.filter(e => {
    const loc = String(e.planta || e.localidad || '').toLowerCase();
    return /casablanca/i.test(loc);
  }).length;

  const countValparaisoBIF = empleados.filter(e => {
    const loc = String(e.planta || e.localidad || '').toLowerCase();
    return /bif/i.test(loc) || /planta\s*bif/i.test(loc) || /valpara.*bif/i.test(loc);
  }).length;

  const countValparaisoBIC = empleados.filter(e => {
    const loc = String(e.planta || e.localidad || '').toLowerCase();
    return /bic/i.test(loc) || /planta\s*bic/i.test(loc) || /valpara.*bic/i.test(loc);
  }).length;

  // Construir dinámicamente las localidades a partir de la nómina cargada.
  // Contar por `localidad` (normalizada) para mostrar cuántos empleados hay por localidad.
  const countsByLoc: Record<string, number> = {};
  empleados.forEach((e) => {
    const rawLocalidad = String(e.localidad || '').trim();
    const normalized = normalizeLocalidad(rawLocalidad) || rawLocalidad || 'Sin localidad';
    const key = String(normalized).trim();
    if (!key) return;
    countsByLoc[key] = (countsByLoc[key] || 0) + 1;
  });

  const dataLocalidad = Object.entries(countsByLoc)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Opciones dinámicas para el filtro de Localidad (producidas desde la nómina)
  const localidadOptions = dataLocalidad.map(d => {
    const name = d.name || '';
    const lower = name.toLowerCase();
    if (/casablanca/i.test(name)) return { label: name, value: 'casablanca' };
    if (/bif/i.test(lower)) return { label: name, value: 'valparaiso-bif' };
    if (/bic/i.test(lower)) return { label: name, value: 'valparaiso-bic' };
    if (/valpara/i.test(lower)) return { label: name, value: 'valparaiso' };
    return { label: name, value: name };
  });

  // Opciones dinámicas para el filtro Planta (a partir del campo `planta` en la nómina)
  const plantaCounts: Record<string, number> = {};
  empleados.forEach(e => {
    const p = normalizePlanta(e.planta || '') || '';
    const key = String(p).trim();
    if (!key) return;
    plantaCounts[key] = (plantaCounts[key] || 0) + 1;
  });

  const plantaOptions = Object.entries(plantaCounts)
    .map(([name, count]) => ({ label: name, value: name.toLowerCase(), count }))
    .sort((a, b) => b.count - a.count);

  // Opciones dinámicas de Beneficios (desde la nómina cargada)
  const beneficiosOptions = Array.from(new Set(
    empleados
      .map(e => String(e.beneficio || '').trim())
      .filter(b => !!b)
  ))
    .map(label => ({ label, value: label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Etiquetas de Planta para selector (si no hay en nómina, usar valores por defecto)
  const defaultPlantas = [
    'Casablanca',
    'Valparaíso - Planta BIF',
    'Valparaíso - Planta BIC',
  ];
  const plantasSelectLabels = (plantaOptions && plantaOptions.length > 0)
    ? plantaOptions.map(p => p.label)
    : defaultPlantas;

  // States for the report generator (independent of the main filters)
  const [reportFiltroLocalidad, setReportFiltroLocalidad] = useState<string>('all');
  const [reportFiltroPlanta, setReportFiltroPlanta] = useState<string>('all');
  const [reportFiltroContrato, setReportFiltroContrato] = useState<string>('all');
  const [reportFiltroRol, setReportFiltroRol] = useState<string>('all');
  const [reportFiltroEstado, setReportFiltroEstado] = useState<string>('all');
  const [reportSearch, setReportSearch] = useState<string>('');
  // Estado para mostrar/ocultar el visualizador de coincidencias
  const [reportViewerOpen, setReportViewerOpen] = useState<boolean>(false);

  // Helper para comparar localidades (declarado antes del uso en applyReportFilters)
  const matchesLocalidad = (empLoc: string, filtro: string) => {
    const loc = String(empLoc || '').toLowerCase();
    if (filtro === 'all') return true;
    if (filtro === 'casablanca') return /casablanca/i.test(loc);
    if (filtro === 'valparaiso-bif') return /bif/i.test(loc) || /planta\s*bif/i.test(loc) || /valpara.*bif/i.test(loc);
    if (filtro === 'valparaiso-bic') return /bic/i.test(loc) || /planta\s*bic/i.test(loc) || /valpara.*bic/i.test(loc);
    if (filtro === 'valparaiso') return /valpara/i.test(loc);
    return loc === filtro.toLowerCase();
  };

  const applyReportFilters = (list: Empleado[]) => {
    return list.filter(emp => {
      // localidad
      if (reportFiltroLocalidad !== 'all') {
        if (!matchesLocalidad(emp.localidad, reportFiltroLocalidad)) return false;
      }
      // planta
      if (reportFiltroPlanta !== 'all') {
        const empP = normalizePlanta(emp.planta || '').toLowerCase();
        if (!empP || empP !== reportFiltroPlanta.toLowerCase()) return false;
      }
      // contrato
      if (reportFiltroContrato !== 'all' && emp.tipoContrato !== reportFiltroContrato) return false;
      // rol
      if (reportFiltroRol !== 'all' && emp.rol !== reportFiltroRol) return false;
      // estado
      if (reportFiltroEstado !== 'all' && emp.estado !== reportFiltroEstado) return false;
      // search
      const q = reportSearch.trim().toLowerCase();
      if (q) {
        const nombre = String(emp.nombre || '').toLowerCase();
        const rutNormalized = String(emp.rut || '').replace(/[.\-\s]/g, '').toLowerCase();
        const qRut = q.replace(/[.\-\s]/g, '').toLowerCase();
        if (!nombre.includes(q) && !rutNormalized.includes(qRut) && !String(emp.rut || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  };

  // Lista filtrada para el generador de reportes y contador de coincidencias
  let reportEmpleadosFiltrados: Empleado[] = [];
  let reportFiltradoError: any = null;
  try {
    reportEmpleadosFiltrados = applyReportFilters(empleados);
  } catch (err) {
    console.error('Error aplicando filtros de reporte:', err);
    reportEmpleadosFiltrados = [];
    reportFiltradoError = err;
  }
  const reportMatchesCount = reportEmpleadosFiltrados.length;

  const handleGenerarReporte = () => {
    const rows = applyReportFilters(empleados).map((e: Empleado) => ({
      Nombre: e.nombre,
      RUT: e.rut,
      Correo: e.correo || '',
      'Tipo Contrato': e.tipoContrato,
      'Rol/Departamento': e.rol,
      Localidad: e.localidad,
      Planta: e.planta || '',
      Beneficio: e.beneficio,
      Estado: e.estado,
      'Fecha Retiro': e.fechaRetiro || '-',
    }));

    if (rows.length === 0) {
      alert('No hay registros que coincidan con los filtros seleccionados.');
      return;
    }

    const csvHeader = Object.keys(rows[0]).join(',');
    const csv = [csvHeader, ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_personalizado_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const dataEstado = [
    { name: 'Retirados', value: beneficiosEntregados },
    { name: 'Pendientes', value: beneficiosPendientes },
  ];

  const dataRol = [
    { name: 'Personal de Base', value: empleadosPorRol.personalBase },
    { name: 'Oficina', value: empleadosPorRol.oficina },
    { name: 'Guardia', value: empleadosPorRol.guardia },
    { name: 'Supervisión', value: empleadosPorRol.supervision },
    { name: 'Administración', value: empleadosPorRol.administracion },
  ].filter(item => item.value > 0);

  // Filtrar empleados
  let empleadosFiltrados: Empleado[] = [];
  let empleadosFiltradosError: any = null;
  try {
    empleadosFiltrados = empleados.filter(emp => {
      if (!matchesLocalidad(emp.localidad, filtroLocalidad)) return false;
      // Filtrar por planta si se especificó
      if (filtroPlanta !== 'all') {
        const empP = normalizePlanta(emp.planta || '').toLowerCase();
        if (!empP || empP !== filtroPlanta.toLowerCase()) return false;
      }
      if (filtroContrato !== 'all' && emp.tipoContrato !== filtroContrato) return false;
      if (filtroEstado !== 'all' && emp.estado !== filtroEstado) return false;
      if (filtroRol !== 'all' && emp.rol !== filtroRol) return false;
      // búsqueda por nombre o RUT
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const nombre = String(emp.nombre || '').toLowerCase();
        const rutNormalized = String(emp.rut || '').replace(/[.\-\s]/g, '').toLowerCase();
        const qRut = q.replace(/[.\-\s]/g, '').toLowerCase();
        if (!nombre.includes(q) && !rutNormalized.includes(qRut) && !String(emp.rut || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  } catch (err) {
    console.error('Error filtrando empleados:', err);
    empleadosFiltrados = [];
    empleadosFiltradosError = err;
  }

  const handleCargarNomina = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const ext = getExt(file.name);

        let rows: any[] = [];

        if (ext === 'csv') {
          // CSV: sin dependencias, offline
          const text = await file.text();
          rows = parseCSV(text);
        } else if (ext === 'xlsx' || ext === 'xls') {
          // XLSX/XLS: preferir la librería local (si está instalada) y caer al CDN si no
          let XLSX: any = null;
          try {
            const XLSXLocal = await import('xlsx');
            XLSX = (XLSXLocal as any).default ?? XLSXLocal;
          } catch (localErr) {
            try {
              // Fallback al CDN (requiere internet)
              // @ts-ignore
              const XLSXMod = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/xlsx@0.20.2/+esm');
              XLSX = (XLSXMod as any).default ?? XLSXMod;
            } catch (cdnErr) {
              throw new Error('No se pudo cargar la librería XLSX local ni desde CDN. Verifica conexión o instala la dependencia.');
            }
          }

          const data = await file.arrayBuffer();
          const wb = XLSX.read(data, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        } else {
          alert('Formato no soportado. Usa .xlsx, .xls o .csv');
          return;
        }

        // Mapear filas a Empleado (columnas flexibles)
        const startId = Math.max(0, ...empleados.map((e) => e.id));
        const parsed: Empleado[] = rows.map((r, idx) => {
          const nombre = r.Nombre ?? r['Nombre Completo'] ?? r.nombre ?? getValue(r, ['nombre', 'nombre completo']) ?? '';
          const rut = (r.RUT ?? r.Rut ?? r.rut ?? getValue(r, ['rut', 'rut trabajador']) ?? '').toString();
          const correo = r.Correo ?? r.Email ?? r['E-mail'] ?? r.email ?? getValue(r, ['correo', 'email', 'e-mail', 'mail']) ?? '';
          const tipoRaw = r.TipoContrato ?? r['Tipo de Contrato'] ?? r['Tipo Contrato'] ?? r.TipoContrato ?? r.contrato ?? getValue(r, ['tipo contrato','tipo de contrato','tipocontrato','tipo_contrato','tipo', 'contrato']);
          const tipoContrato = mapTipoContrato(tipoRaw);
          const rol = mapRol(r.Rol ?? r['Rol/Departamento'] ?? r.Departamento ?? r['Departamento/Rol'] ?? r.rol ?? getValue(r, ['rol', 'rol/departamento', 'departamento', 'departamento/rol']));
          const localidadRaw = r.Localidad ?? r.Sede ?? r.Ubicacion ?? getValue(r, ['localidad', 'sede', 'ubicacion']) ?? '';
          const localidad = normalizeLocalidad(localidadRaw);
          // Extraer planta con tolerancia a distintos encabezados: 'Planta', 'Sucursal', 'Planta/Sucursal', 'Sede', etc.
          const plantaRaw = r.Planta ?? r.Sucursal ?? r['Planta/Sucursal'] ?? r.Sede ?? r['Sede'] ?? getValue(r, ['planta', 'sucursal', 'planta/sucursal', 'sede', 'ubicacion']) ?? '';
          const planta = normalizePlanta(plantaRaw);
          const beneficio = r.Beneficio ?? r['Beneficio Asignado'] ?? r.beneficio ?? getValue(r, ['beneficio', 'beneficio asignado']) ?? '';
          const estado = mapEstado(r.Estado ?? r['Estado Beneficio'] ?? r.estado ?? getValue(r, ['estado', 'estado beneficio']));
          const fechaRetiroRaw = r.FechaRetiro ?? r['Fecha Retiro'] ?? r['Fecha de Retiro'] ?? getValue(r, ['fecharetiro', 'fecha retiro', 'fecha de retiro']) ?? '';
          const fechaRetiro = fechaRetiroRaw ? String(fechaRetiroRaw) : undefined;

          return {
            id: startId + idx + 1,
            nombre,
            rut,
            correo,
            tipoContrato,
            rol,
            localidad,
            beneficio,
            estado,
            fechaRetiro,
            planta,
          };
        }).filter(p => p.nombre && p.rut);

        if (parsed.length === 0) {
          alert('Archivo leído, pero no se encontraron filas válidas. Revisa los encabezados.');
          return;
        }

        setEmpleados((prev: Empleado[]) => [...prev, ...parsed]);
        setUltimaCarga({ total: parsed.length, preview: parsed.slice(0, 5) });
      } catch (err) {
        console.error('Error al procesar nómina:', err);
        const msg = err && (err as any).message ? (err as any).message : String(err);
        alert('No fue posible leer el archivo. Si subes .xlsx/.xls asegúrate de tener internet; como alternativa usa .csv.\n\nDetalles: ' + msg);
      } finally {
        try {
          // Usar la referencia local al input en vez de e.target, porque
          // en algunos navegadores el Event.target puede ser null
          // después de operaciones asíncronas.
          input.value = '';
        } catch (err) {
          // noop: si no se puede limpiar, no bloqueamos la app
        }
      }
    };
    input.click();
  };

  const handleExportarReporte = () => {
    const csvContent = [
      ['Nombre', 'RUT', 'Correo', 'Tipo Contrato', 'Rol/Departamento', 'Localidad', 'Planta', 'Localidad Normalizada', 'Beneficio', 'Estado', 'Fecha Retiro'].join(','),
      ...empleadosFiltrados.map((e: Empleado) => {
        const localidadNorm = normalizeLocalidad(e.localidad);
        return [e.nombre, e.rut, e.correo || '', e.tipoContrato, e.rol, e.localidad, e.planta || '', localidadNorm, e.beneficio, e.estado, e.fechaRetiro || '-'].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_beneficios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleLimpiarNomina = () => {
    const ok = confirm(
      '¿Deseas limpiar la nómina?\n\nEsto borrará todos los empleados cargados y reiniciará la tabla. Podrás volver a cargar una nómina luego.'
    );
    if (!ok) return;

    try {
      // Dejar nómina vacía para un reset real
      localStorage.setItem('empleados', JSON.stringify([]));
    } catch {
      /* noop */
    }

    setEmpleados([]);
    setUltimaCarga(null);

    // Notificar a otras vistas (Guardia) que la nómina cambió
    try {
      window.dispatchEvent(new CustomEvent('empleados:updated'));
    } catch {}

    alert('Nómina limpiada.');
  };

  const handleEliminar = (id: number) => {
    if (confirm('¿Está seguro de eliminar este empleado?')) {
      setEmpleados(empleados.filter((e: Empleado) => e.id !== id));
    }
  };

  const handleAgregarGuardia = () => {
    if (!nuevoGuardia.nombre || !nuevoGuardia.rut) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Normalizar RUT de entrada y generar usuario/contraseña robustamente
    const raw = String(nuevoGuardia.rut || '').trim();
    // Quitar espacios y puntos, mantener el guión si el admin lo ingresó
    const cleaned = raw.replace(/\s+/g, '').replace(/\./g, '');
    // Digitos del RUT (sin guión ni DV separado)
    const digitsOnly = cleaned.replace(/-/g, '');
    // Password por defecto: todos los dígitos excepto el último (si hay al menos 2 dígitos),
    // de lo contrario usar los dígitos completos
    const password = digitsOnly.length >= 2 ? digitsOnly.slice(0, -1) : digitsOnly;
    // Usuario: preferir mantener el formato ingresado (con o sin guión), pero guardamos cleaned
    const usuario = cleaned;

    const guardia: Guardia = {
      id: guardias.length + 1,
      nombre: String(nuevoGuardia.nombre || '').trim(),
      rut: cleaned,
      usuario,
      password,
      activo: true,
      fechaCreacion: new Date().toLocaleDateString('es-CL'),
    };

    setGuardias([...guardias, guardia]);
    
    // Guardar en localStorage para persistencia
    const guardiasActualizados = [...guardias, guardia];
    localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
    
    alert(`Guardia agregado exitosamente!\n\nUsuario: ${guardia.usuario}\nContraseña: ${guardia.password}`);
    setNuevoGuardia({ nombre: '', rut: '' });
    setMostrarFormGuardia(false);
  };

  const handleToggleGuardia = (id: number) => {
    const guardiasActualizados = guardias.map((g: Guardia) =>
      g.id === id ? { ...g, activo: !g.activo } : g
    );
    setGuardias(guardiasActualizados);
    localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
  };

  const handleEliminarGuardia = (id: number) => {
    if (confirm('¿Está seguro de eliminar este guardia?')) {
      const guardiasActualizados = guardias.filter((g: Guardia) => g.id !== id);
      setGuardias(guardiasActualizados);
      localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
    }
  };

  // Iniciar edición de contraseña
  const startEditarPassword = (g: Guardia) => {
    setEditPassId(g.id);
    setEditPassValue(g.password);
  };

  // Cancelar edición de contraseña
  const cancelarEditarPassword = () => {
    setEditPassId(null);
    setEditPassValue('');
  };

  // Guardar nueva contraseña
  const guardarNuevaPassword = () => {
    if (editPassId === null) return;
    const nueva = editPassValue.trim();
    if (nueva.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    const guardiasActualizados = guardias.map((g: Guardia) =>
      g.id === editPassId ? { ...g, password: nueva } : g
    );
    setGuardias(guardiasActualizados);
    localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
    setEditPassId(null);
    setEditPassValue('');
    alert('Contraseña actualizada correctamente.');
  };

  // Notificar beneficios pendientes por correo
  const [openNotificar, setOpenNotificar] = useState(false);
  // Target selection: enviar a todos o a los primeros N pendientes
  const [notificarTarget, setNotificarTarget] = useState<'first' | 'all'>('first');
  const [notificarFirstCount, setNotificarFirstCount] = useState<number>(30);
  const [notificarSending, setNotificarSending] = useState(false);
  const [notificarProgress, setNotificarProgress] = useState({ sent: 0, total: 0, batches: 0, currentBatch: 0 });

  const chunkArray = (arr: any[], size: number) => {
    const out: any[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const enviarNotificacionesParceladas = async (batchSize: number) => {
    const empleadosPendientes = empleados.filter((e: Empleado) => e.estado === 'Pendiente');
    if (empleadosPendientes.length === 0) {
      alert('No hay empleados con beneficios pendientes para notificar.');
      return;
    }

    const empleadosConCorreo = empleadosPendientes.filter((e: Empleado) => e.correo && e.correo.trim() !== '');
    const empleadosSinCorreo = empleadosPendientes.filter((e: Empleado) => !e.correo || e.correo.trim() === '');

    // Si el objetivo es 'first', limitar la lista a los primeros N pendientes con correo
    let destinatarios = empleadosConCorreo;
    if (notificarTarget === 'first') {
      destinatarios = empleadosConCorreo.slice(0, notificarFirstCount);
    }

    if (destinatarios.length === 0) {
      alert(`Se encontraron ${empleadosPendientes.length} empleados con beneficios pendientes, pero ninguno tiene correo registrado (o no hay destinatarios según la selección).`);
      return;
    }
    const confirmar = confirm(
      `Se enviarán notificaciones a ${destinatarios.length} empleados en lotes de ${batchSize}.
\n\n` +
      `✓ Destinatarios seleccionados: ${destinatarios.length}\n` +
      `✓ Con correo total (pendientes): ${empleadosConCorreo.length}\n` +
      `${empleadosSinCorreo.length > 0 ? `✗ Sin correo (pendientes): ${empleadosSinCorreo.length}\n` : ''}` +
      `\n¿Desea continuar?`
    );
    if (!confirmar) return;

    const batches = chunkArray(destinatarios, batchSize);
    setNotificarSending(true);
    setNotificarProgress({ sent: 0, total: destinatarios.length, batches: batches.length, currentBatch: 0 });

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      setNotificarProgress(prev => ({ ...prev, currentBatch: i + 1 }));

      // Simular envío asíncrono del lote (puedes reemplazar por llamada real a API)
      await new Promise<void>((resolve) => {
        console.log(`📧 Enviando lote ${i + 1}/${batches.length} (${batch.length} destinatarios)`);
        batch.forEach((emp: Empleado) => {
          console.log(`   Enviando a: ${emp.nombre} <${emp.correo}> — Beneficio: ${emp.beneficio} — Localidad: ${emp.localidad}`);
        });
        // Simular retardo corto
        setTimeout(() => {
          setNotificarProgress(prev => ({ ...prev, sent: prev.sent + batch.length }));
          resolve();
        }, 300);
      });
    }

    const totalSent = destinatarios.length;
    setNotificarSending(false);
    setOpenNotificar(false);

    let mensaje = `✓ Se han procesado ${totalSent} notificaciones en ${Math.ceil(totalSent / batchSize)} lote(s).\n\n`;
    mensaje += `• Total destinatarios con correo: ${totalSent}\n`;
    if (empleadosSinCorreo.length > 0) mensaje += `• Sin correo (no notificados): ${empleadosSinCorreo.length}\n`;
    alert(mensaje);
  };

  // Helpers CSV (sin dependencias)
  const getExt = (name?: string) => (name?.split('.').pop() || '').toLowerCase();
  const splitCSVLine = (line: string, delim: string) => {
    const out: string[] = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === delim && !inQuotes) {
        out.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(s => s.replace(/^\uFEFF/, '').trim());
  };
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [] as any[];
    const headerLine = lines[0];
    const delimiter = (headerLine.includes(';') && !headerLine.includes(',')) ? ';' : ',';
    const headers = splitCSVLine(headerLine, delimiter);
    return lines.slice(1).map(line => {
      const cells = splitCSVLine(line, delimiter);
      const row: Record<string, any> = {};
      headers.forEach((h, i) => { row[h] = cells[i] ?? ''; });
      return row;
    });
  };
  const getValue = (row: Record<string, any>, candidates: string[]) => {
    const keys = Object.keys(row);
    for (const cand of candidates) {
      const idx = keys.findIndex(k => k.toLowerCase() === cand.toLowerCase());
      if (idx !== -1) return row[keys[idx]];
    }
    return '';
  };

  // Modal: Agregar Empleado (estado y handlers)
  const [showAgregarEmpleado, setShowAgregarEmpleado] = useState(false);
  const [animateAgregarEmpleado, setAnimateAgregarEmpleado] = useState(false);
  const agregarBtnRef = useRef<HTMLButtonElement | null>(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState<Partial<Empleado>>({
    nombre: '',
    rut: '',
    correo: '',
    tipoContrato: 'Planta',
    rol: 'Personal de Base',
    localidad: '',
    planta: '',
    beneficio: '',
    estado: 'Pendiente',
  });

  const resetNuevoEmpleadoForm = () => {
    setNuevoEmpleado({
      nombre: '',
      rut: '',
      correo: '',
      tipoContrato: 'Planta',
      rol: 'Personal de Base',
      localidad: '',
      planta: '',
      beneficio: '',
      estado: 'Pendiente',
    });
  };

  // Estado para expandir el resumen detallado
  const [showResumenExpandido, setShowResumenExpandido] = useState(false);

  const submitNuevoEmpleado = () => {
    const nombre = String(nuevoEmpleado.nombre || '').trim();
    const rut = String(nuevoEmpleado.rut || '').trim();
    if (!nombre || !rut) {
      alert('Nombre y RUT son obligatorios');
      return;
    }

    const nextId = empleados.length > 0 ? Math.max(...empleados.map(e => e.id)) + 1 : 1;
    const empleadoNuevo: Empleado = {
      id: nextId,
      nombre,
      rut,
      correo: String(nuevoEmpleado.correo || ''),
      tipoContrato: (nuevoEmpleado.tipoContrato as Empleado['tipoContrato']) || 'Planta',
      rol: (nuevoEmpleado.rol as Empleado['rol']) || 'Personal de Base',
      localidad: String(nuevoEmpleado.localidad || ''),
      planta: String(nuevoEmpleado.planta || ''),
      beneficio: String(nuevoEmpleado.beneficio || ''),
      estado: (nuevoEmpleado.estado as Empleado['estado']) || 'Pendiente',
    };

    const updated = [...empleados, empleadoNuevo];
    setEmpleados(updated);
    try { localStorage.setItem('empleados', JSON.stringify(updated)); } catch {}

    try { window.dispatchEvent(new CustomEvent('empleados:updated')); } catch {}

    alert('Empleado agregado correctamente.');
    resetNuevoEmpleadoForm();
    setAnimateAgregarEmpleado(false);
    setTimeout(() => setShowAgregarEmpleado(false), 250);
  };

  const openAgregarEmpleado = () => {
    setShowAgregarEmpleado(true);
    setTimeout(() => setAnimateAgregarEmpleado(true), 10);
  };

  const closeAgregarEmpleado = () => {
    setAnimateAgregarEmpleado(false);
    setTimeout(() => {
      setShowAgregarEmpleado(false);
      resetNuevoEmpleadoForm();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-tmluc-split p-4">
      {debugError && (
        <div className="fixed inset-0 z-50 bg-red-900/80 text-white p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-2">Error en la aplicación</h2>
          <pre className="whitespace-pre-wrap text-sm">{String(debugError.message)}
{debugError.stack}</pre>
          <div className="mt-4">
            <button onClick={() => setDebugError(null)} className="px-3 py-2 bg-white text-red-900 rounded">Cerrar</button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-[#D32027] hover:bg-[#D32027]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <Button
              onClick={() => setVistaActual('dashboard')}
              variant={vistaActual === 'dashboard' ? 'default' : 'outline'}
              className={vistaActual === 'dashboard' ? 'bg-[#D32027] text-white' : ''}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setVistaActual('empleados')}
              variant={vistaActual === 'empleados' ? 'default' : 'outline'}
              className={vistaActual === 'empleados' ? 'bg-[#D32027] text-white' : ''}
            >
              Empleados
            </Button>
            <Button
              onClick={() => setVistaActual('reportes')}
              variant={vistaActual === 'reportes' ? 'default' : 'outline'}
              className={vistaActual === 'reportes' ? 'bg-[#D32027] text-white' : ''}
            >
              Reportes
            </Button>
          </div>
          
          {/* Botón de Personalización */}
          <Button
            onClick={() => setThemeEditorOpen(true)}
            variant="outline"
            className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
          >
            <Settings className="w-5 h-5 mr-2" />
            Personalizar
          </Button>
        </div>

        {/* Editor de Tema Modal */}
        <ThemeEditor
          isOpen={themeEditorOpen}
          onClose={() => setThemeEditorOpen(false)}
        />

        <div className="mb-8 flex items-center gap-4">
          {/* Logo personalizado */}
          <ThemeLogo className="h-14" />
          <div>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: theme.primaryColor, fontSize: theme.headingFontSize, fontFamily: theme.fontFamily }}
            >
              Panel de Administrador
            </h1>
            <p className="text-white" style={{ fontFamily: theme.fontFamily }}>
              Gestiona empleados, beneficios, guardias y genera reportes
            </p>
          </div>
        </div>

        {(typeof empleadosFiltradosError !== 'undefined' && empleadosFiltradosError) || (typeof reportFiltradoError !== 'undefined' && reportFiltradoError) ? (
          <Card className="p-4 bg-red-50 border border-red-200 text-red-800 mb-4">
            <div className="font-semibold">Error al aplicar filtros</div>
            <pre className="text-xs mt-2 whitespace-pre-wrap">{String(empleadosFiltradosError || reportFiltradoError)}</pre>
          </Card>
        ) : null}

        {/* Vista Dashboard */}
        {vistaActual === 'dashboard' && (
          <div className="space-y-6">
            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Empleados</p>
                    <p className="text-gray-900">{totalEmpleados}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#D32027]/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#D32027]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Beneficios Entregados</p>
                    <p className="text-gray-900">{beneficiosEntregados}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#008C45]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#008C45]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Pendientes</p>
                    <p className="text-gray-900">{beneficiosPendientes}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Tasa Retiro</p>
                    <p className="text-gray-900">
                      {totalEmpleados > 0 ? Math.round((beneficiosEntregados / totalEmpleados) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#008C45]/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#008C45]" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Totales por Planta */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <h2 className="text-[#D32027] mb-4">Totales por Planta</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F8FAFB] rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Casablanca</p>
                  <p className="text-gray-900 text-2xl font-bold">{countCasablanca}</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Valparaíso - Planta BIF</p>
                  <p className="text-gray-900 text-2xl font-bold">{countValparaisoBIF}</p>
                </div>
                <div className="bg-[#F8FAFB] rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Valparaíso - Planta BIC</p>
                  <p className="text-gray-900 text-2xl font-bold">{countValparaisoBIC}</p>
                </div>
              </div>
            </Card>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-[#D32027] mb-4">Distribución por Estado</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dataEstado}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataEstado.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#008C45' : '#FFC107'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-[#D32027] mb-4">Empleados por Localidad</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dataLocalidad}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#D32027" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-[#D32027] mb-4">Empleados por Rol/Departamento</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dataRol}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#008C45" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Resumen por Tipo de Contrato */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#D32027]">Resumen Detallado</h2>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResumenExpandido(!showResumenExpandido)}
                    className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10 rounded-md px-3 py-1 flex items-center gap-2"
                  >
                    {showResumenExpandido ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Mostrar menos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Mostrar más
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {showResumenExpandido ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-[#008C45]/10 rounded-lg p-4">
                      <h3 className="text-[#D32027] mb-2">Personal de Base</h3>
                      <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.personalBase}</p>
                      <p className="text-gray-600 text-sm">Operadores y producción</p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-4">
                      <h3 className="text-[#D32027] mb-2">Oficina</h3>
                      <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.oficina}</p>
                      <p className="text-gray-600 text-sm">Personal administrativo</p>
                    </div>
                    <div className="bg-[#D32027]/10 rounded-lg p-4">
                      <h3 className="text-[#D32027] mb-2">Guardia</h3>
                      <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.guardia}</p>
                      <p className="text-gray-600 text-sm">Seguridad y portería</p>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#FFF4E6' }}>
                      <h3 className="text-[#D32027] mb-2">Supervisión</h3>
                      <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.supervision}</p>
                      <p className="text-gray-600 text-sm">Líderes y coordinadores</p>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#FFF7ED' }}>
                      <h3 className="text-[#D32027] mb-2">Administración</h3>
                      <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.administracion}</p>
                      <p className="text-gray-600 text-sm">Gestión y apoyo</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="bg-white p-4 rounded border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Totales adicionales</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>Total empleados: <strong>{totalEmpleados}</strong></li>
                            <li>Planta: <strong>{empleadosPlanta}</strong></li>
                            <li>Plazo Fijo: <strong>{empleadosPlazoFijo}</strong></li>
                            <li>Beneficios pendientes: <strong>{beneficiosPendientes}</strong></li>
                            <li>Beneficios entregados: <strong>{beneficiosEntregados}</strong></li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Top localidades</h4>
                          <ol className="text-sm text-gray-700 list-decimal list-inside">
                            {dataLocalidad.slice(0,5).map((d) => (
                              <li key={d.name}>{d.name} — {d.value}</li>
                            ))}
                            {dataLocalidad.length === 0 && <li>No hay localidades registradas</li>}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </Card>

            {/* Nueva tarjeta de Guardias Activos (colapsable) */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#D32027]">Guardias del Sistema</h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setExpandedGuardias(!expandedGuardias)}
                    variant="outline"
                    className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                  >
                    {expandedGuardias ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    {expandedGuardias ? 'Ocultar' : 'Mostrar'}
                  </Button>
                  <Button
                    onClick={() => setVistaActual('empleados')}
                    variant="outline"
                    className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                  >
                    Ver Gestión de Guardias
                  </Button>
                </div>
              </div>
              {expandedGuardias && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#008C45]/10 rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Total Guardias</p>
                    <p className="text-2xl font-bold text-gray-900">{guardias.length}</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Activos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {guardias.filter(g => g.activo).length}
                    </p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Inactivos</p>
                    <p className="text-2xl font-bold text-red-600">
                      {guardias.filter(g => !g.activo).length}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Vista Empleados con nueva pestaña de Guardias */}
        {vistaActual === 'empleados' && (
          <div className="space-y-6">
            {/* Tabs */}
            <Card className="p-4 bg-white shadow-md rounded-xl">
              <div className="flex">
                <Button
                  onClick={() => { console.debug('Notificar Beneficios clicked'); setOpenNotificar(true); }}
                  variant="outline"
                  className="border-[#D32027] text-[#D32027] hover:bg-[#D32027]/10"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Notificar Beneficios
                </Button>
                {/* Modal para parcelado de notificaciones (simple, independiente de Radix) */}
                {openNotificar && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Notificar beneficios pendientes</h3>
                          <p className="text-sm text-gray-600">Selecciona el tamaño de lote para enviar notificaciones a los empleados con estado "Pendiente".</p>
                        </div>
                        <button onClick={() => setOpenNotificar(false)} className="text-gray-500 ml-4">Cerrar</button>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-sm text-gray-700">Enviar a</p>
                          <div className="flex gap-2 mb-2 items-center">
                            <label className={notificarTarget === 'first' ? 'px-3 py-2 rounded border cursor-pointer bg-[#D32027] text-white' : 'px-3 py-2 rounded border cursor-pointer bg-white'}>
                              <input type="radio" name="notificarTarget" value="first" checked={notificarTarget === 'first'} onChange={() => setNotificarTarget('first')} className="hidden" />
                              Primeros
                            </label>
                            <label className={notificarTarget === 'all' ? 'px-3 py-2 rounded border cursor-pointer bg-[#D32027] text-white' : 'px-3 py-2 rounded border cursor-pointer bg-white'}>
                              <input type="radio" name="notificarTarget" value="all" checked={notificarTarget === 'all'} onChange={() => setNotificarTarget('all')} className="hidden" />
                              Todos
                            </label>

                            {notificarTarget === 'first' && (
                              <div className="flex items-center gap-2 ml-2">
                                <span className="text-sm">Cantidad:</span>
                                <select value={notificarFirstCount} onChange={(e) => setNotificarFirstCount(Number(e.target.value))} className="px-2 py-1 border rounded">
                                  <option value={30}>30</option>
                                  <option value={60}>60</option>
                                  <option value={90}>90</option>
                                  <option value={120}>120</option>
                                  <option value={99999}>Otro...</option>
                                </select>
                                {notificarFirstCount === 99999 && (
                                  <input type="number" min={1} onChange={(e) => setNotificarFirstCount(Number(e.target.value))} placeholder="Ingrese N" className="px-2 py-1 border rounded w-24" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tamaño del lote oculto por petición del usuario; el valor se mantiene en estado */}

                        <div className="pt-3">
                          <p className="text-sm">Resumen:</p>
                          <p className="text-sm text-gray-600">Empleados pendientes: {empleados.filter(e => e.estado === 'Pendiente').length}</p>
                          <p className="text-sm text-gray-600">Con correo: {empleados.filter(e => e.estado === 'Pendiente' && e.correo && e.correo.trim() !== '').length}</p>
                          <p className="text-sm text-gray-600">Sin correo: {empleados.filter(e => e.estado === 'Pendiente' && (!e.correo || e.correo.trim() === '')).length}</p>
                          {notificarSending && (
                            <div className="mt-2 text-sm text-gray-700">Enviando lote {notificarProgress.currentBatch} de {notificarProgress.batches} — {notificarProgress.sent}/{notificarProgress.total} enviados</div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenNotificar(false)}>Cancelar</Button>
                        <Button onClick={() => enviarNotificacionesParceladas(30)} className="bg-[#D32027] hover:bg-[#D32027]/90 text-white">
                          {notificarSending ? 'Enviando...' : 'Enviar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Sección de Gestión de Guardias (colapsable) */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#D32027]">Gestión de Guardias</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setExpandedGuardias(!expandedGuardias)} className="bg-[#008C45] hover:bg-[#008C45]/90 text-white">
                    {expandedGuardias ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    {expandedGuardias ? 'Ocultar' : 'Mostrar'}
                  </Button>
                  {expandedGuardias && (
                    <Button onClick={() => setMostrarFormGuardia(true)} className="bg-[#008C45] hover:bg-[#008C45]/90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Guardia
                    </Button>
                  )}
                </div>
              </div>

              {expandedGuardias && (
                <>
                  {/* Formulario de nuevo guardia */}
                  {mostrarFormGuardia && (
                    <Card className="p-6 mb-6 bg-[#008C45]/5 border-2 border-[#008C45]/20">
                      <h3 className="text-[#D32027] mb-4">Nuevo Guardia</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-600 block mb-2">Nombre Completo</label>
                          <Input
                            type="text"
                            placeholder="Ej: Juan Pérez"
                            value={nuevoGuardia.nombre}
                            onChange={(e) => setNuevoGuardia({ ...nuevoGuardia, nombre: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-gray-600 block mb-2">RUT (sin puntos, con guión)</label>
                          <Input
                            type="text"
                            placeholder="Ej: 15123456-7"
                            value={nuevoGuardia.rut}
                            onChange={(e) => setNuevoGuardia({ ...nuevoGuardia, rut: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Nota:</strong> Las credenciales se generarán automáticamente:
                        </p>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          <li>• Usuario: RUT sin puntos (con guión)</li>
                          <li>• Contraseña: RUT sin puntos, sin guión y sin dígito verificador</li>
                        </ul>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={handleAgregarGuardia}
                          className="bg-[#008C45] hover:bg-[#008C45]/90 text-white"
                        >
                          Guardar Guardia
                        </Button>
                        <Button
                          onClick={() => {
                            setMostrarFormGuardia(false);
                            setNuevoGuardia({ nombre: '', rut: '' });
                          }}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Card>
                  )}

                  {/* Tabla de Guardias */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>RUT</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Contraseña</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha Creación</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {guardias.map((guardia) => (
                          <TableRow key={guardia.id}>
                            <TableCell>{guardia.nombre}</TableCell>
                            <TableCell>{guardia.rut}</TableCell>
                            <TableCell>
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {guardia.usuario}
                              </code>
                            </TableCell>

                            {/* Contraseña editable */}
                            <TableCell>
                              {editPassId === guardia.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    value={editPassValue}
                                    onChange={(e) => setEditPassValue(e.target.value)}
                                    placeholder="Nueva contraseña"
                                    className="w-40"
                                  />
                                </div>
                              ) : (
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                  {guardia.password}
                                </code>
                              )}
                            </TableCell>

                            <TableCell>
                              <Badge
                                className={
                                  guardia.activo
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }
                              >
                                {guardia.activo ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                            <TableCell>{guardia.fechaCreacion}</TableCell>

                            {/* Acciones con editar contraseña */}
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {editPassId === guardia.id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-[#008C45] hover:bg-[#008C45]/90 text-white"
                                      onClick={guardarNuevaPassword}
                                    >
                                      Guardar
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={cancelarEditarPassword}>
                                      Cancelar
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEditarPassword(guardia)}
                                  >
                                    Cambiar
                                  </Button>
                                )}

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleGuardia(guardia.id)}
                                  className={
                                    guardia.activo
                                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                                      : 'border-green-500 text-green-500 hover:bg-green-50'
                                  }
                                >
                                  {guardia.activo ? 'Desactivar' : 'Activar'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEliminarGuardia(guardia.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </Card>

            {/* Vista Empleados */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <h2 className="text-[#D32027]">Gestión de Nómina</h2>
                <div>
                  <Button onClick={() => { const next = !expandedNomina; setExpandedNomina(next); if (next) setExpandedTabla(false); }} className="bg-[#D32027] hover:bg-[#D32027]/90 text-white">
                    {expandedNomina ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    {expandedNomina ? 'Ocultar' : 'Mostrar'}
                  </Button>
                </div>
              </div>

              {expandedNomina && (
                <>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleCargarNomina}
                      className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Cargar Nómina
                    </Button>
                    <Button
                      onClick={handleLimpiarNomina}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      title="Vaciar nómina de empleados"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpiar Nómina
                    </Button>
                      <Button
                        ref={(el) => (agregarBtnRef.current = el)}
                        variant="outline"
                        className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                        onClick={openAgregarEmpleado}
                      >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Empleado
                    </Button>
                  </div>

                  {/* Leyenda de formatos y columnas */}
                  <p className="text-xs text-gray-600 mt-2">
                    Formatos admitidos: .xlsx, .xls, .csv. Columnas esperadas (nombres flexibles): 
                    Nombre, RUT, Correo, TipoContrato, Rol, Localidad, Beneficio, Estado, FechaRetiro.
                  </p>
                </>
              )}
            </Card>

            {/* Resumen última carga (si existe) - mostrar sólo con expandedNomina */}
            {expandedNomina && ultimaCarga && (
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h3 className="text-[#D32027] mb-2">Resumen de carga</h3>
                <p className="text-gray-700 mb-4">
                  Se agregaron {ultimaCarga.total} empleados desde el archivo.
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>RUT</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Tipo Contrato</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Localidad</TableHead>
                        <TableHead>Beneficio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ultimaCarga.preview.map((emp: Empleado) => (
                        <TableRow key={emp.id}>
                          <TableCell>{emp.nombre}</TableCell>
                          <TableCell>{emp.rut}</TableCell>
                          <TableCell>{emp.correo}</TableCell>
                          <TableCell>{emp.tipoContrato}</TableCell>
                          <TableCell>{emp.rol}</TableCell>
                          <TableCell>{emp.localidad}</TableCell>
                          <TableCell>{emp.beneficio}</TableCell>
                          <TableCell>{emp.estado}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-gray-500 mt-2">Mostrando una vista previa (máx. 5). Revisa la tabla completa abajo.</p>
              </Card>
            )}

            {/* Filtros */}
            {/* Filtros - mostrar sólo cuando expandedNomina es true */}
            {expandedNomina && (
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h3 className="text-[#D32027] mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-gray-600 block mb-2">Buscar (Nombre o RUT)</label>
                    <Input
                      type="text"
                      placeholder="Buscar por nombre o RUT"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery.trim() !== '' && (
                      <p className="text-sm text-gray-600 mt-2">Resultados: {empleadosFiltrados.length} / {empleados.length}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-2">Localidad</label>
                    <Select value={filtroLocalidad} onValueChange={setFiltroLocalidad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      {/* Mostrar aproximadamente la mitad de las localidades visibles y permitir scroll para el resto */}
                      {/* Calculamos una altura dinámica basada en la cantidad de opciones */}
                      <SelectContent
                        className="overflow-y-auto"
                        style={{ maxHeight: `${Math.max(160, Math.ceil((localidadOptions.length || 1) / 2) * 40)}px` }}
                      >
                        <SelectItem value="all">Todas</SelectItem>
                        {localidadOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-2">Planta</label>
                    <Select value={filtroPlanta} onValueChange={setFiltroPlanta}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="max-h-44 overflow-y-auto">
                        <SelectItem value="all">Todas</SelectItem>
                        {plantaOptions.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}{p.count ? ` (${p.count})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-2">Tipo de Contrato</label>
                    <Select value={filtroContrato} onValueChange={setFiltroContrato}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Planta">Planta</SelectItem>
                        <SelectItem value="Plazo Fijo">Plazo Fijo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-2">Rol/Departamento</label>
                    <Select value={filtroRol} onValueChange={setFiltroRol}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Guardia">Guardia</SelectItem>
                        <SelectItem value="Personal de Base">Personal de Base</SelectItem>
                        <SelectItem value="Oficina">Oficina</SelectItem>
                        <SelectItem value="Supervisión">Supervisión</SelectItem>
                        <SelectItem value="Administración">Administración</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-2">Estado</label>
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Retirado">Retirado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}

            {/* Tabla de Empleados (colapsable) - mostrar la tarjeta cuando expandedNomina es true */}
            {expandedNomina && (
              <Card className="bg-white shadow-md rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <h2 className="text-[#D32027]">Nómina Cargada</h2>
                  <Button onClick={() => setExpandedTabla(!expandedTabla)} variant="outline" className="border-[#D32027] text-[#D32027] hover:bg-[#D32027]/10">
                    {expandedTabla ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    {expandedTabla ? 'Ocultar' : 'Mostrar'}
                  </Button>
                </div>
                {expandedTabla && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>RUT</TableHead>
                          <TableHead>Correo</TableHead>
                          <TableHead>Tipo Contrato</TableHead>
                          <TableHead>Rol/Departamento</TableHead>
                          <TableHead>Localidad</TableHead>
                          <TableHead>Planta</TableHead>
                          <TableHead>Beneficio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {empleadosFiltrados.map((emp: Empleado) => (
                          <TableRow key={emp.id}>
                            <TableCell>{emp.nombre}</TableCell>
                            <TableCell>{emp.rut}</TableCell>
                            <TableCell>{emp.correo}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  emp.tipoContrato === 'Planta'
                                    ? 'bg-[#008C45]/20 text-[#008C45]'
                                    : 'bg-[#D32027]/20 text-[#D32027]'
                                }
                              >
                                {emp.tipoContrato}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  emp.rol === 'Guardia'
                                    ? 'bg-red-500/10 text-red-600'
                                    : emp.rol === 'Personal de Base'
                                    ? 'bg-green-500/10 text-green-600'
                                    : emp.rol === 'Oficina'
                                    ? 'bg-yellow-500/10 text-yellow-600'
                                    : 'bg-gray-500/10 text-gray-600'
                                }
                              >
                                {emp.rol}
                              </Badge>
                            </TableCell>
                            <TableCell>{emp.localidad}</TableCell>
                            <TableCell>{emp.planta}</TableCell>
                            <TableCell>{emp.beneficio}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  emp.estado === 'Retirado'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }
                              >
                                {emp.estado}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEliminar(emp.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Vista Reportes */}
        {vistaActual === 'reportes' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#D32027]">Generación de Reportes</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setExpandedReportes(!expandedReportes)}
                    className="border-[#D32027] text-[#D32027]"
                  >
                    {expandedReportes ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Mostrar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleExportarReporte}
                    className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Reporte
                  </Button>
                </div>
              </div>

              <div className={expandedReportes ? 'space-y-4' : 'hidden'}>
                <div className="bg-[#008C45]/10 rounded-lg p-4">
                  <h3 className="text-[#D32027] mb-2">Empleados No Retirados</h3>
                  <div className="space-y-2">
                    {empleados.filter(e => e.estado === 'Pendiente').map(emp => (
                      <div key={emp.id} className="bg-white rounded p-3 flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">{emp.nombre}</p>
                          <p className="text-gray-600">{emp.rut} • {emp.localidad}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">Pendiente</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Incidencias reportadas (siempre visibles fuera del toggle) */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#D32027]">Incidencias Reportadas</h3>
                <div className="flex gap-2">
                  <Button onClick={reloadIncidencias} variant="outline">Refrescar</Button>
                  <Button onClick={handleExportarIncidencias} className="bg-[#D32027] text-white">Exportar Incidencias</Button>
                </div>
              </div>

              {incidencias.length === 0 ? (
                <p className="text-gray-600">No se han reportado incidencias aún.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Empleado</TableHead>
                        <TableHead>RUT</TableHead>
                        <TableHead>Guardia</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Adjuntos</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidencias.map((inc) => (
                        <TableRow key={inc.id}>
                          <TableCell className="text-sm">{new Date(inc.fecha).toLocaleString('es-CL')}</TableCell>
                          <TableCell>{inc.empleadoNombre}</TableCell>
                          <TableCell>{inc.empleadoRut}</TableCell>
                          <TableCell>{inc.guardiaUsuario || '-'}</TableCell>
                          <TableCell className="capitalize">{inc.tipo}</TableCell>
                          <TableCell className="max-w-[300px] text-sm">{inc.descripcion}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {(inc.adjuntos || []).slice(0,3).map((a:string, idx:number) => (
                                <a key={idx} href={a} target="_blank" rel="noreferrer">
                                  <img src={a} alt={`adj-${idx}`} className="h-12 w-12 object-cover rounded" />
                                </a>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEliminarIncidencia(inc.id)}>Eliminar</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>

            {/* Generador de Reportes: filtros personalizables y botón Generar */}
            <Card className="p-6 bg-white shadow-md rounded-xl mt-4">
              <h3 className="text-[#D32027] mb-4">Generador de Reportes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Localidad</label>
                  <Select value={reportFiltroLocalidad} onValueChange={(v) => setReportFiltroLocalidad(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="max-h-44 overflow-y-auto">
                      <SelectItem value="all">Todas</SelectItem>
                      {localidadOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Planta</label>
                  <Select value={reportFiltroPlanta} onValueChange={(v) => setReportFiltroPlanta(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent className="max-h-44 overflow-y-auto">
                      <SelectItem value="all">Todas</SelectItem>
                      {plantaOptions.map(p => <SelectItem key={p.value} value={p.value}>{p.label} {p.count ? `(${p.count})` : ''}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Tipo Contrato</label>
                  <Select value={reportFiltroContrato} onValueChange={(v) => setReportFiltroContrato(v)}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Planta">Planta</SelectItem>
                      <SelectItem value="Plazo Fijo">Plazo Fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Rol / Departamento</label>
                  <Select value={reportFiltroRol} onValueChange={(v) => setReportFiltroRol(v)}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Guardia">Guardia</SelectItem>
                      <SelectItem value="Personal de Base">Personal de Base</SelectItem>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Supervisión">Supervisión</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Estado</label>
                  <Select value={reportFiltroEstado} onValueChange={(v) => setReportFiltroEstado(v)}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Retirado">Retirado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 block mb-2">Buscar (nombre o RUT)</label>
                  <Input placeholder="Buscar en reporte" value={reportSearch} onChange={(e) => setReportSearch(e.target.value)} />
                </div>
              </div>

              {/* Contador de coincidencias y visualizador */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-700">Coincidencias: <strong>{reportMatchesCount}</strong></p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setReportViewerOpen(!reportViewerOpen)}>
                    {reportViewerOpen ? 'Ocultar resultados' : 'Ver coincidencias'}
                  </Button>
                </div>
              </div>

              {reportViewerOpen && (
                <div className="mt-3 overflow-x-auto border rounded bg-white">
                  <div className="max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>RUT</TableHead>
                          <TableHead>Correo</TableHead>
                          <TableHead>Tipo Contrato</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Localidad</TableHead>
                          <TableHead>Planta</TableHead>
                          <TableHead>Beneficio</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportEmpleadosFiltrados.slice(0, 200).map((e: Empleado) => (
                          <TableRow key={e.id}>
                            <TableCell>{e.nombre}</TableCell>
                            <TableCell>{e.rut}</TableCell>
                            <TableCell>{e.correo}</TableCell>
                            <TableCell>{e.tipoContrato}</TableCell>
                            <TableCell>{e.rol}</TableCell>
                            <TableCell>{e.localidad}</TableCell>
                            <TableCell>{e.planta}</TableCell>
                            <TableCell>{e.beneficio}</TableCell>
                            <TableCell>{e.estado}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="p-2 text-xs text-gray-500">Mostrando {Math.min(reportEmpleadosFiltrados.length, 200)} de {reportEmpleadosFiltrados.length} coincidencias</div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Button onClick={handleGenerarReporte} className="bg-[#D32027] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </Card>
          </div>
        )}
        {/* Modal Agregar Empleado (floating, desplegable) */}
        {showAgregarEmpleado && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className={`bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 transform transition-all duration-250 ease-out overflow-auto ${animateAgregarEmpleado ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`} style={{ maxHeight: '90vh' }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#D32027]">Agregar Empleado</h3>
                  <button onClick={closeAgregarEmpleado} className="text-gray-500 hover:text-gray-700">Cerrar</button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Nombre completo</label>
                      <Input value={nuevoEmpleado.nombre || ''} onChange={e => setNuevoEmpleado(prev => ({ ...prev, nombre: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">RUT</label>
                      <Input value={nuevoEmpleado.rut || ''} onChange={e => setNuevoEmpleado(prev => ({ ...prev, rut: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Correo</label>
                      <Input value={nuevoEmpleado.correo || ''} onChange={e => setNuevoEmpleado(prev => ({ ...prev, correo: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Tipo Contrato</label>
                      <select value={nuevoEmpleado.tipoContrato} onChange={e => setNuevoEmpleado(prev => ({ ...prev, tipoContrato: e.target.value as any }))} className="w-full border rounded px-3 py-2">
                        <option value="Planta">Planta</option>
                        <option value="Plazo Fijo">Plazo Fijo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Rol</label>
                      <select value={nuevoEmpleado.rol} onChange={e => setNuevoEmpleado(prev => ({ ...prev, rol: e.target.value as any }))} className="w-full border rounded px-3 py-2">
                        <option value="Personal de Base">Personal de Base</option>
                        <option value="Guardia">Guardia</option>
                        <option value="Oficina">Oficina</option>
                        <option value="Supervisión">Supervisión</option>
                        <option value="Administración">Administración</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Localidad</label>
                      <select
                        value={nuevoEmpleado.localidad || ''}
                        onChange={e => setNuevoEmpleado(prev => ({ ...prev, localidad: e.target.value }))}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Seleccione localidad</option>
                        {(localidadOptions && localidadOptions.length > 0)
                          ? localidadOptions.map(opt => (
                              <option key={opt.label} value={opt.label}>{opt.label}</option>
                            ))
                          : [
                              'Casablanca',
                              'Valparaíso',
                              'Valparaíso - BIF',
                              'Valparaíso - BIC',
                            ].map(lbl => (<option key={lbl} value={lbl}>{lbl}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Planta</label>
                      <select
                        value={nuevoEmpleado.planta || ''}
                        onChange={e => setNuevoEmpleado(prev => ({ ...prev, planta: e.target.value }))}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Seleccione planta</option>
                        {plantasSelectLabels.map(lbl => (
                          <option key={lbl} value={lbl}>{lbl}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Beneficio</label>
                      <select
                        value={nuevoEmpleado.beneficio || ''}
                        onChange={e => setNuevoEmpleado(prev => ({ ...prev, beneficio: e.target.value }))}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Seleccione beneficio</option>
                        {(beneficiosOptions && beneficiosOptions.length > 0)
                          ? beneficiosOptions.map(opt => (
                              <option key={opt.label} value={opt.label}>{opt.label}</option>
                            ))
                          : [
                              'Caja Navidad 2024',
                              'Caja Estándar',
                            ].map(lbl => (<option key={lbl} value={lbl}>{lbl}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Estado</label>
                      <select value={nuevoEmpleado.estado} onChange={e => setNuevoEmpleado(prev => ({ ...prev, estado: e.target.value as any }))} className="w-full border rounded px-3 py-2">
                        <option value="Pendiente">Pendiente</option>
                        <option value="Retirado">Retirado</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <Button onClick={closeAgregarEmpleado} variant="outline" className="border-gray-300 text-gray-700">Cancelar</Button>
                    <Button onClick={submitNuevoEmpleado} className="bg-[#008C45] text-white">Agregar</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
