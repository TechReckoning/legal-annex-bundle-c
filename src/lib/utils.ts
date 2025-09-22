import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AnnexItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getDisplayTitle = (annex: AnnexItem): string => {
  return annex.userTitle || annex.autoTitle;
};

export const generateAutoTitle = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
};

export const updateAnnexNumbers = (annexes: AnnexItem[]): AnnexItem[] => {
  return annexes.map((annex, index) => ({
    ...annex,
    annexNumber: index + 1,
  }));
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateFilePath = (path: string, maxLength: number = 40): string => {
  if (path.length <= maxLength) return path;
  const start = path.substring(0, 15);
  const end = path.substring(path.length - 20);
  return `${start}...${end}`;
};