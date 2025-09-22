export interface AnnexItem {
  id: string;
  annexNumber: number;
  sourceFilePath: string;
  autoTitle: string;
  userTitle?: string;
  file?: File;
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
}

export interface ProjectModel {
  annexes: AnnexItem[];
  opisFormatting: FormattingOptions;
  coverFormatting: FormattingOptions;
  projectVersion: string;
}

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
};

export const defaultCoverFormattingOptions: FormattingOptions = {
  ...defaultFormattingOptions,
  alignment: 'center',
  headingFormat: 'ANEXA {n}',
  headingFontSize: 28,
  fontSize: 16,
};