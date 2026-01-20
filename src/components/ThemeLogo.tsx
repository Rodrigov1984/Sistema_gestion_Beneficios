import { useTheme } from '../context/ThemeContext';
import logoDefault from '../assets/logo.png';

interface ThemeLogoProps {
  className?: string;
  fallbackSrc?: string;
}

/**
 * Componente de logo que usa el tema personalizado.
 * Si hay un logo configurado en el tema, lo muestra.
 * Si no, muestra el logo por defecto de la empresa.
 */
export default function ThemeLogo({ className = '', fallbackSrc }: ThemeLogoProps) {
  const { theme } = useTheme();
  
  const logoSrc = theme.logoUrl || fallbackSrc || logoDefault;
  
  return (
    <img
      src={logoSrc}
      alt="Logo de la Empresa"
      className={`object-contain ${className}`}
      style={{
        width: theme.logoUrl ? theme.logoWidth : undefined,
        height: theme.logoUrl ? theme.logoHeight : undefined,
        maxWidth: '100%',
      }}
    />
  );
}
