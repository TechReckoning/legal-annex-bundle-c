// Font loading utility for PDF generation
// Uses Inter font (open-source, SIL Open Font License) instead of proprietary Helvetica

import InterRegular from '@/assets/fonts/Inter-Regular.ttf';
import InterBold from '@/assets/fonts/Inter-Bold.ttf';

// Cache for loaded fonts
let interRegularBytes: Uint8Array | null = null;
let interBoldBytes: Uint8Array | null = null;

/**
 * Load Inter Regular font as Uint8Array for pdf-lib embedding
 */
export const loadInterRegular = async (): Promise<Uint8Array> => {
  if (interRegularBytes) {
    return interRegularBytes;
  }

  try {
    const response = await fetch(InterRegular);
    if (!response.ok) {
      throw new Error(`Failed to load Inter Regular font: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    interRegularBytes = new Uint8Array(arrayBuffer);
    return interRegularBytes;
  } catch (error) {
    console.error('Error loading Inter Regular font:', error);
    throw error;
  }
};

/**
 * Load Inter Bold font as Uint8Array for pdf-lib embedding
 */
export const loadInterBold = async (): Promise<Uint8Array> => {
  if (interBoldBytes) {
    return interBoldBytes;
  }

  try {
    const response = await fetch(InterBold);
    if (!response.ok) {
      throw new Error(`Failed to load Inter Bold font: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    interBoldBytes = new Uint8Array(arrayBuffer);
    return interBoldBytes;
  } catch (error) {
    console.error('Error loading Inter Bold font:', error);
    throw error;
  }
};

/**
 * Preload both fonts to avoid delays during PDF generation
 */
export const preloadFonts = async (): Promise<void> => {
  try {
    await Promise.all([
      loadInterRegular(),
      loadInterBold()
    ]);
    console.log('PDF fonts preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload PDF fonts:', error);
  }
};

