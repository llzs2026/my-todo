export type Priority = 'high' | 'medium' | 'low' | 'none';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'workdays' | 'monthly' | 'yearly';
export type ViewType = 'today' | 'tomorrow' | 'next7days' | 'inbox' | 'completed' | string;

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  listId: string;
  repeat: RepeatType;
  createdAt: number;
  completedAt: number | null;
  tags: string[];
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
}
