import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Search, CheckCircle, XCircle, Package, User as UserIcon, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import jsQR from 'jsqr';
import { BrowserMultiFormatReader } from '@zxing/library';
import ThemeLogo from './ThemeLogo';
import { useTheme } from '../context/ThemeContext';

interface GuardiaDashboardProps {
  onBack: () => void;
  guardia?: { nombre: string; usuario: string; activo: boolean };
}

interface Trabajador {
  rut: string;
  nombre: string;
  correo?: string;
  tipoContrato: 'Planta' | 'Plazo Fijo';
  beneficio: string;
  retirado: boolean;
  fechaRetiro?: string;
}

// Helpers nómina
type Empleado = {
  id: number;
  nombre: string;
  rut: string;
  correo?: string;
  tipoContrato: 'Planta' | 'Plazo Fijo';
  rol: string;
  localidad: string;
  beneficio: string;
  estado: 'Pendiente' | 'Retirado';
  fechaRetiro?: string;
};

const normalizeRut = (r: string) => (r || '').toString().replace(/[.\-]/g, '').toUpperCase();
const loadEmpleados = (): Empleado[] => {
  try {
    const empleados = JSON.parse(localStorage.getItem('empleados') || '[]') as Empleado[];
    console.log('📋 Empleados cargados desde localStorage:', empleados.length);
    console.log('Empleados:', empleados);
    return empleados;
  } catch {
    console.error('❌ Error al cargar empleados desde localStorage');
    return [];
  }
};
const findEmpleadoByRut = (rut: string): Empleado | undefined => {
  const lista = loadEmpleados();
  const target = normalizeRut(rut);
  console.log('🔍 Buscando RUT normalizado:', target);
  console.log('RUTs en la lista:', lista.map(e => normalizeRut(e.rut)));
  return lista.find((e) => normalizeRut(e.rut) === target);
};

// Extrae RUN/RUT desde texto libre (p. ej. 'run=15743056-4' o '...15743056-4...')
const extractRunFromText = (text: string): string | null => {
  if (!text) return null;
  const cleaned = String(text);
  // Pattern like RUN=15743056-4 or RUN:15743056-4 or RUN 15743056-4
  const runRegex = /RUN\s*[=:]?\s*([0-9]{1,8}-?[0-9kK]?)/i;
  const m = cleaned.match(runRegex);
  if (m && m[1]) return m[1];
  // Fallback: find a RUT-like pattern anywhere in the text (6-8 digits + - + verifier)
  const rutRegex = /([0-9]{6,8}-[0-9kK])/;
  const m2 = cleaned.match(rutRegex);
  if (m2 && m2[1]) return m2[1];
  return null;
};

