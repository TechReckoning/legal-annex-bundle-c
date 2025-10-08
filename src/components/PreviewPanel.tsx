import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GridFour, ListNumbers, Eye, EyeSlash } from '@phosphor-icons/react';
import { AnnexItem, FormattingOptions } from '@/types';
import { getDisplayTitle } from '@/lib/utils';
import { VirtualOpisPreview } from '@/components/VirtualOpisPreview';

interface PreviewPanelProps {
  selectedAnnex: AnnexItem | null;
  annexes: AnnexItem[];
  opisFormatting: FormattingOptions;
  coverFormatting: FormattingOptions;
  onAnnexSelect?: (annex: AnnexItem) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  selectedAnnex,
  annexes,
  opisFormatting,
  coverFormatting,
  onAnnexSelect,
}) => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [useVirtualScroll, setUseVirtualScroll] = React.useState(false);

  // Properly manage logo URL lifecycle
  React.useEffect(() => {
    if (coverFormatting.logoFile && coverFormatting.logoFile instanceof File) {
      const url = URL.createObjectURL(coverFormatting.logoFile);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoUrl(null);
    }
  }, [coverFormatting.logoFile]);

  const renderCoverPreview = () => {
    if (!selectedAnnex) return null;

    const title = getDisplayTitle(selectedAnnex);
    const headingText = coverFormatting.headingFormat?.replace('{n}', selectedAnnex.annexNumber.toString()) || `ANEXA ${selectedAnnex.annexNumber}`;
    const theme = coverFormatting.colorTheme;

    const containerStyle = {
      backgroundColor: theme?.background || '#ffffff',
      color: theme?.text || '#1a1a1a',
    };

    const headingStyle = {
      fontFamily: coverFormatting.fontFamily,
      fontSize: `${coverFormatting.headingFontSize || 28}px`,
      color: theme?.primary || '#1a1a1a',
    };

    const titleStyle = {
      fontFamily: coverFormatting.fontFamily,
      fontSize: `${coverFormatting.fontSize}px`,
      fontWeight: coverFormatting.bold ? 'bold' : 'normal',
      color: theme?.secondary || '#333333',
    };

    const logoSize = coverFormatting.logoSize || 120;
    const logoPosition = coverFormatting.logoPosition || 'top';

    return (
      <div 
        className="border rounded-lg p-6 min-h-[300px] flex flex-col justify-center items-center text-center shadow-sm relative"
        style={containerStyle}
      >
        <div className={`flex ${logoPosition === 'top' || logoPosition === 'bottom' || !logoPosition ? 'flex-col' : 'flex-row'} items-center justify-center gap-4 w-full`}>
          {logoUrl && (logoPosition === 'top' || !logoPosition) && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="object-contain"
              style={{ 
                width: `${logoSize}px`, 
                height: `${logoSize}px`,
                maxWidth: '200px',
                maxHeight: '150px'
              }}
            />
          )}
          
          {logoUrl && logoPosition === 'left' && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="object-contain"
              style={{ 
                width: `${logoSize}px`, 
                height: `${logoSize}px`,
                maxWidth: '150px',
                maxHeight: '100px'
              }}
            />
          )}
          
          <div className="flex flex-col items-center space-y-4 flex-1">
            <div className="text-3xl font-bold" style={headingStyle}>
              {headingText}
            </div>
            <div className="text-lg max-w-[80%] break-words" style={titleStyle}>
              {title}
            </div>
          </div>
          
          {logoUrl && logoPosition === 'right' && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="object-contain"
              style={{ 
                width: `${logoSize}px`, 
                height: `${logoSize}px`,
                maxWidth: '150px',
                maxHeight: '100px'
              }}
            />
          )}
          
          {logoUrl && logoPosition === 'bottom' && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="object-contain"
              style={{ 
                width: `${logoSize}px`, 
                height: `${logoSize}px`,
                maxWidth: '200px',
                maxHeight: '150px'
              }}
            />
          )}
        </div>
        
        {coverFormatting.showPageNumbers && (
          <div 
            className="absolute bottom-4 text-sm"
            style={{ 
              fontFamily: coverFormatting.fontFamily,
              color: theme?.text || '#666666'
            }}
          >
            1
          </div>
        )}
      </div>
    );
  };

  const renderOpisPreview = () => {
    if (annexes.length === 0) return null;

    const theme = opisFormatting.colorTheme;

    const containerStyle = {
      backgroundColor: theme?.background || '#ffffff',
      color: theme?.text || '#1a1a1a',
    };

    const titleStyle = {
      fontFamily: opisFormatting.fontFamily,
      fontSize: `${opisFormatting.fontSize * 1.5}px`,
      color: theme?.primary || '#1a1a1a',
    };

    const borderColor = theme?.secondary || '#e5e5e5';
    const headerBgColor = theme?.accent || '#f5f5f5';

    return (
      <div className="border rounded-lg p-6 shadow-sm" style={containerStyle}>
        <div className="text-center text-xl font-bold mb-6" style={titleStyle}>
          LISTA ANEXELOR
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th 
                className="border p-2 text-left font-bold"
                style={{ 
                  fontFamily: opisFormatting.fontFamily,
                  fontSize: `${opisFormatting.fontSize}px`,
                  borderColor: borderColor,
                  backgroundColor: headerBgColor,
                  color: theme?.text || '#1a1a1a',
                }}
              >
                Nr. crt.
              </th>
              <th 
                className="border p-2 text-left font-bold"
                style={{ 
                  fontFamily: opisFormatting.fontFamily,
                  fontSize: `${opisFormatting.fontSize}px`,
                  borderColor: borderColor,
                  backgroundColor: headerBgColor,
                  color: theme?.text || '#1a1a1a',
                }}
              >
                Descriere
              </th>
            </tr>
          </thead>
          <tbody>
            {annexes.map((annex) => (
              <tr key={annex.id} className="align-top">
                <td 
                  className="border p-2 text-center w-[30%] align-top"
                  style={{ 
                    fontFamily: opisFormatting.fontFamily,
                    fontSize: `${opisFormatting.fontSize}px`,
                    fontWeight: opisFormatting.bold ? 'bold' : 'normal',
                    borderColor: borderColor,
                    color: theme?.text || '#1a1a1a',
                    verticalAlign: 'top',
                    minHeight: '40px',
                  }}
                >
                  Anexa nr. {annex.annexNumber}
                </td>
                <td 
                  className="border p-2 align-top"
                  style={{ 
                    fontFamily: opisFormatting.fontFamily,
                    fontSize: `${opisFormatting.fontSize}px`,
                    fontWeight: opisFormatting.bold ? 'bold' : 'normal',
                    textAlign: opisFormatting.alignment,
                    borderColor: borderColor,
                    color: theme?.text || '#1a1a1a',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '70%',
                    whiteSpace: 'normal',
                    verticalAlign: 'top',
                    minHeight: '40px',
                    lineHeight: '1.4',
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
            className="text-center mt-4 text-sm"
            style={{ 
              fontFamily: opisFormatting.fontFamily,
              color: theme?.text || '#666666'
            }}
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Previzualizare Lista Anexelor</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={useVirtualScroll ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseVirtualScroll(!useVirtualScroll)}
              >
                {useVirtualScroll ? <EyeSlash className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {useVirtualScroll ? 'Dezactivează' : 'Activează'} Virtual Scroll
              </Button>
              <div className="text-xs text-muted-foreground">
                {annexes.length} anexe
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {annexes.length > 0 ? (
            useVirtualScroll ? (
              <VirtualOpisPreview
                annexes={annexes}
                opisFormatting={opisFormatting}
                onAnnexSelect={onAnnexSelect}
                selectedAnnexId={selectedAnnex?.id}
              />
            ) : (
              renderOpisPreview()
            )
          ) : (
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
              Adăugați documente pentru a vizualiza Lista Anexelor
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