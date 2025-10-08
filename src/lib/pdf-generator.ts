import { FormattingOptions, AnnexItem } from '@/types';
import { getDisplayTitle } from '@/lib/utils';
import { processTextForPDF } from '@/lib/unicode-utils';
import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { loadInterRegular, loadInterBold } from '@/lib/pdf-fonts';

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

// PDF generation using pdf-lib with embedded Inter fonts
const createCoverPagePDF = async (config: CoverPageConfig): Promise<Uint8Array> => {
  if (!config || !config.formatting) {
    throw new Error('Invalid cover page configuration');
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit); // Register fontkit to enable custom font embedding
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  // Use Inter font (open-source, SIL Open Font License) with full Romanian character support
  const interRegularBytes = await loadInterRegular();
  const interBoldBytes = await loadInterBold();
  const font = await pdfDoc.embedFont(interRegularBytes);
  const boldFont = await pdfDoc.embedFont(interBoldBytes);
  
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
  const processedHeadingText = processTextForPDF(headingText);
  const headingWidth = (boldFont as any).widthOfTextAtSize(processedHeadingText, headingSize);
  
  page.drawText(processedHeadingText, {
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
    const processedWord = processTextForPDF(word);
    const testLine = currentLine ? `${currentLine} ${processedWord}` : processedWord;
    const testWidth = (titleFont as any).widthOfTextAtSize(testLine, titleSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = processedWord;
      } else {
        lines.push(processedWord);
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
    const processedLine = processTextForPDF(line);
    const lineWidth = (titleFont as any).widthOfTextAtSize(processedLine, titleSize);
    page.drawText(processedLine, {
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
  pdfDoc.registerFontkit(fontkit); // Register fontkit to enable custom font embedding
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
  // Use Inter font (open-source, SIL Open Font License) with full Romanian character support
  const interRegularBytes = await loadInterRegular();
  const interBoldBytes = await loadInterBold();
  const font = await pdfDoc.embedFont(interRegularBytes);
  const boldFont = await pdfDoc.embedFont(interBoldBytes);
  
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
  const titleText = 'LISTA ANEXELOR';
  const processedTitleText = processTextForPDF(titleText);
  const titleSize = (formatting.fontSize || 12) * 1.5;
  const titleWidth = (boldFont as any).widthOfTextAtSize(processedTitleText, titleSize);
  
  page.drawText(processedTitleText, {
    x: (pageWidth - titleWidth) / 2,
    y: pageHeight - margin - 50,
    size: titleSize,
    font: boldFont,
    color: primaryColor,
  });
  
  // Table
  const tableStartY = pageHeight - margin - 100;
  const baseRowHeight = 25;
  const col1Width = pageWidth * 0.3;
  const col2Width = pageWidth * 0.6;
  const tableWidth = col1Width + col2Width;
  const tableStartX = (pageWidth - tableWidth) / 2;
  
  // Table headers
  const headerY = tableStartY;
  
  // Header background
  page.drawRectangle({
    x: tableStartX,
    y: headerY - baseRowHeight,
    width: tableWidth,
    height: baseRowHeight,
    color: accentColor,
  });
  
  // Header borders
  page.drawRectangle({
    x: tableStartX,
    y: headerY - baseRowHeight,
    width: col1Width,
    height: baseRowHeight,
    borderColor: secondaryColor,
    borderWidth: 1,
  });
  
  page.drawRectangle({
    x: tableStartX + col1Width,
    y: headerY - baseRowHeight,
    width: col2Width,
    height: baseRowHeight,
    borderColor: secondaryColor,
    borderWidth: 1,
  });
  
  // Header text
  page.drawText(processTextForPDF('Nr. crt.'), {
    x: tableStartX + 10,
    y: headerY - baseRowHeight + 12,
    size: formatting.fontSize || 12,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(processTextForPDF('Descriere'), {
    x: tableStartX + col1Width + 10,
    y: headerY - baseRowHeight + 12,
    size: formatting.fontSize || 12,
    font: boldFont,
    color: textColor,
  });
  
  // Table rows
  let currentY = headerY - baseRowHeight;
  
  for (const annex of annexes) {
    // Calculate dynamic row height based on content
    let titleText = processTextForPDF(annex.title);
    const maxTitleWidth = col2Width - 20;
    const titleSize = formatting.fontSize || 12;
    const lineHeight = titleSize * 1.2;
    
    // Calculate maximum characters that fit in the column width
    const maxCharacterLength = Math.floor(maxTitleWidth / (titleSize * 0.6));
    
    // If text is too long, wrap it properly instead of truncating
    let lines = [];
    if (titleText.length > maxCharacterLength) {
      // Split into words and wrap
      const words = titleText.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const processedWord = processTextForPDF(word);
        const testLine = currentLine ? `${currentLine} ${processedWord}` : processedWord;
        const testWidth = (font as any).widthOfTextAtSize(testLine, titleSize);
        
        if (testWidth <= maxTitleWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = processedWord;
          } else {
            // Single word is too long, truncate it
            lines.push(processedWord.slice(0, maxCharacterLength - 3) + '...');
          }
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
    } else {
      lines = [titleText]; // titleText is already processed above
    }
    
    // Calculate actual row height needed with symmetric margins
    const textHeight = lines.length * lineHeight;
    const topBottomMargin = 24; // 12 points top + 12 points bottom
    const actualRowHeight = Math.max(baseRowHeight, textHeight + topBottomMargin);
    
    currentY -= actualRowHeight;
    
    // Row borders
    page.drawRectangle({
      x: tableStartX,
      y: currentY,
      width: col1Width,
      height: actualRowHeight,
      borderColor: secondaryColor,
      borderWidth: 1,
    });
    
    page.drawRectangle({
      x: tableStartX + col1Width,
      y: currentY,
      width: col2Width,
      height: actualRowHeight,
      borderColor: secondaryColor,
      borderWidth: 1,
    });
    
    // Row text
    const numberText = `Anexa nr. ${annex.number}`;
    const processedNumberText = processTextForPDF(numberText);
    page.drawText(processedNumberText, {
      x: tableStartX + 10,
      y: currentY + actualRowHeight - 12,
      size: formatting.fontSize || 12,
      font: font,
      color: textColor,
    });
    
    // Handle multi-line text
    const processedTitleText = processTextForPDF(lines.join('\n'));
    const processedLines = processedTitleText.split('\n');
    // Start text from the top of the cell with symmetric margins
    let textY = currentY + actualRowHeight - 12;
    
    for (let i = 0; i < processedLines.length; i++) {
      const line = processedLines[i];
      if (line.trim()) {
        page.drawText(line, {
          x: tableStartX + col1Width + 10,
          y: textY - (i * lineHeight),
          size: titleSize,
          font: font,
          color: textColor,
        });
      }
    }
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

// Function to add stamp to a PDF page
const addStampToPage = async (page: PDFPage, formatting: FormattingOptions): Promise<void> => {
  if (!formatting.addStamp || !formatting.stampText) {
    return;
  }

  try {
    // Use Inter font (open-source, SIL Open Font License) with full Romanian character support
    const interRegularBytes = await loadInterRegular();
    const font = await page.doc.embedFont(interRegularBytes);
    
    const stampText = formatting.stampText;
    const stampSize = formatting.stampFontSize || 10;
    const stampPosition = formatting.stampPosition || 'bottom-right';
    
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const margin = 20; // 20 points margin from edges
    
    // Calculate text width to position it correctly
    const textWidth = font.widthOfTextAtSize(stampText, stampSize);
    
    let x: number;
    let y: number;
    
    // Calculate position based on stampPosition
    switch (stampPosition) {
      case 'top-left':
        x = margin;
        y = pageHeight - margin - stampSize;
        break;
      case 'top-right':
        x = pageWidth - textWidth - margin;
        y = pageHeight - margin - stampSize;
        break;
      case 'bottom-left':
        x = margin;
        y = margin;
        break;
      case 'bottom-right':
      default:
        x = pageWidth - textWidth - margin;
        y = margin;
        break;
    }
    
    // Draw the stamp text
    page.drawText(stampText, {
      x: x,
      y: y,
      size: stampSize,
      font: font,
      color: rgb(0.5, 0.5, 0.5), // Gray color for stamp
    });
    
  } catch (error) {
    console.warn('Could not add stamp to page:', error);
  }
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
    finalPDF.registerFontkit(fontkit); // Register fontkit to enable custom font embedding
    
    // Generate and add Opis (Table of Contents)
    const opisConfig: OpisTableConfig = {
      annexes: annexesWithDocuments.map(annex => ({
        number: annex.annexNumber,
        title: processTextForPDF(getDisplayTitle(annex))
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
          title: processTextForPDF(getDisplayTitle(annex)),
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
              const interRegularBytes = await loadInterRegular();
              const interBoldBytes = await loadInterBold();
              const font = await finalPDF.embedFont(interRegularBytes);
              const boldFont = await finalPDF.embedFont(interBoldBytes);
              
              // Draw separator info with better styling
              const theme = coverFormatting.colorTheme;
              const primaryColor = theme?.primary ? parseColor(theme.primary) : rgb(0.3, 0.3, 0.3);
              const secondaryColor = theme?.secondary ? parseColor(theme.secondary) : rgb(0.5, 0.5, 0.5);
              
              const separatorTitle = `ANEXA ${annex.annexNumber} - DOCUMENT ${docIndex + 1}`;
              separatorPage.drawText(processTextForPDF(separatorTitle), {
                x: 50,
                y: 750,
                size: 16,
                font: boldFont,
                color: primaryColor,
              });
              
              const processedDocumentTitle = processTextForPDF(document.autoTitle);
              separatorPage.drawText(processedDocumentTitle, {
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
              const documentIndexText = `Document ${docIndex + 1} din ${documents.length}`;
              separatorPage.drawText(processTextForPDF(documentIndexText), {
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
              // Add pages to the document and apply stamp if enabled
              for (const page of originalPages) {
                finalPDF.addPage(page);
                // Apply stamp to content pages only (not covers or opis)
                if (opisFormatting.addStamp) {
                  await addStampToPage(page, opisFormatting);
                }
              }
              
            } catch (pdfError) {
              console.warn(`Could not process PDF file "${document.file.name}":`, pdfError);
              
              // Add error page for this document
              try {
                const errorPage = finalPDF.addPage([595.28, 841.89]);
                const interRegularBytes = await loadInterRegular();
                const interBoldBytes = await loadInterBold();
                const font = await finalPDF.embedFont(interRegularBytes);
                const boldFont = await finalPDF.embedFont(interBoldBytes);
                
                const errorTitle = 'Eroare la incarcarea documentului PDF:';
                errorPage.drawText(processTextForPDF(errorTitle), {
                  x: 50,
                  y: 750,
                  size: 14,
                  font: boldFont,
                  color: rgb(0.8, 0, 0),
                });
                
                const processedFileName = processTextForPDF(document.file.name);
                errorPage.drawText(processedFileName, {
                  x: 50,
                  y: 720,
                  size: 12,
                  font: font,
                  color: rgb(0.3, 0.3, 0.3),
                });
                
                const errorMessage = 'Verificati daca fisierul este un PDF valid si nu este corupt.';
                errorPage.drawText(processTextForPDF(errorMessage), {
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
          const interRegularBytes = await loadInterRegular();
          const interBoldBytes = await loadInterBold();
          const font = await finalPDF.embedFont(interRegularBytes);
          const boldFont = await finalPDF.embedFont(interBoldBytes);
          
          const annexErrorTitle = `Eroare la procesarea Anexei ${annex.annexNumber}`;
          errorPage.drawText(processTextForPDF(annexErrorTitle), {
            x: 50,
            y: 750,
            size: 14,
            font: boldFont,
            color: rgb(0.8, 0, 0),
          });
          
          const processedAnnexTitle = processTextForPDF(getDisplayTitle(annex));
          errorPage.drawText(processedAnnexTitle, {
            x: 50,
            y: 720,
            size: 12,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          });
          
          const annexErrorMessage = 'Anexa a fost omisa din cauza unei erori.';
          errorPage.drawText(processTextForPDF(annexErrorMessage), {
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
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
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