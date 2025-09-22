import { FormattingOptions, AnnexItem } from '@/types';
import { getDisplayTitle } from '@/lib/utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import html2canvas from 'html2canvas';

// Helper function for color parsing (used in multiple places)
const parseColor = (colorStr: string) => {
  if (!colorStr || typeof colorStr !== 'string') {
    return rgb(0, 0, 0);
  }
  try {
    const hex = colorStr.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  } catch (error) {
    console.warn('Invalid color string:', colorStr);
    return rgb(0, 0, 0);
  }
};

export interface CoverPageConfig {
  annexNumber: number;
  title: string;
  formatting: FormattingOptions;
}

export interface OpisTableConfig {
  annexes: Array<{ number: number; title: string }>;
  formatting: FormattingOptions;
}

export interface PDFExportConfig {
  annexes: AnnexItem[];
  opisFormatting: FormattingOptions;
  coverFormatting: FormattingOptions;
}

export const generateCoverPageHTML = (config: CoverPageConfig): string => {
  const { annexNumber, title, formatting } = config;
  if (!config || !formatting) {
    throw new Error('Invalid cover page configuration');
  }
  
  const headingText = formatting.headingFormat?.replace('{n}', annexNumber.toString()) || `ANEXA ${annexNumber}`;
  const theme = formatting.colorTheme || { 
    primary: '#1a1a1a', 
    secondary: '#333333', 
    text: '#1a1a1a', 
    background: '#ffffff' 
  };
  const logoUrl = formatting.logoFile ? URL.createObjectURL(formatting.logoFile) : '';
  
  const logoStyles = formatting.logoFile ? `
    .logo {
      width: ${formatting.logoSize || 120}px;
      height: auto;
      max-height: ${formatting.logoSize || 120}px;
      object-fit: contain;
      margin: ${formatting.logoPosition === 'top' ? '0 0 40px 0' : formatting.logoPosition === 'bottom' ? '40px 0 0 0' : '0 20px'};
    }
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: ${formatting.logoPosition === 'top' || formatting.logoPosition === 'bottom' ? 'column' : 'row'};
      ${formatting.logoPosition === 'left' ? 'flex-direction: row;' : ''}
      ${formatting.logoPosition === 'right' ? 'flex-direction: row-reverse;' : ''}
    }
    .content-wrapper {
      ${formatting.logoPosition === 'left' || formatting.logoPosition === 'right' ? 'text-align: center; flex: 1;' : ''}
    }
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          margin: ${formatting.marginTop}mm ${formatting.marginRight}mm ${formatting.marginBottom}mm ${formatting.marginLeft}mm;
          size: A4;
        }
        body {
          font-family: ${formatting.fontFamily}, Arial, sans-serif;
          text-align: ${formatting.alignment};
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: ${theme?.background || '#ffffff'};
          color: ${theme?.text || '#1a1a1a'};
        }
        .heading {
          font-size: ${formatting.headingFontSize || 28}pt;
          font-weight: bold;
          margin-bottom: 40px;
          color: ${theme?.primary || '#1a1a1a'};
        }
        .title {
          font-size: ${formatting.fontSize}pt;
          font-weight: ${formatting.bold ? 'bold' : 'normal'};
          color: ${theme?.secondary || '#333'};
          max-width: 80%;
          word-wrap: break-word;
          text-align: center;
        }
        ${logoStyles}
        ${formatting.showPageNumbers ? `
        .page-number {
          position: fixed;
          bottom: 20mm;
          width: 100%;
          text-align: center;
          font-size: 10pt;
          color: ${theme?.text || '#666'};
        }
        ` : ''}
      </style>
    </head>
    <body>
      <div class="${formatting.logoFile ? 'logo-container' : ''}">
        ${formatting.logoFile && (formatting.logoPosition === 'top' || !formatting.logoPosition) ? 
          `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
        ${formatting.logoFile && formatting.logoPosition === 'left' ? 
          `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
        <div class="content-wrapper">
          <div class="heading">${headingText}</div>
          <div class="title">${title}</div>
        </div>
        ${formatting.logoFile && formatting.logoPosition === 'right' ? 
          `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
        ${formatting.logoFile && formatting.logoPosition === 'bottom' ? 
          `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
      </div>
      ${formatting.showPageNumbers ? '<div class="page-number">1</div>' : ''}
    </body>
    </html>
  `;
};

export const generateOpisHTML = (config: OpisTableConfig): string => {
  const { annexes, formatting } = config;
  if (!config || !formatting || !annexes) {
    throw new Error('Invalid Opis configuration');
  }

  const theme = formatting.colorTheme || { 
    primary: '#1a1a1a', 
    secondary: '#333333', 
    text: '#1a1a1a', 
    background: '#ffffff',
    accent: '#f5f5f5'
  };
  
  const tableRows = annexes.map(annex => `
    <tr>
      <td class="number-cell">Anexa nr. ${annex.number}</td>
      <td class="description-cell">${annex.title}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          margin: ${formatting.marginTop}mm ${formatting.marginRight}mm ${formatting.marginBottom}mm ${formatting.marginLeft}mm;
          size: A4;
        }
        body {
          font-family: ${formatting.fontFamily}, Arial, sans-serif;
          font-size: ${formatting.fontSize}pt;
          font-weight: ${formatting.bold ? 'bold' : 'normal'};
          margin: 0;
          padding: 20px 0;
          background-color: ${theme?.background || '#ffffff'};
          color: ${theme?.text || '#1a1a1a'};
        }
        .title {
          text-align: center;
          font-size: ${formatting.fontSize * 1.5}pt;
          font-weight: bold;
          margin-bottom: 30px;
          color: ${theme?.primary || '#1a1a1a'};
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid ${theme?.secondary || '#333'};
          padding: 8px 12px;
          text-align: ${formatting.alignment};
          vertical-align: top;
        }
        th {
          background-color: ${theme?.accent || '#f5f5f5'};
          font-weight: bold;
          color: ${theme?.text || '#1a1a1a'};
        }
        .number-cell {
          width: 30%;
          text-align: center;
        }
        .description-cell {
          width: 70%;
        }
        ${formatting.showPageNumbers ? `
        .page-number {
          position: fixed;
          bottom: 20mm;
          width: 100%;
          text-align: center;
          font-size: 10pt;
          color: ${theme?.text || '#666'};
        }
        ` : ''}
      </style>
    </head>
    <body>
      <div class="title">OPIS</div>
      <table>
        <thead>
          <tr>
            <th>Nr. crt.</th>
            <th>Descriere</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      ${formatting.showPageNumbers ? '<div class="page-number">1</div>' : ''}
    </body>
    </html>
  `;
};

export const generatePreviewDataURL = (html: string): Promise<string> => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    iframe.style.background = 'white';
    iframe.style.transform = 'scale(0.3)';
    iframe.style.transformOrigin = 'top left';
    iframe.style.position = 'absolute';
    iframe.style.left = '-1000px';
    
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      setTimeout(() => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve('');
            return;
          }
          
          canvas.width = 210 * 3;
          canvas.height = 297 * 3;
          
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const dataURL = canvas.toDataURL('image/png');
          document.body.removeChild(iframe);
          resolve(dataURL);
        } catch (error) {
          document.body.removeChild(iframe);
          resolve('');
        }
      }, 1000);
    };
    
    iframe.srcdoc = html;
  });
};

