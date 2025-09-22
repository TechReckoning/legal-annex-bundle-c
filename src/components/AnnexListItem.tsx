import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, DotsSixVertical, X, PencilSimple } from '@phosphor-icons/react';
import { AnnexItem } from '@/types';
import { getDisplayTitle, formatBytes, truncateFilePath } from '@/lib/utils';

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

  const handleTitleSubmit = () => {
    onUpdateTitle(annex.id, editTitle.trim());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(getDisplayTitle(annex));
      setIsEditing(false);
    }
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
            <div className="text-xs text-muted-foreground">
              {truncateFilePath(annex.sourceFilePath)}
              {annex.file && ` • ${formatBytes(annex.file.size)}`}
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
    </Card>
  );
};