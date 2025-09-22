import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette } from '@phosphor-icons/react';
import { FormattingOptions, ColorTheme, colorThemes } from '@/types';

interface ColorThemeSelectorProps {
  formatting: FormattingOptions;
  onFormattingChange: (updates: Partial<FormattingOptions>) => void;
  title: string;
}

export const ColorThemeSelector: React.FC<ColorThemeSelectorProps> = ({
  formatting,
  onFormattingChange,
  title,
}) => {
  const currentTheme = formatting.colorTheme || colorThemes[0];
  const useCustomColors = formatting.useCustomColors || false;

  const handleThemeSelect = (theme: ColorTheme) => {
    onFormattingChange({ 
      colorTheme: theme,
      useCustomColors: false 
    });
  };

  const handleCustomColorToggle = (checked: boolean) => {
    onFormattingChange({ useCustomColors: checked });
  };

  const handleCustomColorChange = (field: keyof ColorTheme, value: string) => {
    if (useCustomColors) {
      const updatedTheme = {
        ...currentTheme,
        [field]: value,
        name: 'Custom'
      };
      onFormattingChange({ colorTheme: updatedTheme });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm">Teme predefinite</Label>
          <div className="grid grid-cols-1 gap-2">
            {colorThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeSelect(theme)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  currentTheme.name === theme.name && !useCustomColors
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <span className="text-sm font-medium">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-custom-colors"
              checked={useCustomColors}
              onCheckedChange={handleCustomColorToggle}
            />
            <Label htmlFor="use-custom-colors" className="text-sm">
              Folosește culori personalizate
            </Label>
          </div>

          {useCustomColors && (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="primary-color" className="text-xs">Culoare principală</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={currentTheme.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color" className="text-xs">Culoare secundară</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={currentTheme.secondary}
                      onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.secondary}
                      onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                      className="text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent-color" className="text-xs">Culoare accent</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={currentTheme.accent}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.accent}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                      className="text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color" className="text-xs">Culoare text</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={currentTheme.text}
                      onChange={(e) => handleCustomColorChange('text', e.target.value)}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.text}
                      onChange={(e) => handleCustomColorChange('text', e.target.value)}
                      className="text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="background-color" className="text-xs">Culoare fundal</Label>
                <div className="flex space-x-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={currentTheme.background}
                    onChange={(e) => handleCustomColorChange('background', e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={currentTheme.background}
                    onChange={(e) => handleCustomColorChange('background', e.target.value)}
                    className="text-xs"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border rounded-lg bg-card" style={{ 
          backgroundColor: currentTheme.background,
          color: currentTheme.text,
          borderColor: currentTheme.secondary + '40'
        }}>
          <div className="space-y-2">
            <h4 style={{ color: currentTheme.primary }} className="font-semibold">
              Previzualizare temă
            </h4>
            <p className="text-sm">
              Acesta este un exemplu de text cu tema selectată.
            </p>
            <div className="flex space-x-2">
              <span 
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: currentTheme.primary + '20',
                  color: currentTheme.primary 
                }}
              >
                Primar
              </span>
              <span 
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: currentTheme.accent + '20',
                  color: currentTheme.accent 
                }}
              >
                Accent
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};