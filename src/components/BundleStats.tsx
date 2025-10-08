import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Files, FileText, Package } from '@phosphor-icons/react';
import { AnnexItem } from '@/types';

interface BundleStatsProps {
  annexes: AnnexItem[];
}

export const BundleStats: React.FC<BundleStatsProps> = ({ annexes }) => {
  const totalAnnexes = annexes.length;
  const annexesWithDocuments = annexes.filter(annex => annex.documents && annex.documents.length > 0);
  const totalDocuments = annexes.reduce((sum, annex) => sum + (annex.documents?.length || 0), 0);
  const multiDocumentAnnexes = annexes.filter(annex => annex.documents && annex.documents.length > 1);

  if (totalAnnexes === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-3 text-center">
          <Package className="w-6 h-6 mx-auto mb-1 text-blue-600" />
          <div className="text-lg font-bold text-blue-900">{totalAnnexes}</div>
          <div className="text-xs text-blue-700">
            {totalAnnexes === 1 ? 'Anexă' : 'Anexe'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-3 text-center">
          <FileText className="w-6 h-6 mx-auto mb-1 text-green-600" />
          <div className="text-lg font-bold text-green-900">{totalDocuments}</div>
          <div className="text-xs text-green-700">
            {totalDocuments === 1 ? 'Document' : 'Documente'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-3 text-center">
          <Files className="w-6 h-6 mx-auto mb-1 text-purple-600" />
          <div className="text-lg font-bold text-purple-900">{multiDocumentAnnexes.length}</div>
          <div className="text-xs text-purple-700">
            Bundle{multiDocumentAnnexes.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};