/// <reference types="vite/client" />

declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// Add missing type declarations
type NoInfer<T> = [T][T extends any ? 0 : never];

// Extend global window interface for spark runtime
declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => string;
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>;
      user: () => Promise<{
        avatarUrl: string;
        email: string;
        id: string;
        isOwner: boolean;
        login: string;
      }>;
      kv: {
        keys: () => Promise<string[]>;
        get: <T>(key: string) => Promise<T | undefined>;
        set: <T>(key: string, value: T) => Promise<void>;
        delete: (key: string) => Promise<void>;
      };
    };
  }
}

// Module declarations for external libraries
// Note: @types/html2canvas is now installed, so no manual declaration needed

declare module 'pdf-lib' {
  export interface PDFDocument {
    addPage(page?: PDFPage | [number, number]): PDFPage;
    getPages(): PDFPage[];
    getPageCount(): number;
    embedFont(font: any): Promise<PDFFont>;
    embedPng(png: string | Uint8Array | ArrayBuffer): Promise<PDFImage>;
    embedJpg(jpg: string | Uint8Array | ArrayBuffer): Promise<PDFImage>;
    save(): Promise<Uint8Array>;
    saveAsBase64(): Promise<string>;
    copy(): Promise<PDFDocument>;
    copyPages(sourceDoc: PDFDocument, pageIndices: number[]): Promise<PDFPage[]>;
    getPageIndices(): number[];
  }

  export interface PDFPage {
    getSize(): { width: number; height: number };
    drawText(text: string, options?: {
      x?: number;
      y?: number;
      size?: number;
      font?: PDFFont;
      color?: RGB;
      opacity?: number;
      rotate?: number;
    }): void;
    drawImage(image: PDFImage, options?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      opacity?: number;
      rotate?: number;
    }): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    drawLine(options?: {
      start: { x: number; y: number };
      end: { x: number; y: number };
      thickness?: number;
      color?: RGB;
      opacity?: number;
    }): void;
    drawRectangle(options?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      borderColor?: RGB;
      borderWidth?: number;
      color?: RGB;
      opacity?: number;
    }): void;
  }

  export interface PDFFont {
    name: string;
    widthOfTextAtSize(text: string, size: number): number;
  }

  export interface PDFImage {
    width: number;
    height: number;
  }

  export interface RGB {
    red: number;
    green: number;
    blue: number;
  }

  export const PDFDocument: {
    create(): Promise<PDFDocument>;
    load(pdf: string | Uint8Array | ArrayBuffer): Promise<PDFDocument>;
  };

  export const StandardFonts: {
    Helvetica: string;
    HelveticaBold: string;
    HelveticaOblique: string;
    HelveticaBoldOblique: string;
    TimesRoman: string;
    TimesRomanBold: string;
    TimesRomanItalic: string;
    TimesRomanBoldItalic: string;
    Courier: string;
    CourierBold: string;
    CourierOblique: string;
    CourierBoldOblique: string;
    Symbol: string;
    ZapfDingbats: string;
  };

  export function rgb(red: number, green: number, blue: number): RGB;
}