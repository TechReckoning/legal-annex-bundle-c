import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image } from '@phosphor-icons/react';
import { FormattingOptions } from '@/types';

interface LogoUploaderProps {
  formatting: FormattingOptions;
  onFormattingChange: (updates: Partial<FormattingOptions>) => void;
  title: string;
}

const logoPositions = [
  { value: 'top', label: 'Sus' },
  { value: 'bottom', label: 'Jos' },
  { value: 'left', label: 'Stânga' },
  { value: 'right', label: 'Dreapta' },
];

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  formatting,
  onFormattingChange,
  title,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (formatting.logoFile) {
      const url = URL.createObjectURL(formatting.logoFile);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(null);
    }
  }, [formatting.logoFile]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFormattingChange({ 
        logoFile: file,
        logoPath: file.name 
      });
    }
  };

  const handleRemoveLogo = () => {
    onFormattingChange({ 
      logoFile: undefined,
      logoPath: undefined 
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{title}</Label>
          
          {logoPreview ? (
            <div className="relative">
              <div className="border rounded-lg p-4 bg-card flex flex-col items-center space-y-2">
                <img 
                  src={logoPreview} 
                  alt="Logo preview"
                  className="max-w-32 max-h-32 object-contain rounded"
                  style={{ maxWidth: `${formatting.logoSize}px`, maxHeight: `${formatting.logoSize}px` }}
                />
                <p className="text-sm text-muted-foreground">{formatting.logoFile?.name}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Image className="w-8 h-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Încărcați un logo pentru copertă
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUploadClick}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Selectează imagine
                  </Button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {formatting.logoFile && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo-size">Dimensiune logo (px)</Label>
              <Input
                id="logo-size"
                type="number"
                min="40"
                max="300"
                value={formatting.logoSize || 120}
                onChange={(e) => onFormattingChange({ logoSize: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="logo-position">Poziție logo</Label>
              <Select 
                value={formatting.logoPosition || 'top'} 
                onValueChange={(value: 'top' | 'bottom' | 'left' | 'right') => 
                  onFormattingChange({ logoPosition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {logoPositions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};