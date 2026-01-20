import { useState, useEffect } from 'react';
import { User, Shield, Settings } from 'lucide-react';
// LandingPage removed as initial view; app opens on role selection
import LoginForm from './components/LoginForm';
import EmpleadoDashboard from './components/EmpleadoDashboard';
import GuardiaDashboard from './components/GuardiaDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ThemeLogo from './components/ThemeLogo';

type Role = 'empleado' | 'guardia' | 'admin' | null;
type View = 'roles' | 'login';

function AppContent() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<View>('roles');
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [rutLogin, setRutLogin] = useState<string>('');
  // Estado para login de guardia
  const [guardUser, setGuardUser] = useState<string>('');
  const [guardPass, setGuardPass] = useState<string>('');
  const [guardError, setGuardError] = useState<string>('');

  // Inicializar guardias y empleados demo en localStorage si no existen
  useEffect(() => {
    const guardiasStorage = localStorage.getItem('guardias');
    if (!guardiasStorage) {
      const guardiasIniciales = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          rut: '15123456-7',
          usuario: '15123456-7',
          password: '15123456',
          activo: true,
          fechaCreacion: new Date().toLocaleDateString('es-CL'),
        },
        {
          id: 2,
          nombre: 'Pedro González',
          rut: '16234567-8',
          usuario: '16234567-8',
          password: '16234567',
          activo: true,
          fechaCreacion: new Date().toLocaleDateString('es-CL'),
        },
      ];
      localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));
    }

    // Inicializar empleados demo si no hay nómina cargada
    const empleadosStorage = localStorage.getItem('empleados');
    if (!empleadosStorage) {
      const empleadosDemo = [
        {
          id: 1,
          nombre: 'María Fernández',
          rut: '16.234.567-8',
          correo: 'maria.fernandez@demo.cl',
          tipoContrato: 'Planta',
          rol: 'Personal de Base',
          localidad: 'Valparaíso',
          beneficio: 'Caja de Navidad',
          estado: 'Pendiente',
          fechaRetiro: null,
        },
        {
          id: 2,
          nombre: 'Carlos Muñoz',
          rut: '18.345.678-9',
          correo: 'carlos.munoz@demo.cl',
          tipoContrato: 'Plazo Fijo',
          rol: 'Oficina',
          localidad: 'Casablanca',
          beneficio: 'Caja de Navidad',
          estado: 'Pendiente',
          fechaRetiro: null,
        },
        {
          id: 3,
          nombre: 'Ana Silva',
          rut: '17.456.789-0',
          correo: 'ana.silva@demo.cl',
          tipoContrato: 'Planta',
          rol: 'Supervisión',
          localidad: 'Valparaíso',
          beneficio: 'Caja de Navidad',
          estado: 'Pendiente',
          fechaRetiro: null,
        },
      ];
      localStorage.setItem('empleados', JSON.stringify(empleadosDemo));
    }
  }, []);

  // Landing page removed; app opens on role selection by default

  // Login solo por RUT para Empleado
  if (currentView === 'login' && selectedRole === 'empleado' && !isAuthenticated) {
    const normalizeRut = (r: string) => (r || '').toString().replace(/[.\-]/g, '').toUpperCase();

    const handleEmpleadoLogin = () => {
      let lista: any[] = [];
      try {
        lista = JSON.parse(localStorage.getItem('empleados') || '[]');
      } catch {
        lista = [];
      }
      if (!rutLogin.trim()) {
        alert('Ingrese su RUT.');
        return;
      }
      const rutInputNorm = normalizeRut(rutLogin);
      const registro = lista.find((e) => normalizeRut(e.rut) === rutInputNorm);

      if (!registro) {
        alert('RUT no encontrado en la nómina cargada. Contacte al administrador.');
        return;
      }

      setIsAuthenticated(true);
      setUserData(registro);
    };

    // Preparar RUTs demo a mostrar bajo la nota (últimos 3 empleados de la nómina cargada)
    const demoRuts: { nombre: string; rut: string }[] = (() => {
      try {
        const raw = localStorage.getItem('empleados');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) {
            return list.slice(-3).map((e: any) => ({
              nombre: e.nombre || 'Sin nombre',
              rut: e.rut
            }));
          }
        }
      } catch {}
      // Fallback vacío si no hay nómina
      return [];
    })();

    return (
      <div className="min-h-screen bg-tmluc-split flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card-tmluc">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#E12019]/10 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-[#E12019]" />
              </div>
              <h1 className="text-tmluc-rojo text-2xl font-semibold mb-2">Acceso Empleado</h1>
              <p className="text-tmluc-texto text-center">Ingresa tu RUT para ver tu información y generar tu código QR</p>
            </div>

            <label className="text-gray-600 block mb-2">RUT</label>
            <Input
              type="text"
              placeholder="Ej: 16.234.567-8"
              value={rutLogin}
              onChange={(e) => setRutLogin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmpleadoLogin()}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleEmpleadoLogin} className="bg-[#D32027] hover:bg-[#D32027]/90 text-white flex-1">
                Ingresar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRutLogin('');
                  setCurrentView('roles');
                  setSelectedRole(null);
                }}
                className="flex-1"
              >
                ← Volver
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Nota: El RUT debe existir en la nómina cargada por el Administrador.
            </p>
            {/* RUTs Demo para pruebas */}
            {demoRuts.length > 0 && (
              <div className="mt-4 p-4 bg-tmluc-rojo-light rounded-lg border-2 border-tmluc-rojo">
                <p className="text-sm font-bold text-tmluc-rojo mb-3">👥 Empleados Disponibles para Demo</p>
                <div className="space-y-2">
                  {demoRuts.map((d, i) => (
                    <div key={d.rut + i} className="bg-tmluc-blanco p-2 rounded-lg border border-tmluc-rojo shadow-sm">
                      <p className="text-sm text-tmluc-texto">
                        <strong className="text-tmluc-texto">{d.nombre}</strong>
                      </p>
                      <p className="text-sm text-tmluc-texto">
                        <strong>RUT:</strong>{' '}
                        <code className="bg-tmluc-gris-claro px-2 py-1 rounded text-tmluc-rojo font-bold">{d.rut}</code>
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-tmluc-rojo mt-3 font-medium">
                  ✓ Ingresa uno de estos RUTs arriba para ver la información del empleado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login dedicado para Guardia (usuario + contraseña, validados contra Gestión de Guardias)
  if (currentView === 'login' && selectedRole === 'guardia' && !isAuthenticated) {
    const normalizeUser = (s: string) => (s || '').toString().replace(/\./g, '').trim();
    const sameUser = (a: string, b: string) =>
      normalizeUser(a) === normalizeUser(b) ||
      normalizeUser(a).replace(/-/g, '') === normalizeUser(b).replace(/-/g, '');

    const handleGuardLogin = () => {
      setGuardError('');
      let guardias: any[] = [];
      try {
        guardias = JSON.parse(localStorage.getItem('guardias') || '[]');
      } catch {
        guardias = [];
      }

      if (!guardUser.trim() || !guardPass.trim()) {
        setGuardError('Ingrese usuario (RUT) y contraseña.');
        return;
      }

      const registro = guardias.find(
        (g) => sameUser(g.usuario, guardUser) || sameUser(g.rut, guardUser)
      );

      if (!registro) {
        setGuardError('Guardia no enrolado. Contacte al administrador.');
        return;
      }
      if (!registro.activo) {
        setGuardError('Usuario de guardia inactivo. Contacte al administrador.');
        return;
      }

      if (registro.password !== guardPass.trim()) {
        setGuardError('Contraseña incorrecta.');
        return;
      }

      setIsAuthenticated(true);
      setUserData(registro);
    };

    // Preparar guardias demo (activos de localStorage)
    const demoGuardias: { nombre: string; usuario: string; password: string }[] = (() => {
      try {
        const raw = localStorage.getItem('guardias');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) {
            return list.filter((g: any) => g.activo).slice(0, 3).map((g: any) => ({
              nombre: g.nombre || 'Sin nombre',
              usuario: g.usuario || g.rut,
              password: g.password
            }));
          }
        }
      } catch {}
      return [];
    })();

    return (
      <div className="min-h-screen bg-tmluc-split flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card-tmluc space-y-3">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#008C45]/10 flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-[#008C45]" />
              </div>
              <h1 className="text-[#008C45] text-2xl font-semibold mb-2">Acceso Guardia</h1>
              <p className="text-tmluc-texto text-center">Ingrese sus credenciales de Gestión de Guardias</p>
            </div>

            <div>
              <label className="text-gray-600 block mb-2">Usuario (RUT)</label>
              <Input
                type="text"
                placeholder="Ej: 15123456-7"
                value={guardUser}
                onChange={(e) => setGuardUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuardLogin()}
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-2">Contraseña</label>
              <Input
                type="password"
                placeholder="Contraseña"
                value={guardPass}
                onChange={(e) => setGuardPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuardLogin()}
              />
            </div>

            {guardError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                {guardError}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleGuardLogin} className="bg-[#008C45] hover:bg-[#008C45]/90 text-white flex-1">
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGuardUser('');
                  setGuardPass('');
                  setGuardError('');
                  setCurrentView('roles');
                  setSelectedRole(null);
                }}
                className="flex-1"
              >
                Volver
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Formato sugerido: Usuario = RUT sin puntos (con guión). La contraseña es la configurada en Gestión de Guardias.
            </p>

            {/* Guardias Demo */}
            {demoGuardias.length > 0 && (
              <div className="mt-4 p-4 bg-tmluc-rojo-light rounded-lg border-2 border-tmluc-rojo">
                <p className="text-sm font-bold text-tmluc-rojo mb-3">👮 Guardias Disponibles para Demo</p>
                <div className="space-y-2">
                  {demoGuardias.map((g, i) => (
                    <div key={g.usuario + i} className="bg-tmluc-blanco p-2 rounded-lg border border-tmluc-rojo shadow-sm">
                      <p className="text-sm text-tmluc-texto">
                        <strong className="text-tmluc-texto">{g.nombre}</strong>
                      </p>
                      <p className="text-sm text-tmluc-texto">
                        <strong>Usuario:</strong>{' '}
                        <code className="bg-tmluc-gris-claro px-2 py-1 rounded text-tmluc-rojo font-bold">{g.usuario}</code>
                      </p>
                      <p className="text-sm text-tmluc-texto">
                        <strong>Contraseña:</strong>{' '}
                        <code className="bg-tmluc-gris-claro px-2 py-1 rounded text-tmluc-rojo font-bold">{g.password}</code>
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-tmluc-rojo mt-3 font-medium">
                  ✓ Usa una de estas credenciales para acceder al panel de guardia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show login form (se mantiene para admin; empleado/guardia ya tienen flujos dedicados)
  if (currentView === 'login' && selectedRole && !isAuthenticated) {
    return (
      <LoginForm
        role={selectedRole}
        onLoginSuccess={(data) => {
          // Solo Admin aquí; los otros roles ya se manejan arriba
          setIsAuthenticated(true);
          setUserData(data);
        }}
        onBack={() => {
          setCurrentView('roles');
          setSelectedRole(null);
        }}
      />
    );
  }

  // Show role-specific dashboards after authentication
  if (isAuthenticated && selectedRole === 'empleado') {
    return (
      <EmpleadoDashboard
        onBack={() => {
          setIsAuthenticated(false);
          setSelectedRole(null);
          setUserData(null);
          setCurrentView('roles');
        }}
        empleado={userData} // pasar registro real de la nómina
      />
    );
  }

  if (isAuthenticated && selectedRole === 'guardia') {
    return (
      <GuardiaDashboard
        guardia={userData} // pasar guardia autenticado
        onBack={() => {
          setIsAuthenticated(false);
          setSelectedRole(null);
          setUserData(null);
          setCurrentView('roles');
        }}
      />
    );
  }

  if (isAuthenticated && selectedRole === 'admin') {
    return (
      <AdminDashboard
        onBack={() => {
          setIsAuthenticated(false);
          setSelectedRole(null);
          setUserData(null);
          setCurrentView('roles');
        }}
      />
    );
  }

  // Show role selection
  return (
    <div className="min-h-screen bg-tmluc-split flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-center mb-12">
          <div className="card-tmluc max-w-2xl w-full text-center py-8">
            <div className="flex justify-center mb-6">
              <ThemeLogo className="h-24" />
            </div>
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
            >
              {theme.companyName || 'Sistema de Gestión de Beneficios'}
            </h1>
            <p className="text-tmluc-texto text-lg" style={{ fontFamily: theme.fontFamily }}>
              {theme.companySlogan || 'Tresmontes Lucchetti'}
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="card-tmluc mb-8">
          <h2 className="text-tmluc-rojo text-2xl font-semibold mb-6 text-center">Seleccione su Rol</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Empleado Card */}
            <button
              onClick={() => {
                setSelectedRole('empleado');
                setCurrentView('login');
              }}
              className="group relative bg-tmluc-blanco border-2 border-tmluc-gris-claro rounded-xl p-8 hover:border-tmluc-rojo hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-tmluc-rojo/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tmluc-rojo/20 transition-colors">
                <User className="w-10 h-10 text-tmluc-rojo" />
              </div>
              <h3 className="text-tmluc-rojo font-semibold text-lg mb-2">Usuario/Empleado</h3>
              <p className="text-tmluc-texto text-center text-sm">
                Consulta tus datos y genera tu código QR
              </p>
            </button>

            {/* Guardia Card */}
            <button
              onClick={() => {
                setSelectedRole('guardia');
                setCurrentView('login');
              }}
              className="group relative bg-tmluc-blanco border-2 border-tmluc-gris-claro rounded-xl p-8 hover:border-tmluc-rojo hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-tmluc-rojo/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tmluc-rojo/20 transition-colors">
                <Shield className="w-10 h-10 text-tmluc-rojo" />
              </div>
              <h3 className="text-tmluc-rojo font-semibold text-lg mb-2">Guardia</h3>
              <p className="text-tmluc-texto text-center text-sm">
                Valida y registra la entrega de beneficios
              </p>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => {
                setSelectedRole('admin');
                setCurrentView('login');
              }}
              className="group relative bg-tmluc-blanco border-2 border-tmluc-gris-claro rounded-xl p-8 hover:border-tmluc-rojo hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-tmluc-gris-claro rounded-full flex items-center justify-center mb-4 group-hover:bg-tmluc-rojo/10 transition-colors">
                <Settings className="w-10 h-10 text-tmluc-texto" />
              </div>
              <h3 className="text-tmluc-texto font-semibold text-lg mb-2">Administrador</h3>
              <p className="text-tmluc-texto text-center text-sm">
                Gestiona empleados y beneficios
              </p>
            </button>
          </div>
        </div>

        {/* Back Button removed — role selection is now the main page */}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