export default function GuardiaDashboard({ onBack, guardia }: GuardiaDashboardProps) {
  const { theme } = useTheme();
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
  const [rutInput, setRutInput] = useState('');
  const [trabajadorActual, setTrabajadorActual] = useState<Trabajador | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [ultimaEntrega, setUltimaEntrega] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [packageScanning, setPackageScanning] = useState(false);
  const [packageCode, setPackageCode] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packageVideoRef = useRef<HTMLVideoElement>(null);
  const packageCodeReaderRef = useRef<any>(null);
  // Incidencias desde portal de guardia
  const [showIncidenciaModalG, setShowIncidenciaModalG] = useState(false);
  const [incidenciaTipoG, setIncidenciaTipoG] = useState<string>('rota');
  const [incidenciaDescG, setIncidenciaDescG] = useState<string>('');
  const [incidenciaAdjuntosG, setIncidenciaAdjuntosG] = useState<string[]>([]);
  const [submittingIncidenciaG, setSubmittingIncidenciaG] = useState(false);
  const MAX_INCIDENCIA_ADJUNTOS = 3;

  useEffect(() => {
    if (scanMode === 'qr' && scanning) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scanMode, scanning]);

  // Limpiar scanner de paquetes al desmontar
  useEffect(() => {
    return () => {
      stopPackageScan();
    };
  }, []);

  useEffect(() => {
    // Exigir guardia activo del módulo de Gestión de Guardias
    const normalizeUser = (s: string) => (s || '').replace(/[.\-\s]/g, '').trim();

    const isGuardiaActivo = () => {
      try {
        if (!guardia) return false;
        const lista = JSON.parse(localStorage.getItem('guardias') || '[]');
        const match = lista.find((g: any) => normalizeUser(g.usuario) === normalizeUser(guardia.usuario));
        return Boolean(match && match.activo);
      } catch {
        return false;
      }
    };

    try {
      if (!guardia) {
        alert('Debe iniciar sesión como guardia.');
        onBack();
        return;
      }

      if (!isGuardiaActivo()) {
        alert('Guardia no autorizado o inactivo.');
        onBack();
        return;
      }

      // Listener para cambios en localStorage (otras pestañas)
      const onStorage = (ev: StorageEvent) => {
        if (ev.key === 'guardias' || ev.key === null) {
          if (!isGuardiaActivo()) {
            alert('Tu cuenta ha sido desactivada. Serás desconectado.');
            onBack();
          }
        }
      };
      window.addEventListener('storage', onStorage as any);

      // Polling ligero como respaldo (cada 5s) para detectar cambios en la misma pestaña
      const interval = setInterval(() => {
        if (!isGuardiaActivo()) {
          alert('Tu cuenta ha sido desactivada. Serás desconectado.');
          onBack();
        }
      }, 5000);

      return () => {
        window.removeEventListener('storage', onStorage as any);
        clearInterval(interval);
      };
    } catch {
      onBack();
    }
  }, [guardia, onBack]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      setMensaje({ tipo: 'error', texto: 'No se pudo acceder a la cámara' });
      setScanning(false);
    }
  };

  // Iniciar escaneo de código de barras para el paquete (usa @zxing/library desde CDN si es posible)
  const startPackageScan = async () => {
    setPackageCode('');
    setPackageScanning(true);
    // Asegurar que se detenga el escaneo QR de identidad
    setScanning(false);

    try {
      // Usar la librería instalada localmente
      const codeReader = new BrowserMultiFormatReader();
      packageCodeReaderRef.current = codeReader;

      if (packageVideoRef.current) {
        codeReader.decodeFromVideoDevice(null, packageVideoRef.current, (result: any, _err: any) => {
          if (result) {
            try {
              const text = result.getText ? result.getText() : String(result);
              setPackageCode(text);
              setPackageScanning(false);
              // detener reader
              try { codeReader.reset(); } catch {};
            } catch (e) {
              console.error('Error leyendo código de paquete:', e);
            }
          }
        });
      }
    } catch (err) {
      console.error('No fue posible iniciar el escáner de paquetes:', err);
      setMensaje({ tipo: 'error', texto: 'No fue posible iniciar el escáner de paquete en este dispositivo.' });
      setPackageScanning(false);
    }
  };

  const stopPackageScan = () => {
    try {
      if (packageCodeReaderRef.current) {
        try { packageCodeReaderRef.current.reset(); } catch {};
        packageCodeReaderRef.current = null;
      }
      if (packageVideoRef.current?.srcObject) {
        const stream = packageVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        packageVideoRef.current.srcObject = null;
      }
    } catch (e) {
      // noop
    }
    setPackageScanning(false);
  };

  const resetIncidenciaFormG = () => {
    setIncidenciaTipoG('rota');
    setIncidenciaDescG('');
    setIncidenciaAdjuntosG([]);
  };

  const handleAdjuntosChangeG = (files?: FileList | null) => {
    if (!files || files.length === 0) {
      setIncidenciaAdjuntosG([]);
      return;
    }
    const existingCount = incidenciaAdjuntosG.length;
    const allowed = MAX_INCIDENCIA_ADJUNTOS - existingCount;
    if (allowed <= 0) {
      alert(`Ya alcanzaste el máximo de ${MAX_INCIDENCIA_ADJUNTOS} archivos.`);
      return;
    }
    const fileArray = Array.from(files).slice(0, allowed);
    const readers = fileArray.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Error leyendo archivo'));
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers)
      .then(results => {
        setIncidenciaAdjuntosG(prev => {
          const merged = [...prev, ...results];
          return merged.slice(0, MAX_INCIDENCIA_ADJUNTOS);
        });
        if (results.length < (files?.length || 0)) {
          alert(`Se añadieron sólo ${results.length} archivos para respetar el máximo de ${MAX_INCIDENCIA_ADJUNTOS}.`);
        }
      })
      .catch(err => {
        console.error('Error leyendo adjuntos', err);
        alert('No fue posible leer algunos archivos.');
      });
  };

  const submitIncidenciaG = () => {
    if (!trabajadorActual) {
      alert('No hay trabajador seleccionado para reportar la incidencia.');
      return;
    }
    if (!incidenciaDescG.trim()) {
      alert('Por favor describe brevemente la incidencia.');
      return;
    }
    setSubmittingIncidenciaG(true);
    try {
      const almacen = localStorage.getItem('incidencias');
      const lista = almacen ? JSON.parse(almacen) : [];
      const nueva = {
        id: `inc-${Date.now()}`,
        empleadoRut: trabajadorActual.rut,
        empleadoNombre: trabajadorActual.nombre,
        guardiaUsuario: guardia?.usuario || 'desconocido',
        tipo: incidenciaTipoG,
        descripcion: incidenciaDescG.trim(),
        adjuntos: incidenciaAdjuntosG,
        fecha: new Date().toISOString(),
      };
      lista.push(nueva);
      localStorage.setItem('incidencias', JSON.stringify(lista));
      setSubmittingIncidenciaG(false);
      setShowIncidenciaModalG(false);
      resetIncidenciaFormG();
      alert('Incidencia reportada. Se guardó localmente.');
    } catch (err) {
      console.error('Error guardando incidencia', err);
      setSubmittingIncidenciaG(false);
      alert('No fue posible guardar la incidencia. Revisa la consola.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        try {
          // Primero intentar JSON (formato { "rut": "..." })
          const data = JSON.parse(code.data);
          // Validar SIEMPRE contra nómina cargada usando el RUT del QR
          if (data?.rut) {
            buscarTrabajador(data.rut);
            setScanning(false);
            stopCamera();
            return;
          }
        } catch (err) {
          // No es JSON -> intentar extraer RUN dentro del texto libre
          try {
            const text = String(code.data || '');
            const run = extractRunFromText(text);
            if (run) {
              // Llamar buscarTrabajador con el valor extraído
              buscarTrabajador(run);
              setScanning(false);
              stopCamera();
              return;
            }
          } catch (e) {
            console.error('Error extrayendo RUN del QR:', e);
          }
        }
      }
    }

    requestAnimationFrame(scanQRCode);
  };

  const buscarTrabajador = (rut: string) => {
    setMensaje(null);

    const empleado = findEmpleadoByRut(rut);
    if (!empleado) {
      setMensaje({ tipo: 'error', texto: 'RUT no encontrado en la nómina' });
      setTrabajadorActual(null);
      return;
    }

    console.log('Empleado encontrado:', empleado); // Debug

    const trabajador: Trabajador = {
      rut: empleado.rut,
      nombre: empleado.nombre,
      correo: empleado.correo,
      tipoContrato: empleado.tipoContrato,
      beneficio: empleado.beneficio,
      retirado: empleado.estado === 'Retirado',
      fechaRetiro: empleado.fechaRetiro,
    };

    console.log('Trabajador con correo:', trabajador.correo); // Debug

    setTrabajadorActual(trabajador);
  };

  const buscarPorRut = () => {
    if (!rutInput.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingrese un RUT válido' });
      return;
    }
    buscarTrabajador(rutInput);
  };

  const confirmarEntrega = () => {
    if (!trabajadorActual) return;

    // Requerir escaneo de paquete antes de confirmar
    if (!packageCode) {
      setMensaje({ tipo: 'error', texto: 'Debe escanear el código de barra del paquete antes de confirmar la entrega.' });
      return;
    }

    // Releer y actualizar nómina en localStorage
    const lista = loadEmpleados();
    const idx = lista.findIndex((e) => normalizeRut(e.rut) === normalizeRut(trabajadorActual.rut));
    if (idx === -1) {
      setMensaje({ tipo: 'error', texto: 'No se pudo actualizar la nómina. Intente nuevamente.' });
      return;
    }

    if (lista[idx].estado === 'Retirado') {
      setMensaje({ tipo: 'error', texto: `Este beneficio ya fue retirado el ${lista[idx].fechaRetiro}` });
      return;
    }

    const fecha = new Date().toLocaleString('es-CL');
    lista[idx] = { ...lista[idx], estado: 'Retirado', fechaRetiro: fecha };
    try {
      localStorage.setItem('empleados', JSON.stringify(lista));
      // Notificar a otras vistas (Admin) que la nómina cambió
      window.dispatchEvent(new CustomEvent('empleados:updated'));
    } catch (e) {
      console.error('Error guardando nómina:', e);
      setMensaje({ tipo: 'error', texto: 'Error al guardar cambios.' });
      return;
    }

    // Usar el correo del trabajador actual que ya tiene la información
    const correoEmpleado = trabajadorActual.correo || 'correo no registrado';

    setTrabajadorActual((prev: Trabajador | null) =>
      prev ? { ...prev, retirado: true, fechaRetiro: fecha } : prev
    );
    setMensaje({ 
      tipo: 'success', 
      texto: `✓ Entrega confirmada exitosamente\n📧 Notificación enviada a: ${correoEmpleado}\n📦 Código paquete: ${packageCode}` 
    });
    setUltimaEntrega(`${trabajadorActual.nombre} - ${fecha} (📧 ${correoEmpleado}) • Código paquete: ${packageCode}`);

    // limpiar packageCode y detener cualquier scanner
    setPackageCode('');
    stopPackageScan();

    setTimeout(() => {
      setTrabajadorActual(null);
      setRutInput('');
      setMensaje(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-tmluc-split p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[#D32027] hover:bg-[#D32027]/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
        </div>

        <div className="mb-8 flex items-center gap-4">
          {/* Logo personalizado */}
          <ThemeLogo className="h-12" />
          <div>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
            >
              Portal del Guardia
            </h1>
            <p className="text-gray-600" style={{ fontFamily: theme.fontFamily }}>
              Valida y registra la entrega de beneficios
            </p>
          </div>
        </div>

        {/* Método de Validación */}
        <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
          <h2 className="text-[#D32027] mb-4">Método de Validación</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => {
                setScanMode('qr');
                setTrabajadorActual(null);
                setMensaje(null);
              }}
              className={`h-auto py-4 ${
                scanMode === 'qr'
                  ? 'bg-[#D32027] text-white'
                  : 'bg-white border-2 border-[#E5E5E5] text-gray-700 hover:bg-[#D32027]/10'
              }`}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Escanear QR
            </Button>
            <Button
              onClick={() => {
                setScanMode('manual');
                setScanning(false);
                setTrabajadorActual(null);
                setMensaje(null);
              }}
              className={`h-auto py-4 ${
                scanMode === 'manual'
                  ? 'bg-[#D32027] text-white'
                  : 'bg-white border-2 border-[#E5E5E5] text-gray-700 hover:bg-[#D32027]/10'
              }`}
            >
              <Search className="w-5 h-5 mr-2" />
              Ingreso Manual
            </Button>
          </div>

          {/* Escaneo QR */}
          {scanMode === 'qr' && (
            <div className="space-y-4">
              {!scanning ? (
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-[#008C45]/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-[#008C45]/40" />
                  </div>
                  <p className="text-gray-600 mb-4">Activa la cámara para escanear el código QR del trabajador</p>
                  <Button onClick={() => setScanning(true)} className="bg-[#D32027] hover:bg-[#D32027]/90 text-white">
                    Activar Cámara
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} className="w-full h-64 object-cover" playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 border-4 border-[#D32027] m-12 rounded-lg pointer-events-none"></div>
                  </div>
                  <Button onClick={() => setScanning(false)} variant="outline" className="w-full">Detener Escaneo</Button>
                </div>
              )}
            </div>
          )}

          {/* Ingreso Manual */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ej: 16.234.567-8"
                  value={rutInput}
                  onChange={(e) => setRutInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarPorRut()}
                  className="flex-1"
                />
                <Button
                  onClick={buscarPorRut}
                  className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
              <p className="text-gray-600">Ingresa el RUT del trabajador</p>
            </div>
          )}
        </Card>

        {/* Mensajes (entrega y notificación por correo) */}
        {mensaje && (
          <Alert className="mb-6 bg-white border-2 border-tmluc-gris-claro shadow-sm">
            <AlertDescription className={`whitespace-pre-line font-medium ${
              mensaje.tipo === 'success' ? 'text-[#008C45]' : 'text-[#D32027]'
            }`}>
              {mensaje.texto}
            </AlertDescription>
          </Alert>
        )}

        {/* Panel de Validación */}
        {trabajadorActual && (
          <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
            {/* Logo en la parte superior */}
            <div className="flex justify-center mb-6">
              <ThemeLogo className="h-16" />
            </div>

            <h2 className="text-[#D32027] mb-6 text-center">Información del Trabajador</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Datos del trabajador (2/3 del espacio) */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-gray-600 block mb-1 font-medium">Nombre Completo</label>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-tmluc-gris-claro">
                    <UserIcon className="w-4 h-4 text-[#008C45]" />
                    <p className="text-gray-900 font-medium">{trabajadorActual.nombre}</p>
                  </div>
                </div>
                <div>
                  <label className="text-gray-600 block mb-1 font-medium">RUT</label>
                  <div className="bg-white p-3 rounded-lg border border-tmluc-gris-claro">
                    <p className="text-gray-900 font-mono font-bold">{trabajadorActual.rut}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 block mb-1 font-medium">Tipo de Contrato</label>
                    <span className={`inline-block px-4 py-2 rounded-lg font-medium ${
                      trabajadorActual.tipoContrato === 'Planta'
                        ? 'bg-[#008C45]/20 text-[#008C45]'
                        : 'bg-[#D32027]/20 text-[#D32027]'
                    }`}>
                      {trabajadorActual.tipoContrato}
                    </span>
                  </div>
                  <div>
                    <label className="text-gray-600 block mb-1 font-medium">Tipo de Caja</label>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-tmluc-gris-claro">
                      <Package className="w-4 h-4 text-[#008C45]" />
                      <p className="text-gray-900 font-medium">
                        {trabajadorActual.tipoContrato === 'Planta' ? 'Caja Grande' : 'Caja Estándar'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Foto del trabajador (1/3 del espacio - lado derecho) */}
              <div className="flex flex-col items-end justify-start">
                <div className="w-full aspect-square max-w-[300px] bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden mb-2">
                  <UserIcon className="w-32 h-32 text-gray-400" />
                  {/* Placeholder para foto del trabajador */}
                </div>
                <p className="text-sm text-gray-500 text-right font-medium">Foto del Trabajador</p>
              </div>
            </div>

            <div className={`rounded-lg p-4 mb-6 ${
              trabajadorActual.retirado 
                ? 'bg-red-50 border-2 border-red-300' 
                : 'bg-green-50 border-2 border-green-300'
            }`}>
              <div className="flex items-center gap-2 justify-center">
                {trabajadorActual.retirado ? (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-700 font-medium">
                      Beneficio ya retirado {trabajadorActual.fechaRetiro ? `el ${trabajadorActual.fechaRetiro}` : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-700 font-medium">
                      Beneficio disponible para retiro
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={() => startPackageScan()}
                    disabled={trabajadorActual.retirado || packageScanning}
                    className="flex-1 bg-[#0066A0] hover:bg-[#005f98] text-white h-12 font-medium"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Escanear Paquete
                  </Button>
                  <Button
                    onClick={() => {
                      setPackageCode('');
                      stopPackageScan();
                    }}
                    variant="outline"
                    className="h-12"
                  >
                    Cancelar Scan
                  </Button>
                </div>

                <div className="mb-3">
                  <label className="text-gray-600 block mb-2 text-sm">Código de barras (opcional)</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ingresa el número del código de barras"
                      value={packageCode}
                      onChange={(e) => setPackageCode(e.target.value)}
                      onKeyPress={(e) => { if (e.key === 'Enter') { /* permitir confirmar al presionar Enter */ } }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => { /* mantener packageCode tal cual, campo ya enlazado */ }}
                      variant="outline"
                      className="h-12"
                    >
                      Usar
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">También puedes escanear la caja o ingresar el número manualmente.</p>
                </div>

                <Button
                  onClick={confirmarEntrega}
                  disabled={trabajadorActual.retirado || !packageCode}
                  className="w-full bg-[#008C45] hover:bg-[#008C45]/90 text-white disabled:bg-gray-300 disabled:cursor-not-allowed h-12 font-medium"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Entrega
                </Button>

                {packageCode && (
                  <p className="mt-2 text-sm text-gray-700">Código paquete: <span className="font-mono">{packageCode}</span></p>
                )}
                <div className="mt-3">
                  <Button
                    onClick={() => setShowIncidenciaModalG(true)}
                    variant="outline"
                    className="w-full border-[#D32027] text-[#D32027] hover:bg-[#D32027]/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reportar Incidencia
                  </Button>
                </div>
                {/* Área de escaneo para paquete (se muestra solo cuando packageScanning=true) */}
                {packageScanning && (
                  <div className="space-y-4 mt-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={packageVideoRef}
                        className="w-full h-64 object-cover"
                        playsInline
                      />
                      <div className="absolute inset-0 border-4 border-[#0066A0] m-12 rounded-lg pointer-events-none"></div>
                    </div>
                    <Button
                      onClick={() => stopPackageScan()}
                      variant="outline"
                      className="w-full"
                    >
                      Detener Escaneo de Paquete
                    </Button>
                  </div>
                )}
              </div>
              <Button
                onClick={() => {
                  setTrabajadorActual(null);
                  setRutInput('');
                  setMensaje(null);
                }}
                variant="outline"
                className="border-gray-400 text-gray-700 hover:bg-gray-100 h-12"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Última Entrega */}
        {/* Modal de Incidencias (Guardia) */}
        {showIncidenciaModalG && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#D32027]"><AlertTriangle className="w-5 h-5 inline-block mr-2"/> Reportar Incidencia</h3>
                <button onClick={() => { setShowIncidenciaModalG(false); resetIncidenciaFormG(); }} className="text-gray-500 hover:text-gray-700">Cerrar</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Tipo de incidencia</label>
                  <select value={incidenciaTipoG} onChange={e => setIncidenciaTipoG(e.target.value)} className="w-full border rounded px-3 py-2">
                    <option value="rota">Producto roto</option>
                    <option value="mojada">Producto mojado</option>
                    <option value="faltante">Producto faltante</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Descripción</label>
                  <textarea value={incidenciaDescG} onChange={e => setIncidenciaDescG(e.target.value)} rows={4} className="w-full border rounded px-3 py-2" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Archivos (opcional)</label>
                  <input type="file" accept="image/*,video/*" multiple onChange={e => handleAdjuntosChangeG(e.target.files)} />
                  {incidenciaAdjuntosG.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {incidenciaAdjuntosG.map((src, idx) => (
                        <div key={idx} className="relative">
                          <img src={src} alt={`adjunto-${idx}`} className="max-h-28 rounded w-full object-cover" />
                          <button type="button" onClick={() => setIncidenciaAdjuntosG(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-sm">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button onClick={() => { setShowIncidenciaModalG(false); resetIncidenciaFormG(); }} variant="outline" className="border-gray-300 text-gray-700">Cancelar</Button>
                  <Button onClick={submitIncidenciaG} className="bg-[#D32027] text-white" disabled={submittingIncidenciaG}>
                    {submittingIncidenciaG ? 'Enviando...' : 'Reportar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {ultimaEntrega && (
          <Card className="p-4 bg-white rounded-xl border-2 border-tmluc-gris-claro shadow-sm">
            <p className="text-gray-900">
              <span className="text-gray-600">Última entrega:</span> {ultimaEntrega}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
