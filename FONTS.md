# Font Configuration

## Overview
This application uses **Inter** as its primary font for both the user interface and PDF generation.

## Why Inter?

1. **Open Source**: Inter is released under the SIL Open Font License, making it completely free for commercial use with no copyright concerns.

2. **Romanian Character Support**: Full support for Romanian diacritics (ă, â, î, ș, ț).

3. **Consistency**: The same font is used in:
   - Web interface
   - PDF previews  
   - Exported PDF documents

4. **Professional Quality**: Inter is specifically designed for user interfaces and screen display, making it highly readable.

## How It Works

### In the Browser
- Inter is loaded from Google Fonts (see `index.html`)
- Applied via CSS to all UI elements
- Used in formatting previews

### In PDF Generation
- Inter font files (.ttf) are bundled with the application
- Located in `src/assets/fonts/`
- Embedded in PDFs using `pdf-lib` with `fontkit`
- Ensures consistent appearance between preview and export

## Font Selection

The formatting panel shows "Inter" as the only available font. This is intentional to:
- Avoid copyright issues with proprietary fonts
- Ensure preview matches PDF output exactly
- Maintain consistent Romanian character rendering

## Technical Details

### Files
- `src/assets/fonts/Inter-Regular.ttf` - Regular weight
- `src/assets/fonts/Inter-Bold.ttf` - Bold weight
- `src/lib/pdf-fonts.ts` - Font loading utilities

### PDF Embedding
The app registers `fontkit` with `pdf-lib` to enable custom font embedding:
```typescript
pdfDoc.registerFontkit(fontkit);
const font = await pdfDoc.embedFont(interRegularBytes);
```

This ensures Inter fonts are embedded in all generated PDFs, making them viewable on any system.

