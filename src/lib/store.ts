import { Edition } from '@/types/newspaper';

const EDITIONS_KEY = 'newspaper_editions';

export function getEditions(): Edition[] {
  try {
    const data = localStorage.getItem(EDITIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getEdition(id: string): Edition | undefined {
  return getEditions().find((e) => e.id === id);
}

export function saveEdition(edition: Edition): void {
  const editions = getEditions();
  const index = editions.findIndex((e) => e.id === edition.id);
  edition.updatedAt = new Date().toISOString();
  if (index >= 0) {
    editions[index] = edition;
  } else {
    editions.push(edition);
  }
  localStorage.setItem(EDITIONS_KEY, JSON.stringify(editions));
}

export function deleteEdition(id: string): void {
  const editions = getEditions().filter((e) => e.id !== id);
  localStorage.setItem(EDITIONS_KEY, JSON.stringify(editions));
}

export function exportAllData(): void {
  const data = localStorage.getItem(EDITIONS_KEY) || '[]';
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newspaper-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<Edition[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const editions: Edition[] = JSON.parse(e.target?.result as string);
        if (!Array.isArray(editions)) throw new Error('Invalid format');
        localStorage.setItem(EDITIONS_KEY, JSON.stringify(editions));
        resolve(editions);
      } catch {
        reject(new Error('Invalid data file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
