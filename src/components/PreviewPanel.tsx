import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnnexItem, FormattingOptions } from '@/types';
import { getDisplayTitle } from '@/lib/utils';
import { generateCoverPageHTML, generateOpisHTML } from '@/lib/pdf-generator';

interface PreviewPanelProps {
  selectedAnnex: AnnexItem | null;
  annexes: AnnexItem[];
  opisFormatting: FormattingOptions;
  coverFormatting: FormattingOptions;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  selectedAnnex,
  annexes,
  opisFormatting,
  coverFormatting,
}) => {
  const renderCoverPreview = () => {
    if (!selectedAnnex) return null;

    const title = getDisplayTitle(selectedAnnex);
    const headingText = coverFormatting.headingFormat?.replace('{n}', selectedAnnex.annexNumber.toString()) || `ANEXA ${selectedAnnex.annexNumber}`;

    return (
      <div className="border rounded-lg p-6 bg-white min-h-[300px] flex flex-col justify-center items-center text-center shadow-sm">
        <div 
          className="text-3xl font-bold mb-8 text-foreground"
          style={{ 
            fontFamily: coverFormatting.fontFamily,
            fontSize: `${coverFormatting.headingFontSize || 28}px`,
          }}
        >
          {headingText}
        </div>
        <div 
          className="text-lg max-w-[80%] break-words"
          style={{ 
            fontFamily: coverFormatting.fontFamily,
            fontSize: `${coverFormatting.fontSize}px`,
            fontWeight: coverFormatting.bold ? 'bold' : 'normal',
          }}
        >
          {title}
        </div>
        {coverFormatting.showPageNumbers && (
          <div 
            className="absolute bottom-4 text-sm text-muted-foreground"
            style={{ fontFamily: coverFormatting.fontFamily }}
          >
            1
          </div>
        )}
      </div>
    );
  };

  const renderOpisPreview = () => {
    if (annexes.length === 0) return null;

    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div 
          className="text-center text-xl font-bold mb-6"
          style={{ 
            fontFamily: opisFormatting.fontFamily,
            fontSize: `${opisFormatting.fontSize * 1.5}px`,
          }}
        >
          OPIS
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th 
                className="border border-foreground/20 bg-muted p-2 text-left font-bold"
                style={{ 
                  fontFamily: opisFormatting.fontFamily,
                  fontSize: `${opisFormatting.fontSize}px`,
                }}
              >
                Nr. crt.
              </th>
              <th 
                className="border border-foreground/20 bg-muted p-2 text-left font-bold"
                style={{ 
                  fontFamily: opisFormatting.fontFamily,
                  fontSize: `${opisFormatting.fontSize}px`,
                }}
              >
                Descriere
              </th>
            </tr>
          </thead>
          <tbody>
            {annexes.map((annex) => (
              <tr key={annex.id}>
                <td 
                  className="border border-foreground/20 p-2 text-center w-[30%]"
                  style={{ 
                    fontFamily: opisFormatting.fontFamily,
                    fontSize: `${opisFormatting.fontSize}px`,
                    fontWeight: opisFormatting.bold ? 'bold' : 'normal',
                  }}
                >
                  Anexa nr. {annex.annexNumber}
                </td>
                <td 
                  className="border border-foreground/20 p-2"
                  style={{ 
                    fontFamily: opisFormatting.fontFamily,
                    fontSize: `${opisFormatting.fontSize}px`,
                    fontWeight: opisFormatting.bold ? 'bold' : 'normal',
                    textAlign: opisFormatting.alignment,
                  }}
                >
                  {getDisplayTitle(annex)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {opisFormatting.showPageNumbers && (
          <div 
            className="text-center mt-4 text-sm text-muted-foreground"
            style={{ fontFamily: opisFormatting.fontFamily }}
          >
            1
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previzualizare Opis</CardTitle>
        </CardHeader>
        <CardContent>
          {annexes.length > 0 ? (
            renderOpisPreview()
          ) : (
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
              Adăugați documente pentru a vizualiza Opis-ul
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Previzualizare Copertă
            {selectedAnnex && ` - Anexa ${selectedAnnex.annexNumber}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAnnex ? (
            renderCoverPreview()
          ) : (
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
              Selectați o anexă pentru a vizualiza coperta
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};