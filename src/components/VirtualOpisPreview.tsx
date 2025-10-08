import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MagnifyingGlass, 
  ArrowUp, 
  ArrowDown, 
  ListNumbers, 
  GridFour,
  Eye,
  EyeSlash
} from '@phosphor-icons/react';
import { AnnexItem, FormattingOptions } from '@/types';
import { getDisplayTitle } from '@/lib/utils';
import { useVirtualScroll } from '@/hooks/use-virtual-scroll';

interface VirtualOpisPreviewProps {
  annexes: AnnexItem[];
  opisFormatting: FormattingOptions;
  onAnnexSelect?: (annex: AnnexItem) => void;
  selectedAnnexId?: string | null;
}

export const VirtualOpisPreview: React.FC<VirtualOpisPreviewProps> = ({
  annexes,
  opisFormatting,
  onAnnexSelect,
  selectedAnnexId,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'table' | 'list'>('table');
  const [showVirtualScroll, setShowVirtualScroll] = React.useState(false);
  const [itemHeight, setItemHeight] = React.useState(40);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(400);

  // Filter annexes based on search term
  const filteredAnnexes = React.useMemo(() => {
    if (!searchTerm.trim()) return annexes;
    return annexes.filter(annex => 
      getDisplayTitle(annex).toLowerCase().includes(searchTerm.toLowerCase()) ||
      annex.annexNumber.toString().includes(searchTerm)
    );
  }, [annexes, searchTerm]);

  // Update container height when ref changes
  React.useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Virtual scroll hook
  const { virtualItems, totalHeight, scrollToIndex, scrollToTop, scrollToBottom } = useVirtualScroll(
    filteredAnnexes,
    {
      itemHeight,
      containerHeight: showVirtualScroll ? containerHeight : 0,
      overscan: 5,
    }
  );

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

  const renderTableRow = (annex: AnnexItem, index: number) => (
    <tr 
      key={annex.id}
      className={`align-top hover:bg-muted/30 transition-colors ${
        selectedAnnexId === annex.id ? 'bg-primary/10' : ''
      } ${onAnnexSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onAnnexSelect?.(annex)}
    >
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
  );

  const renderListItem = (annex: AnnexItem, index: number) => (
    <div
      key={annex.id}
      className={`flex items-center justify-between p-3 border-b hover:bg-muted/30 transition-colors ${
        selectedAnnexId === annex.id ? 'bg-primary/10' : ''
      } ${onAnnexSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onAnnexSelect?.(annex)}
      style={{ borderColor: borderColor }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold"
          style={{ color: theme?.primary || '#1a1a1a' }}
        >
          {annex.annexNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="font-medium break-words"
            style={{ 
              fontFamily: opisFormatting.fontFamily,
              fontSize: `${opisFormatting.fontSize}px`,
              fontWeight: opisFormatting.bold ? 'bold' : 'normal',
              color: theme?.text || '#1a1a1a',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {getDisplayTitle(annex)}
          </div>
          <div 
            className="text-xs text-muted-foreground"
            style={{ fontFamily: opisFormatting.fontFamily }}
          >
            {annex.documents?.length || 0} documente
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Anexa {annex.annexNumber}
      </div>
    </div>
  );

  const renderVirtualContent = () => {
    if (viewMode === 'table') {
      return (
        <div className="relative">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
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
              {showVirtualScroll ? (
                <tr>
                  <td colSpan={2} style={{ height: totalHeight, position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: totalHeight,
                        overflow: 'hidden',
                      }}
                    >
                      {virtualItems.map(({ index, start, data }) => (
                        <div
                          key={data.id}
                          style={{
                            position: 'absolute',
                            top: start,
                            left: 0,
                            right: 0,
                            height: itemHeight,
                          }}
                        >
                          <table className="w-full border-collapse">
                            <tbody>
                              {renderTableRow(data, index)}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAnnexes.map((annex, index) => renderTableRow(annex, index))
              )}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="space-y-0">
          {showVirtualScroll ? (
            <div
              ref={containerRef}
              className="overflow-auto"
              style={{ height: containerHeight }}
            >
              <div style={{ height: totalHeight, position: 'relative' }}>
                {virtualItems.map(({ index, start, data }) => (
                  <div
                    key={data.id}
                    style={{
                      position: 'absolute',
                      top: start,
                      left: 0,
                      right: 0,
                      height: itemHeight,
                    }}
                  >
                    {renderListItem(data, index)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div ref={containerRef} className="max-h-96 overflow-auto">
              {filteredAnnexes.map((annex, index) => renderListItem(annex, index))}
            </div>
          )}
        </div>
      );
    }
  };

  if (annexes.length === 0) {
    return (
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
        Adăugați documente pentru a vizualiza Lista Anexelor
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <MagnifyingGlass className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Caută anexe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <GridFour className="w-4 h-4 mr-1" />
            Tabel
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ListNumbers className="w-4 h-4 mr-1" />
            Listă
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <Button
            variant={showVirtualScroll ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowVirtualScroll(!showVirtualScroll)}
          >
            {showVirtualScroll ? <EyeSlash className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showVirtualScroll ? 'Dezactivează' : 'Activează'} Virtual Scroll
          </Button>
          
          {showVirtualScroll && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToBottom}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground ml-auto">
          {filteredAnnexes.length} anexe
          {searchTerm && ` (${annexes.length} total)`}
        </div>
      </div>

      {/* Content */}
      <div 
        className="border rounded-lg p-6 shadow-sm"
        style={containerStyle}
      >
        <div className="text-center text-xl font-bold mb-6" style={titleStyle}>
          LISTA ANEXELOR
        </div>
        {renderVirtualContent()}
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
    </div>
  );
};
