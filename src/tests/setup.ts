import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Setup localStorage mock data before each test
beforeEach(() => {
  // Guardias iniciales
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
      nombre: 'Guardia Inactivo',
      rut: '14000000-0',
      usuario: '14000000-0',
      password: 'correcta',
      activo: false,
      fechaCreacion: new Date().toLocaleDateString('es-CL'),
    },
  ];
  localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));

  // Empleados demo
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
      nombre: 'Carlos Muñoz Retirado',
      rut: '17.654.321-K',
      correo: 'carlos.munoz@demo.cl',
      tipoContrato: 'Plazo Fijo',
      rol: 'Oficina',
      localidad: 'Casablanca',
      beneficio: 'Caja de Navidad',
      estado: 'Retirado',
      fechaRetiro: '15/12/2024 14:32',
    },
  ];
  localStorage.setItem('empleados', JSON.stringify(empleadosDemo));
});
