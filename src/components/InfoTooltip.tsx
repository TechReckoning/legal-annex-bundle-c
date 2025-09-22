import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Files, FileText, Download, HardDrive } from '@phosphor-icons/react';

export const MultiDocumentInfo: React.FC = () => {
  return (
    <Card className="bg-blue-50/50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-900">
              Informații Importante
            </h4>
            <div className="text-xs text-blue-800 space-y-1">
              <div className="flex items-center gap-2">
                <Files className="w-3 h-3" />
                <span>Adăugați multiple PDF-uri în aceeași anexă pentru un bundle complet</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                <span>Fiecare anexă va avea o copertă urmată de toate documentele sale</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-3 h-3" />
                <span>La export: Opis → Anexa 1 (Copertă + Doc1 + Doc2...) → Anexa 2...</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-3 h-3" />
                <span>PDF-urile sunt stocate temporar în browser până la export (nu pe disc)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};