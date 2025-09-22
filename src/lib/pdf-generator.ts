import { FormattingOptions, AnnexItem } from '@/types';
import { getDisplayTitle } from '@/lib/utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import html2canvas from 'html2canvas';

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
  const headingText = formatting.headingFormat?.replace('{n}', annexNumber.toString()) || `ANEXA ${annexNumber}`;
  
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
        }
        .heading {
          font-size: ${formatting.headingFontSize || 28}pt;
          font-weight: bold;
          margin-bottom: 40px;
          color: #1a1a1a;
        }
        .title {
          font-size: ${formatting.fontSize}pt;
          font-weight: ${formatting.bold ? 'bold' : 'normal'};
          color: #333;
          max-width: 80%;
          word-wrap: break-word;
          text-align: center;
        }
        ${formatting.showPageNumbers ? `
        .page-number {
          position: fixed;
          bottom: 20mm;
          width: 100%;
          text-align: center;
          font-size: 10pt;
          color: #666;
        }
        ` : ''}
      </style>
    </head>
    <body>
      <div class="heading">${headingText}</div>
      <div class="title">${title}</div>
      ${formatting.showPageNumbers ? '<div class="page-number">1</div>' : ''}
    </body>
    </html>
  `;
};

export const generateOpisHTML = (config: OpisTableConfig): string => {
  const { annexes, formatting } = config;
  
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
          color: #1a1a1a;
        }
        .title {
          text-align: center;
          font-size: ${formatting.fontSize * 1.5}pt;
          font-weight: bold;
          margin-bottom: 30px;
          color: #1a1a1a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #333;
          padding: 8px 12px;
          text-align: ${formatting.alignment};
          vertical-align: top;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
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
          color: #666;
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
          backgroundColor: '#ffffff',
          scale: 1,
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
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { annexNumber, title, formatting } = config;
  const headingText = formatting.headingFormat?.replace('{n}', annexNumber.toString()) || `ANEXA ${annexNumber}`;
  
  const pageHeight = 841.89;
  const pageWidth = 595.28;
  
  // Calculate center positions
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Draw heading
  const headingSize = formatting.headingFontSize || 28;
  const headingWidth = boldFont.widthOfTextAtSize(headingText, headingSize);
  
  page.drawText(headingText, {
    x: centerX - (headingWidth / 2),
    y: centerY + 50,
    size: headingSize,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
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
    const testWidth = titleFont.widthOfTextAtSize(testLine, titleSize);
    
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
  let startY = centerY - 30 - (totalTitleHeight / 2);
  
  for (const line of lines) {
    const lineWidth = titleFont.widthOfTextAtSize(line, titleSize);
    page.drawText(line, {
      x: centerX - (lineWidth / 2),
      y: startY,
      size: titleSize,
      font: titleFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    startY -= lineHeight;
  }
  
  return await pdfDoc.save();
};

const createOpisPDF = async (config: OpisTableConfig): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { annexes, formatting } = config;
  
  const pageHeight = 841.89;
  const pageWidth = 595.28;
  const margin = 50;
  
  // Title
  const titleText = 'OPIS';
  const titleSize = (formatting.fontSize || 12) * 1.5;
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);
  
  page.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2,
    y: pageHeight - margin - 50,
    size: titleSize,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
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
    color: rgb(0.95, 0.95, 0.95),
  });
  
  // Header borders
  page.drawRectangle({
    x: tableStartX,
    y: headerY - rowHeight,
    width: col1Width,
    height: rowHeight,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 1,
  });
  
  page.drawRectangle({
    x: tableStartX + col1Width,
    y: headerY - rowHeight,
    width: col2Width,
    height: rowHeight,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 1,
  });
  
  // Header text
  page.drawText('Nr. crt.', {
    x: tableStartX + 10,
    y: headerY - rowHeight + 8,
    size: formatting.fontSize || 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  
  page.drawText('Descriere', {
    x: tableStartX + col1Width + 10,
    y: headerY - rowHeight + 8,
    size: formatting.fontSize || 12,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
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
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 1,
    });
    
    page.drawRectangle({
      x: tableStartX + col1Width,
      y: currentY,
      width: col2Width,
      height: rowHeight,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 1,
    });
    
    // Row text
    const numberText = `Anexa nr. ${annex.number}`;
    page.drawText(numberText, {
      x: tableStartX + 10,
      y: currentY + 8,
      size: formatting.fontSize || 12,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // Truncate long titles
    let titleText = annex.title;
    const maxTitleWidth = col2Width - 20;
    const titleSize = formatting.fontSize || 12;
    
    while (font.widthOfTextAtSize(titleText, titleSize) > maxTitleWidth && titleText.length > 3) {
      titleText = titleText.slice(0, -4) + '...';
    }
    
    page.drawText(titleText, {
      x: tableStartX + col1Width + 10,
      y: currentY + 8,
      size: titleSize,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
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
    
    // Create the final PDF document
    const finalPDF = await PDFDocument.create();
    
    // Generate and add Opis (Table of Contents)
    const opisConfig: OpisTableConfig = {
      annexes: annexes.map(annex => ({
        number: annex.annexNumber,
        title: getDisplayTitle(annex)
      })),
      formatting: opisFormatting
    };
    
    const opisPDFBytes = await createOpisPDF(opisConfig);
    const opisPDF = await PDFDocument.load(opisPDFBytes);
    const opisPages = await finalPDF.copyPages(opisPDF, opisPDF.getPageIndices());
    opisPages.forEach((page) => finalPDF.addPage(page));
    
    // For each annex, add cover page and then the original PDF
    for (const annex of annexes) {
      // Generate and add cover page
      const coverConfig: CoverPageConfig = {
        annexNumber: annex.annexNumber,
        title: getDisplayTitle(annex),
        formatting: coverFormatting
      };
      
      try {
        const coverPDFBytes = await createCoverPagePDF(coverConfig);
        const coverPDF = await PDFDocument.load(coverPDFBytes);
        const coverPages = await finalPDF.copyPages(coverPDF, coverPDF.getPageIndices());
        coverPages.forEach((page) => finalPDF.addPage(page));
        
        // Add all documents in this annex
        for (const document of annex.documents || []) {
          if (document.file) {
            try {
              const originalPDFBytes = await readPDFAsUint8Array(document.file);
              const originalPDF = await PDFDocument.load(originalPDFBytes);
              const originalPages = await finalPDF.copyPages(originalPDF, originalPDF.getPageIndices());
              originalPages.forEach((page) => finalPDF.addPage(page));
              
            } catch (pdfError) {
              console.warn('Could not process PDF file:', pdfError);
              // Add error page for this document
              const errorPage = finalPDF.addPage([595.28, 841.89]);
              const font = await finalPDF.embedFont(StandardFonts.Helvetica);
              
              errorPage.drawText('Error loading PDF document:', {
                x: 50,
                y: 750,
                size: 12,
                font: font,
                color: rgb(0.8, 0, 0),
              });
              
              errorPage.drawText(document.file.name, {
                x: 50,
                y: 720,
                size: 10,
                font: font,
                color: rgb(0.3, 0.3, 0.3),
              });
            }
          }
        }
        
      } catch (error) {
        console.error(`Error processing annex ${annex.annexNumber}:`, error);
        // Add error page
        const errorPage = finalPDF.addPage([595.28, 841.89]);
        const font = await finalPDF.embedFont(StandardFonts.Helvetica);
        
        errorPage.drawText(`Error processing Annexa ${annex.annexNumber}`, {
          x: 50,
          y: 750,
          size: 12,
          font: font,
          color: rgb(0.8, 0, 0),
        });
        
        errorPage.drawText(getDisplayTitle(annex), {
          x: 50,
          y: 720,
          size: 10,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }
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
    throw new Error('Eroare la exportarea PDF-ului');
  }
};