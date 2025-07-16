export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskCategory = 'Bug' | 'Feature' | 'Documentation' | 'Refactor' | 'Test';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  category: TaskCategory;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  priority?: TaskPriority;
}
