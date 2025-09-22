import { AnnexItem, DocumentItem, ProjectModel, defaultFormattingOptions, defaultCoverFormattingOptions } from '@/types';
import { generateId, generateAutoTitle, updateAnnexNumbers } from '@/lib/utils';

export const createDocumentFromFile = (file: File): DocumentItem => {
  return {
    id: generateId(),
    sourceFilePath: file.name,
    autoTitle: generateAutoTitle(file.name),
    file,
  };
};

export const createAnnexFromFile = (file: File): AnnexItem => {
  const document = createDocumentFromFile(file);
  return {
    id: generateId(),
    annexNumber: 0,
    documents: [document],
  };
};

export const addDocumentToAnnex = (annex: AnnexItem, file: File): AnnexItem => {
  const document = createDocumentFromFile(file);
  return {
    ...annex,
    documents: [...(annex.documents || []), document],
  };
};

export const removeDocumentFromAnnex = (annex: AnnexItem, documentId: string): AnnexItem => {
  return {
    ...annex,
    documents: (annex.documents || []).filter(doc => doc.id !== documentId),
  };
};

export const saveProject = (project: ProjectModel): void => {
  const projectData = {
    ...project,
    annexes: project.annexes.map(annex => ({
      ...annex,
      documents: (annex.documents || []).map(({ file, ...doc }) => doc) // Remove file objects for serialization
    })),
  };
  
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'annex-bundle.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const loadProject = async (file: File): Promise<Partial<ProjectModel>> => {
  const text = await file.text();
  const data = JSON.parse(text);
  
  // Ensure all annexes have the documents property properly initialized
  const normalizedAnnexes = (data.annexes || []).map((annex: any) => ({
    ...annex,
    documents: annex.documents || []
  }));
  
  return {
    annexes: normalizedAnnexes,
    opisFormatting: data.opisFormatting || defaultFormattingOptions,
    coverFormatting: data.coverFormatting || defaultCoverFormattingOptions,
    projectVersion: data.projectVersion || '1.0',
  };
};

export const reorderAnnexes = (annexes: AnnexItem[], dragIndex: number, hoverIndex: number): AnnexItem[] => {
  const draggedItem = annexes[dragIndex];
  const reordered = [...annexes];
  reordered.splice(dragIndex, 1);
  reordered.splice(hoverIndex, 0, draggedItem);
  
  return updateAnnexNumbers(reordered);
};