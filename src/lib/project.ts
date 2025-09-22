import { AnnexItem, ProjectModel, defaultFormattingOptions, defaultCoverFormattingOptions } from '@/types';
import { generateId, generateAutoTitle, updateAnnexNumbers } from '@/lib/utils';

export const createAnnexFromFile = (file: File): AnnexItem => {
  return {
    id: generateId(),
    annexNumber: 0,
    sourceFilePath: file.name,
    autoTitle: generateAutoTitle(file.name),
    file,
  };
};

export const saveProject = (project: ProjectModel): void => {
  const projectData = {
    ...project,
    annexes: project.annexes.map(({ file, ...annex }) => annex), // Remove file objects for serialization
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
  
  return {
    annexes: data.annexes || [],
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