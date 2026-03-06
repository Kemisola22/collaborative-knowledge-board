export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
}

export interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string;
  tags: string[];
  dueDate: string | null;
}