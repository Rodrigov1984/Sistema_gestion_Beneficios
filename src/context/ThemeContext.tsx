import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeConfig {
  // Información de la empresa
  companyName: string;
  companySlogan: string;
  
  // Logo
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  
  // Colores principales
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  
  // Colores de estado
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  
  // Colores de texto
  textColor: string;
  textMutedColor: string;
  
  // Fuentes
  fontFamily: string;
  fontSize: number;
  headingFontSize: number;
  fontWeight: string;
  headingFontWeight: string;
  
  // Botones
  buttonBorderRadius: number;
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonFontSize: number;
  
  // Bordes
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  
  // Sombras
  shadowIntensity: number;
  shadowColor: string;
  
  // Espaciado
  spacingUnit: number;
  containerMaxWidth: number;
  
  // Animaciones
  transitionSpeed: number;
  enableAnimations: boolean;
  
  // Fondos especiales
  headerBackgroundColor: string;
  headerBackgroundImage: string;
  sidebarBackgroundColor: string;
  footerBackgroundColor: string;
  
  // CSS personalizado
  customCSS: string;
}

const defaultTheme: ThemeConfig = {
  // Información de la empresa
  companyName: 'Sistema de Gestión de Beneficios',
  companySlogan: 'Tresmontes Lucchetti',
  
  // Logo
  logoUrl: '',
  logoWidth: 150,
  logoHeight: 50,
  
  // Colores principales
  primaryColor: '#D32027',
  secondaryColor: '#21808D',
  accentColor: '#5E5240',
  backgroundColor: '#ffffff',
  cardBackgroundColor: '#ffffff',
  
  // Colores de estado
  successColor: '#008C45',
  warningColor: '#F59E0B',
  errorColor: '#DC2626',
  infoColor: '#3B82F6',
  
  // Colores de texto
  textColor: '#030213',
  textMutedColor: '#717182',
  
  // Fuentes
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 16,
  headingFontSize: 24,
  fontWeight: '400',
  headingFontWeight: '600',
  
  // Botones
  buttonBorderRadius: 8,
  buttonPaddingX: 16,
  buttonPaddingY: 8,
  buttonFontSize: 14,
  
  // Bordes
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 8,
  
  // Sombras
  shadowIntensity: 10,
  shadowColor: '#000000',
  
  // Espaciado
  spacingUnit: 4,
  containerMaxWidth: 1280,
  
  // Animaciones
  transitionSpeed: 200,
  enableAnimations: true,
  
  // Fondos especiales
  headerBackgroundColor: '#21808D',
  headerBackgroundImage: '',
  sidebarBackgroundColor: '#f8f9fa',
  footerBackgroundColor: '#5E5240',
  
  // CSS personalizado
  customCSS: '',
};

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  applyThemeToDOM: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme-config';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return { ...defaultTheme, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore parse errors
    }
    return defaultTheme;
  });

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...updates };
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
      } catch {
        // Ignore storage errors
      }
      return newTheme;
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const applyThemeToDOM = () => {
    const root = document.documentElement;
    
    // Colores principales
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-card-bg', theme.cardBackgroundColor);
    
    // Colores de texto
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-text-muted', theme.textMutedColor);
    
    // Fuentes
    root.style.setProperty('--theme-font-family', theme.fontFamily);
    root.style.setProperty('--theme-font-size', `${theme.fontSize}px`);
    root.style.setProperty('--theme-heading-size', `${theme.headingFontSize}px`);
    
    // Botones
    root.style.setProperty('--theme-btn-radius', `${theme.buttonBorderRadius}px`);
    root.style.setProperty('--theme-btn-px', `${theme.buttonPaddingX}px`);
    root.style.setProperty('--theme-btn-py', `${theme.buttonPaddingY}px`);
    root.style.setProperty('--theme-btn-font-size', `${theme.buttonFontSize}px`);
    
    // Fondos especiales
    root.style.setProperty('--theme-header-bg', theme.headerBackgroundColor);
    root.style.setProperty('--theme-sidebar-bg', theme.sidebarBackgroundColor);
    root.style.setProperty('--theme-footer-bg', theme.footerBackgroundColor);
    
    // Logo dimensions
    root.style.setProperty('--theme-logo-width', `${theme.logoWidth}px`);
    root.style.setProperty('--theme-logo-height', `${theme.logoHeight}px`);
  };

  // Aplicar tema al DOM cuando cambie
  useEffect(() => {
    const root = document.documentElement;
    
    // Colores principales
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-card-bg', theme.cardBackgroundColor);
    
    // Colores de estado
    root.style.setProperty('--theme-success', theme.successColor);
    root.style.setProperty('--theme-warning', theme.warningColor);
    root.style.setProperty('--theme-error', theme.errorColor);
    root.style.setProperty('--theme-info', theme.infoColor);
    
    // Colores de texto
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-text-muted', theme.textMutedColor);
    
    // Fuentes
    root.style.setProperty('--theme-font-family', theme.fontFamily);
    root.style.setProperty('--theme-font-size', `${theme.fontSize}px`);
    root.style.setProperty('--theme-heading-size', `${theme.headingFontSize}px`);
    root.style.setProperty('--theme-font-weight', theme.fontWeight.toString());
    root.style.setProperty('--theme-heading-weight', theme.headingFontWeight.toString());
    
    // Botones
    root.style.setProperty('--theme-btn-radius', `${theme.buttonBorderRadius}px`);
    root.style.setProperty('--theme-btn-px', `${theme.buttonPaddingX}px`);
    root.style.setProperty('--theme-btn-py', `${theme.buttonPaddingY}px`);
    root.style.setProperty('--theme-btn-font-size', `${theme.buttonFontSize}px`);
    
    // Bordes
    root.style.setProperty('--theme-border-width', `${theme.borderWidth}px`);
    root.style.setProperty('--theme-border-color', theme.borderColor);
    root.style.setProperty('--theme-border-radius', `${theme.borderRadius}px`);
    
    // Sombras
    root.style.setProperty('--theme-shadow-intensity', `${theme.shadowIntensity}%`);
    root.style.setProperty('--theme-shadow-color', theme.shadowColor);
    root.style.setProperty('--theme-shadow', `0 4px 6px -1px color-mix(in srgb, ${theme.shadowColor} ${theme.shadowIntensity}%, transparent)`);
    
    // Espaciado
    root.style.setProperty('--theme-spacing', `${theme.spacingUnit}px`);
    root.style.setProperty('--theme-container-max', `${theme.containerMaxWidth}px`);
    
    // Animaciones
    root.style.setProperty('--theme-transition', `${theme.transitionSpeed}ms`);
    if (!theme.enableAnimations) {
      root.style.setProperty('--theme-transition', '0ms');
    }
    
    // Fondos especiales
    root.style.setProperty('--theme-header-bg', theme.headerBackgroundColor);
    root.style.setProperty('--theme-header-image', theme.headerBackgroundImage ? `url(${theme.headerBackgroundImage})` : 'none');
    root.style.setProperty('--theme-sidebar-bg', theme.sidebarBackgroundColor);
    root.style.setProperty('--theme-footer-bg', theme.footerBackgroundColor);
    
    // Logo dimensions
    root.style.setProperty('--theme-logo-width', `${theme.logoWidth}px`);
    root.style.setProperty('--theme-logo-height', `${theme.logoHeight}px`);
    
    // También actualizar las variables corporativas de TMLUC para consistencia
    root.style.setProperty('--tmluc-rojo', theme.primaryColor);
    root.style.setProperty('--tmluc-verde', theme.successColor);
    root.style.setProperty('--tmluc-texto', theme.textColor);
    
    // Actualizar también las variables de Tailwind/sistema
    root.style.setProperty('--destructive', theme.errorColor);
    root.style.setProperty('--primary', theme.primaryColor);
    
    // Aplicar CSS personalizado
    let customStyleTag = document.getElementById('theme-custom-css');
    if (!customStyleTag) {
      customStyleTag = document.createElement('style');
      customStyleTag.id = 'theme-custom-css';
      document.head.appendChild(customStyleTag);
    }
    customStyleTag.textContent = theme.customCSS || '';
    
    console.log('Theme applied:', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, applyThemeToDOM }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { defaultTheme };
