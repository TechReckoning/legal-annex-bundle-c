import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, X, Upload, Eye } from '@phosphor-icons/react';
import { AnnexItem, DocumentItem } from '@/types';
import { formatBytes, truncateFilePath } from '@/lib/utils';
import { PDFPreview } from '@/components/PDFPreview';

interface DocumentManagerProps {
  annex: AnnexItem;
  onAddDocument: (annexId: string, file: File) => void;
  onRemoveDocument: (annexId: string, documentId: string) => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  annex,
  onAddDocument,
  onRemoveDocument,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewDocument, setPreviewDocument] = React.useState<DocumentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type === 'application/pdf') {
          onAddDocument(annex.id, file);
        }
      });
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddDocumentClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    pdfFiles.forEach(file => {
      onAddDocument(annex.id, file);
    });
  };

  const handlePreviewDocument = (document: DocumentItem) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Documente în anexa {annex.annexNumber} ({(annex.documents || []).length})</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddDocumentClick}
            className="h-7 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Adaugă PDF
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent 
        className="space-y-2"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {(annex.documents || []).map((document, index) => (
          <div key={document.id}>
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {document.autoTitle}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {truncateFilePath(document.sourceFilePath, 30)}
                    {document.file && ` • ${formatBytes(document.file.size)}`}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {document.file && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewDocument(document)}
                    className="h-6 w-6 p-0 text-primary hover:text-primary hover:bg-primary/10"
                    title="Previzualizează PDF-ul"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDocument(annex.id, document.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Elimină documentul"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {index < (annex.documents || []).length - 1 && (
              <Separator className="my-1" />
            )}
          </div>
        ))}
        
        {(!annex.documents || annex.documents.length === 0) && (
          <div 
            className="text-center py-6 text-muted-foreground border-2 border-dashed border-muted rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleAddDocumentClick}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Niciun document în această anexă</p>
            <p className="text-xs">Trageți fișiere PDF aici sau apăsați pentru a selecta</p>
            <p className="text-xs mt-1 text-primary/70">
              Puteți adăuga multiple documente în aceeași anexă
            </p>
          </div>
        )}
        
        {(annex.documents || []).length > 0 && (
          <div 
            className="text-center py-3 text-muted-foreground border border-dashed border-muted rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleAddDocumentClick}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Adaugă mai multe documente PDF</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* PDF Preview Dialog */}
      <PDFPreview
        document={previewDocument}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </Card>
  );
};