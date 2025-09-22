import React from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Download, FloppyDisk, ArrowUp, ArrowDown, Trash } from '@phosphor-icons/react';

import { AnnexItem, ProjectModel, FormattingOptions, defaultFormattingOptions, defaultCoverFormattingOptions } from '@/types';
import { 
  generateId, 
  generateAutoTitle, 
  updateAnnexNumbers, 
  getDisplayTitle 
} from '@/lib/utils';
import { 
  createAnnexFromFile, 
  saveProject, 
  loadProject,
  reorderAnnexes 
} from '@/lib/project';
import { 
  generateCoverPageHTML, 
  generateOpisHTML,
  exportToPDF
} from '@/lib/pdf-generator';

import { FileUploader } from '@/components/FileUploader';
import { AnnexListItem } from '@/components/AnnexListItem';
import { PreviewPanel } from '@/components/PreviewPanel';
import { FormattingPanel } from '@/components/FormattingPanel';

function App() {
  const [annexes, setAnnexes] = useKV<AnnexItem[]>('annexes', []);
  const [opisFormatting, setOpisFormatting] = useKV<FormattingOptions>('opisFormatting', defaultFormattingOptions);
  const [coverFormatting, setCoverFormatting] = useKV<FormattingOptions>('coverFormatting', defaultCoverFormattingOptions);
  const [selectedAnnexId, setSelectedAnnexId] = React.useState<string | null>(null);

  const selectedAnnex = (annexes || []).find(annex => annex.id === selectedAnnexId) || null;

  const handleFilesSelected = (files: File[]) => {
    const newAnnexes = files.map(createAnnexFromFile);
    setAnnexes(currentAnnexes => {
      const combined = [...(currentAnnexes || []), ...newAnnexes];
      return updateAnnexNumbers(combined);
    });
    
    toast.success(`${files.length} fișier${files.length !== 1 ? 'e' : ''} adăugat${files.length !== 1 ? 'e' : ''}`);
    
    if (files.length > 0 && !selectedAnnexId) {
      setSelectedAnnexId(newAnnexes[0].id);
    }
  };

  const handleLoadProject = async (file: File) => {
    try {
      const projectData = await loadProject(file);
      
      if (projectData.annexes) {
        setAnnexes(updateAnnexNumbers(projectData.annexes));
      }
      if (projectData.opisFormatting) {
        setOpisFormatting(projectData.opisFormatting);
      }
      if (projectData.coverFormatting) {
        setCoverFormatting(projectData.coverFormatting);
      }
      
      toast.success('Proiect încărcat cu succes');
    } catch (error) {
      toast.error('Eroare la încărcarea proiectului');
      console.error('Error loading project:', error);
    }
  };

  const handleSaveProject = () => {
    const project: ProjectModel = {
      annexes: annexes || [],
      opisFormatting: opisFormatting || defaultFormattingOptions,
      coverFormatting: coverFormatting || defaultCoverFormattingOptions,
      projectVersion: '1.0',
    };
    
    saveProject(project);
    toast.success('Proiect salvat');
  };

  const handleRemoveAnnex = (id: string) => {
    setAnnexes(currentAnnexes => {
      const filtered = (currentAnnexes || []).filter(annex => annex.id !== id);
      return updateAnnexNumbers(filtered);
    });
    
    if (selectedAnnexId === id) {
      setSelectedAnnexId(null);
    }
    
    toast.success('Anexa eliminată');
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setAnnexes(currentAnnexes => 
      (currentAnnexes || []).map(annex => 
        annex.id === id 
          ? { ...annex, userTitle: title.trim() || undefined }
          : annex
      )
    );
  };

  const handleMoveUp = (id: string) => {
    setAnnexes(currentAnnexes => {
      const current = currentAnnexes || [];
      const index = current.findIndex(annex => annex.id === id);
      if (index > 0) {
        return reorderAnnexes(current, index, index - 1);
      }
      return current;
    });
  };

  const handleMoveDown = (id: string) => {
    setAnnexes(currentAnnexes => {
      const current = currentAnnexes || [];
      const index = current.findIndex(annex => annex.id === id);
      if (index < current.length - 1) {
        return reorderAnnexes(current, index, index + 1);
      }
      return current;
    });
  };

  const handleExportPDF = async () => {
    if (!annexes || annexes.length === 0) {
      toast.error('Nu există anexe pentru export');
      return;
    }

    try {
      toast.info('Se generează PDF-ul...');
      
      await exportToPDF({
        annexes: annexes,
        opisFormatting: opisFormatting || defaultFormattingOptions,
        coverFormatting: coverFormatting || defaultCoverFormattingOptions,
      });
      
      toast.success('PDF exportat cu succes!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Eroare la exportarea PDF-ului');
    }
  };

  const handleResetFormatting = () => {
    setOpisFormatting(defaultFormattingOptions);
    setCoverFormatting(defaultCoverFormattingOptions);
    toast.success('Formatarea resetată la valorile implicite');
  };

  const safeAnnexes = annexes || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Caselib Bundle</h1>
              <p className="text-sm text-muted-foreground">
                Pregătire profesională de dosare anexe legale
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveProject}>
                <FloppyDisk className="w-4 h-4 mr-2" />
                Salvează proiect
              </Button>
              <Button onClick={handleExportPDF} disabled={safeAnnexes.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Exportă PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Anexe ({safeAnnexes.length})</span>
                  <div className="flex gap-2">
                    {selectedAnnexId && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectedAnnexId && handleMoveUp(selectedAnnexId)}
                          disabled={!selectedAnnex || safeAnnexes.findIndex(a => a.id === selectedAnnexId) === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectedAnnexId && handleMoveDown(selectedAnnexId)}
                          disabled={!selectedAnnex || safeAnnexes.findIndex(a => a.id === selectedAnnexId) === safeAnnexes.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectedAnnexId && handleRemoveAnnex(selectedAnnexId)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  onLoadProject={handleLoadProject}
                />
                
                {safeAnnexes.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {safeAnnexes.map((annex) => (
                        <AnnexListItem
                          key={annex.id}
                          annex={annex}
                          isSelected={selectedAnnexId === annex.id}
                          onSelect={setSelectedAnnexId}
                          onRemove={handleRemoveAnnex}
                          onUpdateTitle={handleUpdateTitle}
                          onMoveUp={handleMoveUp}
                          onMoveDown={handleMoveDown}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Previzualizare</TabsTrigger>
                <TabsTrigger value="formatting">Formatare</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <PreviewPanel
                  selectedAnnex={selectedAnnex}
                  annexes={safeAnnexes}
                  opisFormatting={opisFormatting || defaultFormattingOptions}
                  coverFormatting={coverFormatting || defaultCoverFormattingOptions}
                />
              </TabsContent>
              
              <TabsContent value="formatting" className="space-y-4">
                <FormattingPanel
                  opisFormatting={opisFormatting || defaultFormattingOptions}
                  coverFormatting={coverFormatting || defaultCoverFormattingOptions}
                  onOpisFormattingChange={setOpisFormatting}
                  onCoverFormattingChange={setCoverFormatting}
                  onReset={handleResetFormatting}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;