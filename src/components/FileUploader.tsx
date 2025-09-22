import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, FolderOpen, Download } from '@phosphor-icons/react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onLoadProject: (file: File) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  onLoadProject,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const projectInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      onFilesSelected(pdfFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
    e.target.value = '';
  };

  const handleProjectLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadProject(file);
      e.target.value = '';
    }
  };

  const handleAddFiles = () => {
    fileInputRef.current?.click();
  };

  const handleLoadProject = () => {
    projectInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Card
        className={`transition-all duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary/5 border-2' 
            : 'border-dashed border-2 hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleAddFiles : undefined}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Adăugați fișiere PDF
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Trageți și plasați fișierele aici sau faceți clic pentru a selecta
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button 
          onClick={handleAddFiles} 
          disabled={disabled}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adaugă PDF-uri
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleLoadProject}
          disabled={disabled}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Încarcă proiect
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <input
        ref={projectInputRef}
        type="file"
        accept=".json"
        onChange={handleProjectLoad}
        className="hidden"
      />
    </div>
  );
};