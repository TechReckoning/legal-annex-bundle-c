import React from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Download, FloppyDisk, ArrowUp, ArrowDown, Trash, FolderPlus } from '@phosphor-icons/react';
import caselibLogo from '@/assets/images/caselib-logo.png';

import { AnnexItem, ProjectModel, FormattingOptions, defaultFormattingOptions, defaultCoverFormattingOptions } from '@/types';
import { 
  generateId, 
  updateAnnexNumbers, 
  getDisplayTitle 
} from '@/lib/utils';
import { 
  createAnnexFromFile, 
  addDocumentToAnnex,
  removeDocumentFromAnnex,
  saveProject, 
  loadProject,
  reorderAnnexes 
} from '@/lib/project';
import { 
  exportToPDF
} from '@/lib/pdf-generator';

import { FileUploader } from '@/components/FileUploader';
import { AnnexListItem } from '@/components/AnnexListItem';
import { PreviewPanel } from '@/components/PreviewPanel';
import { FormattingPanel } from '@/components/FormattingPanel';
import { DocumentManager } from '@/components/DocumentManager';
import { MultiDocumentInfo } from '@/components/InfoTooltip';
import { BundleStats } from '@/components/BundleStats';

function App(): React.ReactElement {
  const [annexes, setAnnexes] = useKV<AnnexItem[]>('annexes', []);
  const [opisFormatting, setOpisFormatting] = useKV<FormattingOptions>('opisFormatting', defaultFormattingOptions);
  const [coverFormatting, setCoverFormatting] = useKV<FormattingOptions>('coverFormatting', defaultCoverFormattingOptions);
  const [selectedAnnexId, setSelectedAnnexId] = React.useState<string | null>(null);

  // Ensure annexes is always an array and handle potential storage issues
  const safeAnnexes = React.useMemo(() => {
    try {
      if (!annexes) return [];
      return Array.isArray(annexes) ? annexes.filter(Boolean) : [];
    } catch (error) {
      console.warn('Error accessing annexes:', error);
      return [];
    }
  }, [annexes]);

  // Ensure formatting options are valid
  const safeOpisFormatting = React.useMemo(() => {
    try {
      if (!opisFormatting || typeof opisFormatting !== 'object') {
        return defaultFormattingOptions;
      }
      return { ...defaultFormattingOptions, ...opisFormatting };
    } catch (error) {
      console.warn('Error accessing opis formatting:', error);
      return defaultFormattingOptions;
    }
  }, [opisFormatting]);

  const safeCoverFormatting = React.useMemo(() => {
    try {
      if (!coverFormatting || typeof coverFormatting !== 'object') {
        return defaultCoverFormattingOptions;
      }
      return { ...defaultCoverFormattingOptions, ...coverFormatting };
    } catch (error) {
      console.warn('Error accessing cover formatting:', error);
      return defaultCoverFormattingOptions;
    }
  }, [coverFormatting]);

  const selectedAnnex = React.useMemo(() => {
    try {
      if (!safeAnnexes || !Array.isArray(safeAnnexes) || !selectedAnnexId) return null;
      const found = safeAnnexes.find(annex => annex && typeof annex === 'object' && annex.id === selectedAnnexId);
      return found || null;
    } catch (error) {
      console.warn('Error finding selected annex:', error);
      return null;
    }
  }, [safeAnnexes, selectedAnnexId]);

  const handleFilesSelected = React.useCallback((files: File[]) => {
    try {
      if (!files || !Array.isArray(files)) {
        console.warn('Invalid files provided to handleFilesSelected');
        return;
      }
      
      const validFiles = files.filter(file => file && file instanceof File);
      if (validFiles.length === 0) {
        toast.error('Nu au fost găsite fișiere valide');
        return;
      }

      const newAnnexes = validFiles.map(createAnnexFromFile).filter(Boolean);
      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        const combined = [...current, ...newAnnexes];
        return updateAnnexNumbers(combined);
      });
      
      toast.success(`${validFiles.length} fișier${validFiles.length !== 1 ? 'e' : ''} adăugat${validFiles.length !== 1 ? 'e' : ''}`);
      
      if (validFiles.length > 0 && !selectedAnnexId && newAnnexes.length > 0) {
        setSelectedAnnexId(newAnnexes[0].id);
      }
    } catch (error) {
      console.error('Error adding files:', error);
      toast.error('Eroare la adăugarea fișierelor');
    }
  }, [selectedAnnexId, setAnnexes]);

  const handleLoadProject = React.useCallback(async (file: File) => {
    try {
      if (!file || !(file instanceof File)) {
        toast.error('Fișier de proiect invalid');
        return;
      }

      const projectData = await loadProject(file);
      
      if (projectData.annexes && Array.isArray(projectData.annexes)) {
        const validAnnexes = projectData.annexes.filter(annex => 
          annex && typeof annex === 'object' && annex.id
        );
        setAnnexes(updateAnnexNumbers(validAnnexes));
      }
      if (projectData.opisFormatting && typeof projectData.opisFormatting === 'object') {
        setOpisFormatting({ ...defaultFormattingOptions, ...projectData.opisFormatting });
      } else {
        setOpisFormatting(defaultFormattingOptions);
      }
      if (projectData.coverFormatting && typeof projectData.coverFormatting === 'object') {
        setCoverFormatting({ ...defaultCoverFormattingOptions, ...projectData.coverFormatting });
      } else {
        setCoverFormatting(defaultCoverFormattingOptions);
      }
      
      toast.success('Proiect încărcat cu succes');
    } catch (error) {
      toast.error('Eroare la încărcarea proiectului');
      console.error('Error loading project:', error);
    }
  }, [setAnnexes, setOpisFormatting, setCoverFormatting]);

  const handleSaveProject = React.useCallback(() => {
    try {
      const project: ProjectModel = {
        annexes: safeAnnexes,
        opisFormatting: safeOpisFormatting,
        coverFormatting: safeCoverFormatting,
        projectVersion: '1.0',
      };
      
      saveProject(project);
      toast.success('Proiect salvat');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Eroare la salvarea proiectului');
    }
  }, [safeAnnexes, safeOpisFormatting, safeCoverFormatting]);

  const handleRemoveAnnex = React.useCallback((id: string) => {
    try {
      if (!id || typeof id !== 'string') {
        console.warn('Invalid annex ID provided to handleRemoveAnnex');
        return;
      }

      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        const filtered = current.filter(annex => annex && annex.id !== id);
        return updateAnnexNumbers(filtered);
      });
      
      if (selectedAnnexId === id) {
        setSelectedAnnexId(null);
      }
      
      toast.success('Anexa eliminată');
    } catch (error) {
      console.error('Error removing annex:', error);
      toast.error('Eroare la eliminarea anexei');
    }
  }, [selectedAnnexId, setAnnexes]);

  const handleUpdateTitle = React.useCallback((id: string, title: string) => {
    try {
      if (!id || typeof id !== 'string') {
        console.warn('Invalid annex ID provided to handleUpdateTitle');
        return;
      }

      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        return current.map(annex => {
          if (!annex || annex.id !== id) return annex;
          return { 
            ...annex, 
            userTitle: title && typeof title === 'string' && title.trim() ? title.trim() : undefined 
          };
        });
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Eroare la actualizarea titlului');
    }
  }, [setAnnexes]);

  const handleMoveUp = React.useCallback((id: string) => {
    try {
      if (!id || typeof id !== 'string') {
        console.warn('Invalid annex ID provided to handleMoveUp');
        return;
      }

      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        const index = current.findIndex(annex => annex && annex.id === id);
        if (index > 0) {
          return reorderAnnexes(current, index, index - 1);
        }
        return current;
      });
    } catch (error) {
      console.error('Error moving annex up:', error);
      toast.error('Eroare la reordonarea anexei');
    }
  }, [setAnnexes]);

  const handleMoveDown = React.useCallback((id: string) => {
    try {
      if (!id || typeof id !== 'string') {
        console.warn('Invalid annex ID provided to handleMoveDown');
        return;
      }

      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        const index = current.findIndex(annex => annex && annex.id === id);
        if (index >= 0 && index < current.length - 1) {
          return reorderAnnexes(current, index, index + 1);
        }
        return current;
      });
    } catch (error) {
      console.error('Error moving annex down:', error);
      toast.error('Eroare la reordonarea anexei');
    }
  }, [setAnnexes]);

  const handleExportPDF = React.useCallback(async () => {
    try {
      if (!safeAnnexes || !Array.isArray(safeAnnexes) || safeAnnexes.length === 0) {
        toast.error('Nu există anexe pentru export');
        return;
      }

      // Check if any annex has documents
      const annexesWithDocuments = safeAnnexes.filter(annex => 
        annex && 
        typeof annex === 'object' && 
        annex.documents && 
        Array.isArray(annex.documents) && 
        annex.documents.length > 0
      );
      
      if (annexesWithDocuments.length === 0) {
        toast.error('Nu există documente în anexe pentru export');
        return;
      }

      toast.info('Se inițializează exportul...');
      
      const totalDocuments = annexesWithDocuments.reduce((sum, annex) => 
        sum + (annex.documents?.length || 0), 0
      );
      
      toast.info(`Se procesează ${annexesWithDocuments.length} anexe cu ${totalDocuments} documente...`);
      
      await exportToPDF({
        annexes: annexesWithDocuments, // Only export annexes with documents
        opisFormatting: safeOpisFormatting,
        coverFormatting: safeCoverFormatting,
      });
      
      toast.success(`PDF exportat cu succes! (${annexesWithDocuments.length} anexe, ${totalDocuments} documente)`);
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
      toast.error(`Eroare la exportarea PDF-ului: ${errorMessage}`);
    }
  }, [safeAnnexes, safeOpisFormatting, safeCoverFormatting]);

  const handleAddDocument = React.useCallback((annexId: string, file: File) => {
    try {
      if (!annexId || typeof annexId !== 'string' || !file || !(file instanceof File)) {
        console.warn('Invalid parameters provided to handleAddDocument');
        toast.error('Parametri invalizi pentru adăugarea documentului');
        return;
      }

      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        return current.map(annex => {
          if (!annex || annex.id !== annexId) return annex;
          return addDocumentToAnnex(annex, file);
        });
      });
      
      toast.success('Document adăugat în anexă');
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('Eroare la adăugarea documentului');
    }
  }, [setAnnexes]);

  const handleRemoveDocument = React.useCallback((annexId: string, documentId: string) => {
    try {
      if (!annexId || typeof annexId !== 'string' || !documentId || typeof documentId !== 'string') {
        console.warn('Invalid parameters provided to handleRemoveDocument');
        toast.error('Parametri invalizi pentru eliminarea documentului');
        return;
      }

      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        return current.map(annex => {
          if (!annex || annex.id !== annexId) return annex;
          return removeDocumentFromAnnex(annex, documentId);
        }).filter(annex => 
          annex && 
          annex.documents && 
          Array.isArray(annex.documents) && 
          annex.documents.length > 0
        ); // Remove empty annexes
      });
      
      // If the current annex becomes empty, clear selection
      const updatedAnnex = safeAnnexes.find(a => a && a.id === annexId);
      if (updatedAnnex && 
          updatedAnnex.documents && 
          Array.isArray(updatedAnnex.documents) && 
          updatedAnnex.documents.length === 1) { 
        // Will become 0 after removal
        setSelectedAnnexId(null);
      }
      
      toast.success('Document eliminat din anexă');
    } catch (error) {
      console.error('Error removing document:', error);
      toast.error('Eroare la eliminarea documentului');
    }
  }, [setAnnexes, safeAnnexes]);

  const handleCreateNewAnnex = React.useCallback(() => {
    try {
      const newAnnex: AnnexItem = {
        id: generateId(),
        annexNumber: 0,
        documents: [],
      };
      
      setAnnexes(currentAnnexes => {
        const current = Array.isArray(currentAnnexes) ? currentAnnexes.filter(Boolean) : [];
        const combined = [...current, newAnnex];
        return updateAnnexNumbers(combined);
      });
      
      setSelectedAnnexId(newAnnex.id);
      toast.success('Anexă nouă creată');
    } catch (error) {
      console.error('Error creating new annex:', error);
      toast.error('Eroare la crearea anexei');
    }
  }, [setAnnexes]);

  const handleResetFormatting = React.useCallback(() => {
    try {
      setOpisFormatting(defaultFormattingOptions);
      setCoverFormatting(defaultCoverFormattingOptions);
      toast.success('Formatarea resetată la valorile implicite');
    } catch (error) {
      console.error('Error resetting formatting:', error);
      toast.error('Eroare la resetarea formatării');
    }
  }, [setOpisFormatting, setCoverFormatting]);

  const annexesWithDocuments = React.useMemo(() => {
    try {
      if (!safeAnnexes || !Array.isArray(safeAnnexes)) return [];
      return safeAnnexes.filter(annex => 
        annex && 
        typeof annex === 'object' && 
        annex.documents && 
        Array.isArray(annex.documents) && 
        annex.documents.length > 0
      );
    } catch (error) {
      console.warn('Error computing annexes with documents:', error);
      return [];
    }
  }, [safeAnnexes]);

  try {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={caselibLogo} 
                  alt="Caselib Logo" 
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Caselib Bundle</h1>
                  <p className="text-sm text-muted-foreground">
                    Anexe pregătite profesionist și eficient - Organizați multiple documente PDF în anexe structurate
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSaveProject}>
                  <FloppyDisk className="w-4 h-4 mr-2" />
                  Salvează proiect
                </Button>
                <Button onClick={handleExportPDF} disabled={annexesWithDocuments.length === 0}>
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
              <BundleStats annexes={safeAnnexes} />
              <MultiDocumentInfo />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span>
                        Anexe ({safeAnnexes.length}
                        {annexesWithDocuments.length !== safeAnnexes.length && 
                          `, ${annexesWithDocuments.length} cu documente`
                        })
                      </span>
                      <span className="text-xs font-normal text-muted-foreground mt-1">
                        Fiecare anexă poate conține multiple documente PDF
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {selectedAnnexId && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectedAnnexId && handleMoveUp(selectedAnnexId)}
                            disabled={!selectedAnnex || !safeAnnexes || safeAnnexes.findIndex(a => a && a.id === selectedAnnexId) === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectedAnnexId && handleMoveDown(selectedAnnexId)}
                            disabled={!selectedAnnex || !safeAnnexes || safeAnnexes.findIndex(a => a && a.id === selectedAnnexId) === safeAnnexes.length - 1}
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
                  
                  <Button
                    variant="outline"
                    onClick={handleCreateNewAnnex}
                    className="w-full"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Creează anexă nouă
                  </Button>
                  
                  {safeAnnexes.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {Array.isArray(safeAnnexes) && safeAnnexes.length > 0 ? (
                          safeAnnexes.map((annex) => (
                            annex && annex.id ? (
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
                            ) : null
                          )).filter(Boolean)
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            Nu există anexe
                          </div>
                        )}
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
                    opisFormatting={safeOpisFormatting}
                    coverFormatting={safeCoverFormatting}
                  />
                  
                  {selectedAnnex && (
                    <DocumentManager
                      annex={selectedAnnex}
                      onAddDocument={handleAddDocument}
                      onRemoveDocument={handleRemoveDocument}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="formatting" className="space-y-4">
                  <FormattingPanel
                    opisFormatting={safeOpisFormatting}
                    coverFormatting={safeCoverFormatting}
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
  } catch (error) {
    console.error('Render error in App component:', error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-destructive mb-2">Eroare de afișare</h1>
          <p className="text-muted-foreground mb-4">A apărut o eroare la afișarea aplicației.</p>
          <Button onClick={() => window.location.reload()}>
            Reîncarcă aplicația
          </Button>
        </div>
      </div>
    );
  }
}

export default App;