const htmlToPDFPage = async (html: string): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm';
    container.style.backgroundColor = 'white';
    
    document.body.appendChild(container);
    
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(container, {
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          background: '#ffffff',
          useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Create a simple PDF page with the image
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
        
        // Convert base64 to bytes
        const imageBytes = Uint8Array.from(atob(imgData.split(',')[1]), c => c.charCodeAt(0));
        const image = await pdfDoc.embedPng(imageBytes);
        
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: 595.28,
          height: 841.89,
        });
        
        const pdfBytes = await pdfDoc.save();
        
        document.body.removeChild(container);
        resolve(pdfBytes);
      } catch (error) {
        document.body.removeChild(container);
        reject(error);
      }
    }, 100);
  });
};

const createCoverPagePDF = async (config: CoverPageConfig): Promise<Uint8Array> => {
  if (!config || !config.formatting) {
    throw new Error('Invalid cover page configuration');
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { annexNumber, title, formatting } = config;
  const headingText = formatting.headingFormat?.replace('{n}', annexNumber.toString()) || `ANEXA ${annexNumber}`;
  const theme = formatting.colorTheme || { 
    primary: '#1a1a1a', 
    secondary: '#333333', 
    text: '#1a1a1a', 
    background: '#ffffff' 
  };
  
  const pageHeight = 841.89;
  const pageWidth = 595.28;
  
  // Parse theme colors or use defaults
  const parseColor = (colorStr: string) => {
    const hex = colorStr.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  };
  
  const primaryColor = theme?.primary ? parseColor(theme.primary) : rgb(0.1, 0.1, 0.1);
  const secondaryColor = theme?.secondary ? parseColor(theme.secondary) : rgb(0.2, 0.2, 0.2);
  const backgroundColor = theme?.background ? parseColor(theme.background) : rgb(1, 1, 1);
  
  // Set background color if not white
  if (theme?.background && theme.background !== '#ffffff') {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: backgroundColor,
    });
  }
  
  // Calculate center positions
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  let logoImage: any = null;
  let logoHeight = 0;
  const logoSize = formatting.logoSize || 120;
  
  // Embed logo if provided
  if (formatting.logoFile) {
    try {
      const logoBytes = await readFileAsBytes(formatting.logoFile);
      const fileType = formatting.logoFile.type;
      
      if (fileType.includes('png')) {
        logoImage = await pdfDoc.embedPng(logoBytes);
      } else if (fileType.includes('jpg') || fileType.includes('jpeg')) {
        logoImage = await pdfDoc.embedJpg(logoBytes);
      }
      
      if (logoImage) {
        const logoAspectRatio = logoImage.width / logoImage.height;
        const logoWidth = logoSize;
        logoHeight = logoSize / logoAspectRatio;
      }
    } catch (error) {
      console.warn('Could not embed logo:', error);
    }
  }
  
  // Calculate layout based on logo position
  let contentStartY = centerY;
  let logoX = centerX;
  let logoY = centerY;
  
  if (logoImage) {
    const logoPosition = formatting.logoPosition || 'top';
    
    switch (logoPosition) {
      case 'top':
        logoX = centerX - (logoSize / 2);
        logoY = centerY + 80;
        contentStartY = centerY - 20;
        break;
      case 'bottom':
        logoX = centerX - (logoSize / 2);
        logoY = centerY - 80 - logoHeight;
        contentStartY = centerY + 20;
        break;
      case 'left':
        logoX = centerX - 150;
        logoY = centerY - (logoHeight / 2);
        break;
      case 'right':
        logoX = centerX + 50;
        logoY = centerY - (logoHeight / 2);
        break;
    }
    
    // Draw logo
    page.drawImage(logoImage, {
      x: logoX,
      y: logoY,
      width: logoSize,
      height: logoHeight,
    });
  }
  
  // Draw heading
  const headingSize = formatting.headingFontSize || 28;
  const headingWidth = (boldFont as any).widthOfTextAtSize(headingText, headingSize);
  
  page.drawText(headingText, {
    x: centerX - (headingWidth / 2),
    y: contentStartY + 50,
    size: headingSize,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw title
  const titleSize = formatting.fontSize || 16;
  const titleFont = formatting.bold ? boldFont : font;
  
  // Handle long titles by wrapping text
  const maxWidth = pageWidth * 0.8;
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = (titleFont as any).widthOfTextAtSize(testLine, titleSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Draw title lines
  const lineHeight = titleSize * 1.2;
  const totalTitleHeight = lines.length * lineHeight;
  let startY = contentStartY - 30 - (totalTitleHeight / 2);
  
  for (const line of lines) {
    const lineWidth = (titleFont as any).widthOfTextAtSize(line, titleSize);
    page.drawText(line, {
      x: centerX - (lineWidth / 2),
      y: startY,
      size: titleSize,
      font: titleFont,
      color: secondaryColor,
    });
    startY -= lineHeight;
  }
  
  return await pdfDoc.save();
};

const readFileAsBytes = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

const createOpisPDF = async (config: OpisTableConfig): Promise<Uint8Array> => {
  if (!config || !config.formatting || !config.annexes) {
    throw new Error('Invalid Opis configuration');
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { annexes, formatting } = config;
  const theme = formatting.colorTheme || { 
    primary: '#1a1a1a', 
    secondary: '#333333', 
    text: '#1a1a1a', 
    background: '#ffffff',
    accent: '#f5f5f5'
  };
  
  // Parse theme colors or use defaults
  const primaryColor = theme?.primary ? parseColor(theme.primary) : rgb(0.1, 0.1, 0.1);
  const secondaryColor = theme?.secondary ? parseColor(theme.secondary) : rgb(0.2, 0.2, 0.2);
  const accentColor = theme?.accent ? parseColor(theme.accent) : rgb(0.95, 0.95, 0.95);
  const textColor = theme?.text ? parseColor(theme.text) : rgb(0.1, 0.1, 0.1);
  const backgroundColor = theme?.background ? parseColor(theme.background) : rgb(1, 1, 1);
  
  const pageHeight = 841.89;
  const pageWidth = 595.28;
  const margin = 50;
  
  // Set background color if not white
  if (theme?.background && theme.background !== '#ffffff') {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: backgroundColor,
    });
  }
  
  // Title
  const titleText = 'OPIS';
  const titleSize = (formatting.fontSize || 12) * 1.5;
  const titleWidth = (boldFont as any).widthOfTextAtSize(titleText, titleSize);
  
  page.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2,
    y: pageHeight - margin - 50,
    size: titleSize,
    font: boldFont,
    color: primaryColor,
  });
  
  // Table
  const tableStartY = pageHeight - margin - 100;
  const rowHeight = 25;
  const col1Width = pageWidth * 0.3;
  const col2Width = pageWidth * 0.6;
  const tableWidth = col1Width + col2Width;
  const tableStartX = (pageWidth - tableWidth) / 2;
  
  // Table headers
  const headerY = tableStartY;
  
  // Header background
  page.drawRectangle({
    x: tableStartX,
    y: headerY - rowHeight,
    width: tableWidth,
    height: rowHeight,
    color: accentColor,
  });
  
  // Header borders
  page.drawRectangle({
    x: tableStartX,
    y: headerY - rowHeight,
    width: col1Width,
    height: rowHeight,
    borderColor: secondaryColor,
    borderWidth: 1,
  });
  
  page.drawRectangle({
    x: tableStartX + col1Width,
    y: headerY - rowHeight,
    width: col2Width,
    height: rowHeight,
    borderColor: secondaryColor,
    borderWidth: 1,
  });
  
  // Header text
  page.drawText('Nr. crt.', {
    x: tableStartX + 10,
    y: headerY - rowHeight + 8,
    size: formatting.fontSize || 12,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Descriere', {
    x: tableStartX + col1Width + 10,
    y: headerY - rowHeight + 8,
    size: formatting.fontSize || 12,
    font: boldFont,
    color: textColor,
  });
  
  // Table rows
  let currentY = headerY - rowHeight;
  
  for (const annex of annexes) {
    currentY -= rowHeight;
    
    // Row borders
    page.drawRectangle({
      x: tableStartX,
      y: currentY,
      width: col1Width,
      height: rowHeight,
      borderColor: secondaryColor,
      borderWidth: 1,
    });
    
    page.drawRectangle({
      x: tableStartX + col1Width,
      y: currentY,
      width: col2Width,
      height: rowHeight,
      borderColor: secondaryColor,
      borderWidth: 1,
    });
    
    // Row text
    const numberText = `Anexa nr. ${annex.number}`;
    page.drawText(numberText, {
      x: tableStartX + 10,
      y: currentY + 8,
      size: formatting.fontSize || 12,
      font: font,
      color: textColor,
    });
    
    // Truncate long titles
    let titleText = annex.title;
    const maxTitleWidth = col2Width - 20;
    const titleSize = formatting.fontSize || 12;
    
    while ((font as any).widthOfTextAtSize(titleText, titleSize) > maxTitleWidth && titleText.length > 3) {
      titleText = titleText.slice(0, -4) + '...';
    }
    
    page.drawText(titleText, {
      x: tableStartX + col1Width + 10,
      y: currentY + 8,
      size: titleSize,
      font: font,
      color: textColor,
    });
  }
  
  return await pdfDoc.save();
};

const readPDFAsUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const exportToPDF = async (config: PDFExportConfig): Promise<void> => {
  try {
    const { annexes, opisFormatting, coverFormatting } = config;
    
    // Validate that we have annexes with documents
    if (!annexes || annexes.length === 0) {
      throw new Error('Nu există anexe pentru export');
    }
    
    const annexesWithDocuments = annexes.filter(annex => annex.documents && annex.documents.length > 0);
    if (annexesWithDocuments.length === 0) {
      throw new Error('Nu există documente în anexe pentru export');
    }
    
    // Create the final PDF document
    const finalPDF = await PDFDocument.create();
    
    // Generate and add Opis (Table of Contents)
    const opisConfig: OpisTableConfig = {
      annexes: annexesWithDocuments.map(annex => ({
        number: annex.annexNumber,
        title: getDisplayTitle(annex)
      })),
      formatting: opisFormatting
    };
    
    try {
      const opisPDFBytes = await createOpisPDF(opisConfig);
      const opisPDF = await PDFDocument.load(opisPDFBytes);
      const opisPages = await finalPDF.copyPages(opisPDF, opisPDF.getPageIndices());
      // Add pages to the document
      for (const page of opisPages) {
        finalPDF.addPage(page);
      }
    } catch (error) {
      console.error('Error creating Opis:', error);
      throw new Error('Eroare la crearea cuprinsului (Opis)');
    }
    
    // For each annex with documents, add cover page and documents
    for (let annexIndex = 0; annexIndex < annexesWithDocuments.length; annexIndex++) {
      const annex = annexesWithDocuments[annexIndex];
      
      try {
        // Generate and add cover page
        const coverConfig: CoverPageConfig = {
          annexNumber: annex.annexNumber,
          title: getDisplayTitle(annex),
          formatting: coverFormatting
        };
        
        const coverPDFBytes = await createCoverPagePDF(coverConfig);
        const coverPDF = await PDFDocument.load(coverPDFBytes);
        const coverPages = await finalPDF.copyPages(coverPDF, coverPDF.getPageIndices());
        // Add pages to the document
        for (const page of coverPages) {
          finalPDF.addPage(page);
        }
        
        // Add all documents in this annex
        const documents = annex.documents || [];
        for (let docIndex = 0; docIndex < documents.length; docIndex++) {
          const document = documents[docIndex];
          
          // Add a document separator page if there are multiple documents and this isn't the first one
          if (docIndex > 0 && documents.length > 1) {
            try {
              const separatorPage = finalPDF.addPage([595.28, 841.89]);
              const font = await finalPDF.embedFont(StandardFonts.Helvetica);
              const boldFont = await finalPDF.embedFont(StandardFonts.HelveticaBold);
              
              // Draw separator info with better styling
              const theme = coverFormatting.colorTheme;
              const primaryColor = theme?.primary ? parseColor(theme.primary) : rgb(0.3, 0.3, 0.3);
              const secondaryColor = theme?.secondary ? parseColor(theme.secondary) : rgb(0.5, 0.5, 0.5);
              
              separatorPage.drawText(`ANEXA ${annex.annexNumber} - DOCUMENT ${docIndex + 1}`, {
                x: 50,
                y: 750,
                size: 16,
                font: boldFont,
                color: primaryColor,
              });
              
              separatorPage.drawText(document.autoTitle, {
                x: 50,
                y: 720,
                size: 12,
                font: font,
                color: secondaryColor,
              });
              
              // Draw a decorative line
              separatorPage.drawRectangle({
                x: 50,
                y: 700,
                width: 495,
                height: 1,
                color: rgb(0.8, 0.8, 0.8),
              });
              
              // Add document index info
              separatorPage.drawText(`Document ${docIndex + 1} din ${documents.length}`, {
                x: 50,
                y: 680,
                size: 10,
                font: font,
                color: rgb(0.6, 0.6, 0.6),
              });
              
            } catch (separatorError) {
              console.warn('Could not create separator page:', separatorError);
              // Continue without separator page
            }
          }
          
          // Add the actual document
          if (document.file) {
            try {
              const originalPDFBytes = await readPDFAsUint8Array(document.file);
              const originalPDF = await PDFDocument.load(originalPDFBytes);
              const originalPages = await finalPDF.copyPages(originalPDF, originalPDF.getPageIndices());
              // Add pages to the document
              for (const page of originalPages) {
                finalPDF.addPage(page);
              }
              
            } catch (pdfError) {
              console.warn(`Could not process PDF file "${document.file.name}":`, pdfError);
              
              // Add error page for this document
              try {
                const errorPage = finalPDF.addPage([595.28, 841.89]);
                const font = await finalPDF.embedFont(StandardFonts.Helvetica);
                const boldFont = await finalPDF.embedFont(StandardFonts.HelveticaBold);
                
                errorPage.drawText('Eroare la încărcarea documentului PDF:', {
                  x: 50,
                  y: 750,
                  size: 14,
                  font: boldFont,
                  color: rgb(0.8, 0, 0),
                });
                
                errorPage.drawText(document.file.name, {
                  x: 50,
                  y: 720,
                  size: 12,
                  font: font,
                  color: rgb(0.3, 0.3, 0.3),
                });
                
                errorPage.drawText('Verificați dacă fișierul este un PDF valid și nu este corupt.', {
                  x: 50,
                  y: 690,
                  size: 10,
                  font: font,
                  color: rgb(0.5, 0.5, 0.5),
                });
                
              } catch (errorPageError) {
                console.error('Could not create error page:', errorPageError);
              }
            }
          } else {
            console.warn(`Document ${document.id} has no file attached`);
          }
        }
        
      } catch (annexError) {
        console.error(`Error processing annex ${annex.annexNumber}:`, annexError);
        
        // Add error page for this entire annex
        try {
          const errorPage = finalPDF.addPage([595.28, 841.89]);
          const font = await finalPDF.embedFont(StandardFonts.Helvetica);
          const boldFont = await finalPDF.embedFont(StandardFonts.HelveticaBold);
          
          errorPage.drawText(`Eroare la procesarea Anexei ${annex.annexNumber}`, {
            x: 50,
            y: 750,
            size: 14,
            font: boldFont,
            color: rgb(0.8, 0, 0),
          });
          
          errorPage.drawText(getDisplayTitle(annex), {
            x: 50,
            y: 720,
            size: 12,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
          
          errorPage.drawText('Anexa a fost omisă din cauza unei erori.', {
            x: 50,
            y: 690,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5),
          });
          
        } catch (errorPageError) {
          console.error('Could not create annex error page:', errorPageError);
        }
      }
    }
    
    // Check if we have any pages in the final PDF
    if (finalPDF.getPageCount() === 0) {
      throw new Error('Nu s-au putut genera pagini pentru PDF');
    }
    
    // Download the final PDF
    const pdfBytes = await finalPDF.save();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `bundle-anexe-${timestamp}.pdf`;
    
    // Create download link
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error(`Eroare la exportarea PDF-ului: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`);
  }
};