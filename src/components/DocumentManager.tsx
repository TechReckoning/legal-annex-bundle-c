import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, X, Upload } from '@phosphor-icons/react';
import { AnnexItem, DocumentItem } from '@/types';
import { formatBytes, truncateFilePath } from '@/lib/utils';

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Documente în anexa {annex.annexNumber} ({annex.documents.length})</span>
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
      <CardContent className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {annex.documents.map((document, index) => (
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
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveDocument(annex.id, document.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            {index < annex.documents.length - 1 && (
              <Separator className="my-1" />
            )}
          </div>
        ))}
        
        {annex.documents.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Niciun document în această anexă</p>
            <p className="text-xs">Apasă "Adaugă PDF" pentru a începe</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};