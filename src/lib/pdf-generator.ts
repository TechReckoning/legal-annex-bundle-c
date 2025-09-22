import { FormattingOptions } from '@/types';

export interface CoverPageConfig {
  annexNumber: number;
  title: string;
  formatting: FormattingOptions;
}

export interface OpisTableConfig {
  annexes: Array<{ number: number; title: string }>;
  formatting: FormattingOptions;
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