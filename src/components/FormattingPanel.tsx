import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FormattingOptions } from '@/types';
import { LogoUploader } from '@/components/LogoUploader';
import { ColorThemeSelector } from '@/components/ColorThemeSelector';

interface FormattingPanelProps {
  opisFormatting: FormattingOptions;
  coverFormatting: FormattingOptions;
  onOpisFormattingChange: (formatting: FormattingOptions) => void;
  onCoverFormattingChange: (formatting: FormattingOptions) => void;
  onReset: () => void;
}

const fontFamilies = [
  'Inter',
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Calibri',
];

const alignmentOptions = [
  { value: 'left', label: 'Stânga' },
  { value: 'center', label: 'Centru' },
  { value: 'right', label: 'Dreapta' },
];

export const FormattingPanel: React.FC<FormattingPanelProps> = ({
  opisFormatting,
  coverFormatting,
  onOpisFormattingChange,
  onCoverFormattingChange,
  onReset,
}) => {
  const updateOpisFormatting = (updates: Partial<FormattingOptions>) => {
    onOpisFormattingChange({ ...opisFormatting, ...updates });
  };

  const updateCoverFormatting = (updates: Partial<FormattingOptions>) => {
    onCoverFormattingChange({ ...coverFormatting, ...updates });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formatare Opis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opis-font-family">Font</Label>
              <Select 
                value={opisFormatting.fontFamily} 
                onValueChange={(value) => updateOpisFormatting({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="opis-font-size">Dimensiune font</Label>
              <Input
                id="opis-font-size"
                type="number"
                min="8"
                max="72"
                value={opisFormatting.fontSize}
                onChange={(e) => updateOpisFormatting({ fontSize: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opis-alignment">Aliniere</Label>
              <Select 
                value={opisFormatting.alignment} 
                onValueChange={(value: 'left' | 'center' | 'right') => updateOpisFormatting({ alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="opis-bold"
                checked={opisFormatting.bold}
                onCheckedChange={(checked) => updateOpisFormatting({ bold: !!checked })}
              />
              <Label htmlFor="opis-bold">Text îngroșat</Label>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <Label htmlFor="opis-margin-top">Margin sus (mm)</Label>
              <Input
                id="opis-margin-top"
                type="number"
                min="0"
                max="50"
                value={opisFormatting.marginTop}
                onChange={(e) => updateOpisFormatting({ marginTop: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="opis-margin-right">Margin dreapta (mm)</Label>
              <Input
                id="opis-margin-right"
                type="number"
                min="0"
                max="50"
                value={opisFormatting.marginRight}
                onChange={(e) => updateOpisFormatting({ marginRight: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="opis-margin-bottom">Margin jos (mm)</Label>
              <Input
                id="opis-margin-bottom"
                type="number"
                min="0"
                max="50"
                value={opisFormatting.marginBottom}
                onChange={(e) => updateOpisFormatting({ marginBottom: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="opis-margin-left">Margin stânga (mm)</Label>
              <Input
                id="opis-margin-left"
                type="number"
                min="0"
                max="50"
                value={opisFormatting.marginLeft}
                onChange={(e) => updateOpisFormatting({ marginLeft: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="opis-page-numbers"
              checked={opisFormatting.showPageNumbers}
              onCheckedChange={(checked) => updateOpisFormatting({ showPageNumbers: !!checked })}
            />
            <Label htmlFor="opis-page-numbers">Afișează numerele paginilor</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formatare Copertă Anexe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cover-font-family">Font</Label>
              <Select 
                value={coverFormatting.fontFamily} 
                onValueChange={(value) => updateCoverFormatting({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cover-font-size">Dimensiune font</Label>
              <Input
                id="cover-font-size"
                type="number"
                min="8"
                max="72"
                value={coverFormatting.fontSize}
                onChange={(e) => updateCoverFormatting({ fontSize: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cover-heading-size">Dimensiune titlu principal</Label>
              <Input
                id="cover-heading-size"
                type="number"
                min="12"
                max="72"
                value={coverFormatting.headingFontSize || 28}
                onChange={(e) => updateCoverFormatting({ headingFontSize: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="cover-alignment">Aliniere</Label>
              <Select 
                value={coverFormatting.alignment} 
                onValueChange={(value: 'left' | 'center' | 'right') => updateCoverFormatting({ alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="cover-heading-format">Format titlu principal</Label>
            <Input
              id="cover-heading-format"
              value={coverFormatting.headingFormat || 'ANEXA {n}'}
              onChange={(e) => updateCoverFormatting({ headingFormat: e.target.value })}
              placeholder="ANEXA {n}"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Folosiți {'{n}'} pentru numărul anexei
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <Label htmlFor="cover-margin-top">Margin sus (mm)</Label>
              <Input
                id="cover-margin-top"
                type="number"
                min="0"
                max="50"
                value={coverFormatting.marginTop}
                onChange={(e) => updateCoverFormatting({ marginTop: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="cover-margin-right">Margin dreapta (mm)</Label>
              <Input
                id="cover-margin-right"
                type="number"
                min="0"
                max="50"
                value={coverFormatting.marginRight}
                onChange={(e) => updateCoverFormatting({ marginRight: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="cover-margin-bottom">Margin jos (mm)</Label>
              <Input
                id="cover-margin-bottom"
                type="number"
                min="0"
                max="50"
                value={coverFormatting.marginBottom}
                onChange={(e) => updateCoverFormatting({ marginBottom: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="cover-margin-left">Margin stânga (mm)</Label>
              <Input
                id="cover-margin-left"
                type="number"
                min="0"
                max="50"
                value={coverFormatting.marginLeft}
                onChange={(e) => updateCoverFormatting({ marginLeft: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cover-bold"
              checked={coverFormatting.bold}
              onCheckedChange={(checked) => updateCoverFormatting({ bold: !!checked })}
            />
            <Label htmlFor="cover-bold">Text îngroșat</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cover-page-numbers"
              checked={coverFormatting.showPageNumbers}
              onCheckedChange={(checked) => updateCoverFormatting({ showPageNumbers: !!checked })}
            />
            <Label htmlFor="cover-page-numbers">Afișează numerele paginilor</Label>
          </div>
        </CardContent>
      </Card>

      <LogoUploader
        formatting={coverFormatting}
        onFormattingChange={updateCoverFormatting}
        title="Logo pentru copertă"
      />

      <ColorThemeSelector
        formatting={coverFormatting}
        onFormattingChange={updateCoverFormatting}
        title="Temă de culori pentru copertă"
      />

      <Separator />

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset}>
          Resetează la valorile implicite
        </Button>
      </div>
    </div>
  );
};