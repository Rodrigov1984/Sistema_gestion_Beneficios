import { useState, useRef } from 'react';
import { 
  Palette, 
  Type, 
  Image, 
  Square, 
  RotateCcw,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  AlertCircle,
  Box,
  Layers,
  Move,
  Zap,
  Code
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useTheme, ThemeConfig, defaultTheme } from '../context/ThemeContext';

interface ThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultExpanded = false }: SectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <Card className="bg-white border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D32027]/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          {children}
        </div>
      )}
    </Card>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-700 min-w-[140px]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 text-sm font-mono"
        />
      </div>
    </div>
  );
}

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}

function SliderInput({ label, value, onChange, min, max, unit = 'px' }: SliderInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-700 min-w-[140px]">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 w-16 text-right">
          {value}{unit}
        </span>
      </div>
    </div>
  );
}

const FONT_OPTIONS = [
  { label: 'Inter (Por defecto)', value: 'Inter, system-ui, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Lato', value: 'Lato, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { label: 'Nunito', value: 'Nunito, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
];

const FONT_WEIGHT_OPTIONS = [
  { label: 'Delgada (300)', value: '300' },
  { label: 'Normal (400)', value: '400' },
  { label: 'Media (500)', value: '500' },
  { label: 'Semi-negrita (600)', value: '600' },
  { label: 'Negrita (700)', value: '700' },
  { label: 'Extra-negrita (800)', value: '800' },
];

export default function ThemeEditor({ isOpen, onClose }: ThemeEditorProps) {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalUpdate = (updates: Partial<ThemeConfig>) => {
    setLocalTheme(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateTheme(localTheme);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de restablecer todos los valores por defecto?')) {
      setLocalTheme(defaultTheme);
      resetTheme();
      setHasChanges(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleLocalUpdate({ logoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    handleLocalUpdate({ logoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#D32027] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6" />
            <h2 className="text-xl font-bold">Editor de Personalización</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Logo */}
          <CollapsibleSection
            title="Logo de la Empresa"
            icon={<Image className="w-4 h-4 text-[#D32027]" />}
            defaultExpanded={true}
          >
            <div className="space-y-4 pt-4">
              <div className="flex flex-col items-center gap-4">
                {localTheme.logoUrl ? (
                  <div className="relative">
                    <img
                      src={localTheme.logoUrl}
                      alt="Logo"
                      style={{
                        width: localTheme.logoWidth,
                        height: localTheme.logoHeight,
                        objectFit: 'contain'
                      }}
                      className="border border-gray-200 rounded-lg bg-white p-2"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="w-40 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:border-[#D32027] hover:text-[#D32027] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Image className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-sm">Subir Logo</span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {!localTheme.logoUrl && (
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm"
                  >
                    Seleccionar imagen
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <SliderInput
                  label="Ancho"
                  value={localTheme.logoWidth}
                  onChange={(v) => handleLocalUpdate({ logoWidth: v })}
                  min={50}
                  max={300}
                />
                <SliderInput
                  label="Alto"
                  value={localTheme.logoHeight}
                  onChange={(v) => handleLocalUpdate({ logoHeight: v })}
                  min={30}
                  max={150}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Colores Principales */}
          <CollapsibleSection
            title="Colores Principales"
            icon={<Palette className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <ColorPicker
                label="Color Primario"
                value={localTheme.primaryColor}
                onChange={(v) => handleLocalUpdate({ primaryColor: v })}
              />
              <ColorPicker
                label="Color Secundario"
                value={localTheme.secondaryColor}
                onChange={(v) => handleLocalUpdate({ secondaryColor: v })}
              />
              <ColorPicker
                label="Color de Acento"
                value={localTheme.accentColor}
                onChange={(v) => handleLocalUpdate({ accentColor: v })}
              />
              <ColorPicker
                label="Fondo General"
                value={localTheme.backgroundColor}
                onChange={(v) => handleLocalUpdate({ backgroundColor: v })}
              />
              <ColorPicker
                label="Fondo de Tarjetas"
                value={localTheme.cardBackgroundColor}
                onChange={(v) => handleLocalUpdate({ cardBackgroundColor: v })}
              />
            </div>
          </CollapsibleSection>

          {/* Colores de Texto */}
          <CollapsibleSection
            title="Colores de Texto"
            icon={<Type className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <ColorPicker
                label="Texto Principal"
                value={localTheme.textColor}
                onChange={(v) => handleLocalUpdate({ textColor: v })}
              />
              <ColorPicker
                label="Texto Secundario"
                value={localTheme.textMutedColor}
                onChange={(v) => handleLocalUpdate({ textMutedColor: v })}
              />
            </div>
          </CollapsibleSection>

          {/* Tipografía */}
          <CollapsibleSection
            title="Tipografía"
            icon={<Type className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700 min-w-[140px]">Familia de Fuente</label>
                <select
                  value={localTheme.fontFamily}
                  onChange={(e) => handleLocalUpdate({ fontFamily: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D32027]/50"
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <SliderInput
                label="Tamaño de Texto Base"
                value={localTheme.fontSize}
                onChange={(v) => handleLocalUpdate({ fontSize: v })}
                min={12}
                max={24}
              />
              <SliderInput
                label="Tamaño de Títulos"
                value={localTheme.headingFontSize}
                onChange={(v) => handleLocalUpdate({ headingFontSize: v })}
                min={16}
                max={48}
              />
              
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700 min-w-[140px]">Peso de Texto</label>
                <select
                  value={localTheme.fontWeight || '400'}
                  onChange={(e) => handleLocalUpdate({ fontWeight: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D32027]/50"
                >
                  {FONT_WEIGHT_OPTIONS.map(weight => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700 min-w-[140px]">Peso de Títulos</label>
                <select
                  value={localTheme.headingFontWeight || '700'}
                  onChange={(e) => handleLocalUpdate({ headingFontWeight: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D32027]/50"
                >
                  {FONT_WEIGHT_OPTIONS.map(weight => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Vista previa de tipografía */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                <h3 
                  style={{ 
                    fontFamily: localTheme.fontFamily, 
                    fontSize: `${localTheme.headingFontSize}px`,
                    fontWeight: localTheme.headingFontWeight || '700',
                    color: localTheme.textColor
                  }}
                >
                  Título de Ejemplo
                </h3>
                <p 
                  style={{ 
                    fontFamily: localTheme.fontFamily, 
                    fontSize: `${localTheme.fontSize}px`,
                    fontWeight: localTheme.fontWeight || '400',
                    color: localTheme.textColor
                  }}
                >
                  Este es un texto de ejemplo para ver cómo se verá el contenido.
                </p>
                <p 
                  style={{ 
                    fontFamily: localTheme.fontFamily, 
                    fontSize: `${localTheme.fontSize * 0.875}px`,
                    color: localTheme.textMutedColor
                  }}
                >
                  Texto secundario o de menor importancia.
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Botones */}
          <CollapsibleSection
            title="Estilo de Botones"
            icon={<Square className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <SliderInput
                label="Radio de Bordes"
                value={localTheme.buttonBorderRadius}
                onChange={(v) => handleLocalUpdate({ buttonBorderRadius: v })}
                min={0}
                max={24}
              />
              <SliderInput
                label="Padding Horizontal"
                value={localTheme.buttonPaddingX}
                onChange={(v) => handleLocalUpdate({ buttonPaddingX: v })}
                min={8}
                max={40}
              />
              <SliderInput
                label="Padding Vertical"
                value={localTheme.buttonPaddingY}
                onChange={(v) => handleLocalUpdate({ buttonPaddingY: v })}
                min={4}
                max={24}
              />
              <SliderInput
                label="Tamaño de Fuente"
                value={localTheme.buttonFontSize}
                onChange={(v) => handleLocalUpdate({ buttonFontSize: v })}
                min={10}
                max={20}
              />
              
              {/* Vista previa de botones */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">Vista previa:</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    style={{
                      backgroundColor: localTheme.primaryColor,
                      color: '#ffffff',
                      borderRadius: `${localTheme.buttonBorderRadius}px`,
                      padding: `${localTheme.buttonPaddingY}px ${localTheme.buttonPaddingX}px`,
                      fontSize: `${localTheme.buttonFontSize}px`,
                      fontFamily: localTheme.fontFamily,
                    }}
                  >
                    Botón Primario
                  </button>
                  <button
                    style={{
                      backgroundColor: localTheme.secondaryColor,
                      color: '#ffffff',
                      borderRadius: `${localTheme.buttonBorderRadius}px`,
                      padding: `${localTheme.buttonPaddingY}px ${localTheme.buttonPaddingX}px`,
                      fontSize: `${localTheme.buttonFontSize}px`,
                      fontFamily: localTheme.fontFamily,
                    }}
                  >
                    Botón Secundario
                  </button>
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      color: localTheme.primaryColor,
                      border: `1px solid ${localTheme.primaryColor}`,
                      borderRadius: `${localTheme.buttonBorderRadius}px`,
                      padding: `${localTheme.buttonPaddingY}px ${localTheme.buttonPaddingX}px`,
                      fontSize: `${localTheme.buttonFontSize}px`,
                      fontFamily: localTheme.fontFamily,
                    }}
                  >
                    Botón Outline
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Fondos Especiales */}
          <CollapsibleSection
            title="Fondos de Secciones"
            icon={<Palette className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <ColorPicker
                label="Fondo de Cabecera"
                value={localTheme.headerBackgroundColor}
                onChange={(v) => handleLocalUpdate({ headerBackgroundColor: v })}
              />
              <ColorPicker
                label="Fondo del Sidebar"
                value={localTheme.sidebarBackgroundColor}
                onChange={(v) => handleLocalUpdate({ sidebarBackgroundColor: v })}
              />
              <ColorPicker
                label="Fondo del Pie"
                value={localTheme.footerBackgroundColor}
                onChange={(v) => handleLocalUpdate({ footerBackgroundColor: v })}
              />
              
              {/* Imagen de fondo del header */}
              <div className="pt-4 border-t border-gray-200">
                <label className="text-sm text-gray-700 block mb-2">Imagen de Fondo (Cabecera)</label>
                <Input
                  type="text"
                  value={localTheme.headerBackgroundImage || ''}
                  onChange={(e) => handleLocalUpdate({ headerBackgroundImage: e.target.value })}
                  placeholder="URL de la imagen (opcional)"
                  className="w-full text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Ingresa una URL de imagen para usarla como fondo</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Información de Empresa */}
          <CollapsibleSection
            title="Información de Empresa"
            icon={<Building2 className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700 min-w-[140px]">Nombre de Empresa</label>
                <Input
                  type="text"
                  value={localTheme.companyName || ''}
                  onChange={(e) => handleLocalUpdate({ companyName: e.target.value })}
                  placeholder="Mi Empresa S.A."
                  className="flex-1 text-sm"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700 min-w-[140px]">Slogan</label>
                <Input
                  type="text"
                  value={localTheme.companySlogan || ''}
                  onChange={(e) => handleLocalUpdate({ companySlogan: e.target.value })}
                  placeholder="Trabajando para ti"
                  className="flex-1 text-sm"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Colores de Estado */}
          <CollapsibleSection
            title="Colores de Estado"
            icon={<AlertCircle className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <ColorPicker
                label="Color de Éxito"
                value={localTheme.successColor || '#22c55e'}
                onChange={(v) => handleLocalUpdate({ successColor: v })}
              />
              <ColorPicker
                label="Color de Advertencia"
                value={localTheme.warningColor || '#f59e0b'}
                onChange={(v) => handleLocalUpdate({ warningColor: v })}
              />
              <ColorPicker
                label="Color de Error"
                value={localTheme.errorColor || '#ef4444'}
                onChange={(v) => handleLocalUpdate({ errorColor: v })}
              />
              <ColorPicker
                label="Color de Información"
                value={localTheme.infoColor || '#3b82f6'}
                onChange={(v) => handleLocalUpdate({ infoColor: v })}
              />
              
              {/* Vista previa de estados */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">Vista previa:</p>
                <div className="flex flex-wrap gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: localTheme.successColor || '#22c55e' }}
                  >
                    Éxito
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: localTheme.warningColor || '#f59e0b' }}
                  >
                    Advertencia
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: localTheme.errorColor || '#ef4444' }}
                  >
                    Error
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: localTheme.infoColor || '#3b82f6' }}
                  >
                    Info
                  </span>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Bordes */}
          <CollapsibleSection
            title="Bordes y Esquinas"
            icon={<Box className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <SliderInput
                label="Grosor de Bordes"
                value={localTheme.borderWidth || 1}
                onChange={(v) => handleLocalUpdate({ borderWidth: v })}
                min={0}
                max={5}
              />
              <ColorPicker
                label="Color de Bordes"
                value={localTheme.borderColor || '#e5e7eb'}
                onChange={(v) => handleLocalUpdate({ borderColor: v })}
              />
              <SliderInput
                label="Radio General"
                value={localTheme.borderRadius || 8}
                onChange={(v) => handleLocalUpdate({ borderRadius: v })}
                min={0}
                max={24}
              />
              
              {/* Vista previa de bordes */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">Vista previa:</p>
                <div 
                  className="p-4 bg-white"
                  style={{
                    border: `${localTheme.borderWidth || 1}px solid ${localTheme.borderColor || '#e5e7eb'}`,
                    borderRadius: `${localTheme.borderRadius || 8}px`
                  }}
                >
                  <p className="text-sm text-gray-700">Ejemplo de tarjeta con bordes personalizados</p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Sombras */}
          <CollapsibleSection
            title="Sombras"
            icon={<Layers className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <SliderInput
                label="Intensidad"
                value={localTheme.shadowIntensity || 10}
                onChange={(v) => handleLocalUpdate({ shadowIntensity: v })}
                min={0}
                max={50}
                unit="%"
              />
              <ColorPicker
                label="Color de Sombra"
                value={localTheme.shadowColor || '#000000'}
                onChange={(v) => handleLocalUpdate({ shadowColor: v })}
              />
              
              {/* Vista previa de sombras */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">Vista previa:</p>
                <div 
                  className="p-4 bg-white rounded-lg"
                  style={{
                    boxShadow: `0 4px 6px -1px color-mix(in srgb, ${localTheme.shadowColor || '#000000'} ${localTheme.shadowIntensity || 10}%, transparent)`
                  }}
                >
                  <p className="text-sm text-gray-700">Ejemplo de tarjeta con sombra personalizada</p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Espaciado */}
          <CollapsibleSection
            title="Espaciado y Dimensiones"
            icon={<Move className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <SliderInput
                label="Unidad de Espaciado"
                value={localTheme.spacingUnit || 4}
                onChange={(v) => handleLocalUpdate({ spacingUnit: v })}
                min={2}
                max={12}
              />
              <SliderInput
                label="Ancho Máx. Contenedor"
                value={localTheme.containerMaxWidth || 1280}
                onChange={(v) => handleLocalUpdate({ containerMaxWidth: v })}
                min={800}
                max={1920}
              />
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">
                  La unidad de espaciado multiplica los valores de padding y margin.
                </p>
                <p className="text-sm text-gray-500">
                  Ancho máximo del contenedor: <strong>{localTheme.containerMaxWidth || 1280}px</strong>
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Animaciones */}
          <CollapsibleSection
            title="Animaciones y Transiciones"
            icon={<Zap className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <SliderInput
                label="Velocidad de Transición"
                value={localTheme.transitionSpeed || 200}
                onChange={(v) => handleLocalUpdate({ transitionSpeed: v })}
                min={0}
                max={1000}
                unit="ms"
              />
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-gray-700 min-w-[140px]">Habilitar Animaciones</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localTheme.enableAnimations !== false}
                    onChange={(e) => handleLocalUpdate({ enableAnimations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D32027]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D32027]"></div>
                </label>
              </div>
              
              {/* Vista previa de animación */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-4">Vista previa (pasa el cursor):</p>
                <button
                  className="px-4 py-2 bg-[#D32027] text-white rounded-lg"
                  style={{
                    transition: localTheme.enableAnimations !== false 
                      ? `all ${localTheme.transitionSpeed || 200}ms ease` 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (localTheme.enableAnimations !== false) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Botón con animación
                </button>
              </div>
            </div>
          </CollapsibleSection>

          {/* CSS Personalizado */}
          <CollapsibleSection
            title="CSS Personalizado"
            icon={<Code className="w-4 h-4 text-[#D32027]" />}
          >
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Código CSS Adicional</label>
                <textarea
                  value={localTheme.customCSS || ''}
                  onChange={(e) => handleLocalUpdate({ customCSS: e.target.value })}
                  placeholder={`/* Ejemplo de CSS personalizado */\n.mi-clase {\n  color: #333;\n}\n\n/* Ocultar un elemento */\n.elemento-oculto {\n  display: none;\n}`}
                  className="w-full h-40 px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32027]/50 resize-none"
                />
                <p className="text-xs text-gray-500">
                  ⚠️ Avanzado: Agrega CSS personalizado que se aplicará globalmente. Ten cuidado con los estilos que agregues.
                </p>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-gray-600 hover:text-red-600 hover:border-red-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#D32027] hover:bg-[#B91C22] text-white"
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
