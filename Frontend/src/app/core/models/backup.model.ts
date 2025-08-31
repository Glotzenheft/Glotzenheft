export interface Backup {
  id: number;
  type: 'import' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string;
  itemCount: number | null;
  completedAt: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
