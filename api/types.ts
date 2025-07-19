export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskCategory = 'Bug' | 'Feature' | 'Documentation' | 'Refactor' | 'Test';
export type TaskPriority = 'Low' | 'Medium' | 'High';

/**
 * Task interface representing a single task item
 * @interface Task
 */
export interface Task {
    /** Unique identifier for the task */
    id: string;
    /** Task title/name */
    title: string;
    /** Optional task description */
    description?: string;
    /** Task category type */
    category: TaskCategory;
    /** Current task status */
    status: TaskStatus;
    /** Task priority level */
    priority: TaskPriority;
    /** Date when task was created */
    createdAt: Date;
    /** Date when task was last updated */
    updatedAt: Date;
}

/**
 * Request interface for creating a new task
 * @interface CreateTaskRequest
 */
export interface CreateTaskRequest {
    /** Task title/name */
    title: string;
    /** Optional task description */
    description?: string;
    /** Task category type */
    category: TaskCategory;
    /** Initial task status (defaults to 'To Do') */
    status?: TaskStatus;
    /** Task priority level (defaults to 'Medium') */
    priority?: TaskPriority;
}

/**
 * Request interface for updating an existing task
 * @interface UpdateTaskRequest
 */
export interface UpdateTaskRequest {
    /** Task title/name */
    title?: string;
    /** Optional task description */
    description?: string;
    /** Task category type */
    category?: TaskCategory;
    /** Current task status */
    status?: TaskStatus;
    /** Task priority level */
    priority?: TaskPriority;
}
