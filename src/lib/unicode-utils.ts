// Utility functions for handling Romanian characters in PDF generation

/**
 * Converts Romanian characters to their closest ASCII equivalents for PDF compatibility
 * This is a fallback when proper UTF-8 fonts are not available
 */
export function transliterateRomanian(text: string): string {
  const transliterationMap: Record<string, string> = {
    'ă': 'a',
    'â': 'a', 
    'î': 'i',
    'ș': 's',
    'ț': 't',
    'ş': 's', // Old Romanian character variant
    'ţ': 't', // Old Romanian character variant
    'Ă': 'A',
    'Â': 'A',
    'Î': 'I', 
    'Ș': 'S',
    'Ț': 'T',
    'Ş': 'S', // Old Romanian character variant
    'Ţ': 'T'  // Old Romanian character variant
  };

  return text.replace(/[ăâîșțşţĂÂÎȘȚŞŢ]/g, (char) => transliterationMap[char] || char);
}

/**
 * Checks if a string contains Romanian characters
 */
export function hasRomanianCharacters(text: string): boolean {
  return /[ăâîșțşţĂÂÎȘȚŞŢ]/.test(text);
}

/**
 * Safely processes text for PDF generation, handling Romanian characters
 * PDF-lib has encoding issues with Romanian diacritics, so we need to transliterate
 */
export function processTextForPDF(text: string, useTransliteration: boolean = true): string {
  if (!text) return '';
  
  // Always transliterate Romanian characters for PDF compatibility
  // PDF-lib WinAnsi encoding cannot handle Romanian diacritics
  if (hasRomanianCharacters(text)) {
    return transliterateRomanian(text);
  }
  
  return text;
}

/**
 * Checks if the current environment supports Romanian diacritics in PDF generation
 * PDF-lib has encoding limitations that prevent direct diacritics support
 */
export function supportsRomanianDiacritics(): boolean {
  // PDF-lib uses WinAnsi encoding which doesn't support Romanian diacritics
  // We need to transliterate them for PDF compatibility
  return false;
}

/**
 * Gets a user-friendly message about diacritics support
 */
export function getDiacriticsSupportMessage(): string {
  return 'Caracterele românești (ă, â, î, ș, ț) vor fi convertite în echivalente ASCII în PDF-ul exportat pentru compatibilitate.';
}
