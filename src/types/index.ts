export interface DocumentItem {
  id: string;
  sourceFilePath: string;
  autoTitle: string;
  file?: File;
}

export interface AnnexItem {
  id: string;
  annexNumber: number;
  userTitle?: string;
  documents: DocumentItem[];
}

export interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface FormattingOptions {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  alignment: 'left' | 'center' | 'right';
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  showPageNumbers: boolean;
  headingFormat?: string;
  headingFontSize?: number;
  logoPath?: string;
  logoFile?: File;
  logoSize?: number;
  logoPosition?: 'top' | 'bottom' | 'left' | 'right';
  colorTheme?: ColorTheme;
  useCustomColors?: boolean;
  addStamp?: boolean;
  stampText?: string;
  stampPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  stampFontSize?: number;
}

export interface ProjectModel {
  annexes: AnnexItem[];
  opisFormatting: FormattingOptions;
  coverFormatting: FormattingOptions;
  projectVersion: string;
}

export const colorThemes: ColorTheme[] = [
  {
    name: 'Professional Blue',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    text: '#1f2937',
    background: '#ffffff'
  },
  {
    name: 'Classic Black',
    primary: '#000000',
    secondary: '#374151',
    accent: '#6b7280',
    text: '#111827',
    background: '#ffffff'
  },
  {
    name: 'Legal Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    text: '#1f2937',
    background: '#ffffff'
  },
  {
    name: 'Corporate Purple',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    text: '#1f2937',
    background: '#ffffff'
  },
  {
    name: 'Elegant Navy',
    primary: '#1e3a8a',
    secondary: '#3730a3',
    accent: '#6366f1',
    text: '#1f2937',
    background: '#ffffff'
  },
  {
    name: 'Formal Red & Black',
    primary: '#dc2626',
    secondary: '#1f2937',
    accent: '#dc2626',
    text: '#111827',
    background: '#ffffff'
  }
];

export const defaultFormattingOptions: FormattingOptions = {
  fontFamily: 'Inter',
  fontSize: 12,
  bold: false,
  alignment: 'left',
  marginTop: 20,
  marginRight: 20,
  marginBottom: 20,
  marginLeft: 20,
  showPageNumbers: true,
  logoSize: 80,
  logoPosition: 'top',
  colorTheme: colorThemes[0],
  useCustomColors: false,
  addStamp: false,
  stampText: 'Conform cu originalul',
  stampPosition: 'bottom-right',
  stampFontSize: 10,
};

export const defaultCoverFormattingOptions: FormattingOptions = {
  ...defaultFormattingOptions,
  alignment: 'center',
  headingFormat: 'ANEXA {n}',
  headingFontSize: 28,
  fontSize: 16,
  logoSize: 120,
  logoPosition: 'top',
  colorTheme: colorThemes[0],
  useCustomColors: false,
};