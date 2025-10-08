# Code Cleanup Summary

## Date: October 8, 2025

### Legacy Code Removed

Successfully removed **302 lines** of unused HTML-based PDF generation code from `src/lib/pdf-generator.ts`.

### What Was Removed:

1. **`generateCoverPageHTML()`** - HTML template generator for cover pages
2. **`generateOpisHTML()`** - HTML template generator for annex lists  
3. **`generatePreviewDataURL()`** - HTML preview image generator
4. **`htmlToPDFPage()`** - HTML to PDF converter using html2canvas

### Why These Were Removed:

- **Never Called**: None of these functions were imported or used anywhere in the codebase
- **Legacy Approach**: They used HTML + html2canvas for PDF generation, which had font limitations
- **Superseded**: Replaced by direct PDF generation using `pdf-lib` with embedded fonts:
  - `createCoverPagePDF()` - for cover pages
  - `createOpisPDF()` - for annex lists
  - Direct text/image drawing with Inter font

### Packages Removed:

- `@types/html2canvas` - Type definitions (no longer needed)

### Benefits:

1. **Cleaner Codebase**: Reduced from 1091 to 789 lines in pdf-generator.ts
2. **No Font Confusion**: Eliminated code that referenced Arial and other fonts
3. **Better Maintainability**: Only one PDF generation approach (pdf-lib)
4. **Consistent Fonts**: Everything now uses Inter with proper embedding
5. **Smaller Bundle**: Removed unused dependencies

### Current PDF Generation Stack:

✅ **pdf-lib** - Core PDF library  
✅ **@pdf-lib/fontkit** - Font embedding support  
✅ **Inter fonts** - Open-source TTF files (Regular & Bold)  
✅ Direct PDF generation - No HTML intermediate step

### Files Modified:

- `src/lib/pdf-generator.ts` - Removed 302 lines of legacy code
- `src/vite-env.d.ts` - Updated comments
- `package.json` - Removed @types/html2canvas dependency

### Result:

The codebase is now cleaner, with a single, consistent approach to PDF generation using embedded Inter fonts. All PDF exports use the same font stack as the UI previews.

