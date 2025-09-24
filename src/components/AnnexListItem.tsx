import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, DotsSixVertical, X, PencilSimple, Eye } from '@phosphor-icons/react';
import { AnnexItem } from '@/types';
import { getDisplayTitle, formatBytes, truncateFilePath } from '@/lib/utils';
import { PDFPreview } from '@/components/PDFPreview';

interface AnnexListItemProps {
  annex: AnnexItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isDragDisabled?: boolean;
}

export const AnnexListItem: React.FC<AnnexListItemProps> = ({
  annex,
  isSelected,
  onSelect,
  onRemove,
  onUpdateTitle,
  onMoveUp,
  onMoveDown,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(getDisplayTitle(annex));
  const [previewDocument, setPreviewDocument] = React.useState(annex.documents?.[0] || null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleTitleSubmit = () => {
    onUpdateTitle(annex.id, editTitle.trim());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(getDisplayTitle(annex));
      setIsEditing(false);
    }
  };

  const handlePreviewFirstDocument = () => {
    const firstDocument = annex.documents?.[0];
    if (firstDocument) {
      setPreviewDocument(firstDocument);
      setIsPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
      onClick={() => onSelect(annex.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DotsSixVertical className="w-4 h-4" />
            <span className="text-sm font-medium min-w-[3rem]">
              {annex.annexNumber}.
            </span>
          </div>
          
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyPress}
                  className="text-sm font-medium"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span 
                  className="text-sm font-medium cursor-text flex-1"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  {getDisplayTitle(annex)}
                </span>
              )}
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                >
                  <PencilSimple className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              {annex.documents && annex.documents.length === 1 ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                    1 doc
                  </span>
                  <span>
                    {truncateFilePath(annex.documents[0].sourceFilePath, 25)}
                    {annex.documents[0].file && ` • ${formatBytes(annex.documents[0].file.size)}`}
                  </span>
                  {annex.documents[0].file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewFirstDocument();
                      }}
                      className="h-5 w-5 p-0 text-primary hover:text-primary hover:bg-primary/10 ml-1"
                      title="Previzualizează PDF-ul"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ) : annex.documents && annex.documents.length > 1 ? (
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                      {annex.documents.length} docs
                    </span>
                    <span className="text-xs">Bundle complet</span>
                  </div>
                  <div className="mt-1 space-y-0.5 ml-1">
                    {annex.documents.slice(0, 2).map((doc, index) => (
                      <div key={doc.id} className="text-xs flex items-center gap-1">
                        <span className="w-4 text-center text-muted-foreground/60">
                          {index + 1}.
                        </span>
                        <span>{truncateFilePath(doc.sourceFilePath, 25)}</span>
                      </div>
                    ))}
                    {annex.documents.length > 2 && (
                      <div className="text-xs italic text-muted-foreground/80 ml-5">
                        și încă {annex.documents.length - 2} documente...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground/60 italic">
                  <span className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                    0 docs
                  </span>
                  <span className="text-xs">Anexă goală</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(annex.id);
              }}
              className="h-8 w-8 p-0"
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(annex.id);
              }}
              className="h-8 w-8 p-0"
            >
              ↓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(annex.id);
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
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