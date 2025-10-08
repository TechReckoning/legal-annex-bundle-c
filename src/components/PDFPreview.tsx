import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowClockwise, Download, FileText } from '@phosphor-icons/react';
import { DocumentItem } from '@/types';

interface PDFPreviewProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string>('');
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Reset state when document changes
  React.useEffect(() => {
    if (document) {
      setCurrentPage(1);
      setZoom(1);
      setRotation(0);
      setError(null);
      setIsLoading(true);
      
      // Create object URL for PDF file
      if (document.file && document.file instanceof File) {
        const url = URL.createObjectURL(document.file);
        setPdfUrl(url);
        
        // Cleanup function
        return () => {
          URL.revokeObjectURL(url);
          setPdfUrl('');
        };
      } else {
        setPdfUrl('');
      }
    } else {
      setPdfUrl('');
    }
  }, [document]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleDownload = () => {
    if (document?.file) {
      const url = URL.createObjectURL(document.file);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.sourceFilePath;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    // Try to get total pages from iframe (this is a simplified approach)
    // In a real implementation, you might want to use a PDF.js library
    setTotalPages(1); // Default to 1 page for now
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Nu s-a putut încărca previzualizarea PDF-ului');
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {document.autoTitle}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="px-6 py-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <MagnifyingGlassMinus className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <MagnifyingGlassPlus className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <ArrowClockwise className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descarcă
                </Button>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                >
                  ←
                </Button>
                <span className="text-sm font-medium min-w-[80px] text-center">
                  {currentPage} / {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                >
                  →
                </Button>
              </div>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 relative bg-muted/20">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Se încarcă PDF-ul...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-destructive mb-2">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descarcă PDF-ul
                  </Button>
                </div>
              </div>
            )}

            {pdfUrl && !error && (
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-full border-0"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'top left',
                  width: `${100 / zoom}%`,
                  height: `${100 / zoom}%`,
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`Preview of ${document.autoTitle}`}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
