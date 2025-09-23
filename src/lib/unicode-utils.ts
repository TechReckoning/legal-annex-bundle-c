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
 */
export function processTextForPDF(text: string, useTransliteration: boolean = true): string {
  if (!text) return '';
  
  if (useTransliteration && hasRomanianCharacters(text)) {
    return transliterateRomanian(text);
  }
  
  return text;
}
