import { Hono } from 'hono';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskCategory, TaskPriority } from '../src/types';

const tasks = new Hono();

/**
 * In-memory storage for tasks
 * @type {Task[]} Array of task objects
 */
let tasksStorage: Task[] = [
  {
    id: '1',
    title: 'Create Task API',
    description: 'Develop REST API using Hono and Bun',
    category: 'Feature',
    status: 'In Progress',
    priority: 'High',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Write Documentation',
    description: 'Create README with API description',
    category: 'Documentation',
    status: 'To Do',
    priority: 'Medium',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

/**
 * Generate unique ID for new tasks
 * @returns {string} Unique identifier
 */
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Validate task creation request
 * @param {any} data - Request data to validate
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 */
function validateCreateTask(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  const validCategories: TaskCategory[] = ['Bug', 'Feature', 'Documentation', 'Refactor', 'Test'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push(`Category is required and must be one of: ${validCategories.join(', ')}`);
  }
  
  const validStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  const validPriorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Validate task update request
 * @param {any} data - Request data to validate
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 */
function validateUpdateTask(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim() === '')) {
    errors.push('Title must be a non-empty string');
  }
  
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  const validCategories: TaskCategory[] = ['Bug', 'Feature', 'Documentation', 'Refactor', 'Test'];
  if (data.category !== undefined && !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }
  
  const validStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
  if (data.status !== undefined && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  const validPriorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  if (data.priority !== undefined && !validPriorities.includes(data.priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }
  
  return { isValid: errors.length === 0, errors };
}

// GET /tasks - получить все задачи с поиском по названию и дате
tasks.get('/', (c) => {
  const { search, date } = c.req.query();
  let filteredTasks = [...tasksStorage];

  // Поиск по названию
  if (search) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Поиск по дате
  if (date) {
    const searchDate = new Date(date);
    if (!isNaN(searchDate.getTime())) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === searchDate.toDateString();
      });
    }
  }

  return c.json({
    success: true,
    data: filteredTasks,
    count: filteredTasks.length,
    total: tasksStorage.length
  });
});

// GET /tasks/:id - получить задачу по ID
tasks.get('/:id', (c) => {
  const id = c.req.param('id');
  const task = tasksStorage.find(task => task.id === id);
  
  if (!task) {
    return c.json({
      success: false,
      message: 'Task not found'
    }, 404);
  }
  
  return c.json({
    success: true,
    data: task
  });
});

// POST /tasks - создать новую задачу
tasks.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { isValid, errors } = validateCreateTask(body);
    
    if (!isValid) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors
      }, 400);
    }
    
    const now = new Date();
    const newTask: Task = {
      id: generateId(),
      title: body.title.trim(),
      description: body.description?.trim(),
      category: body.category,
      status: body.status || 'To Do',
      priority: body.priority || 'Medium',
      createdAt: now,
      updatedAt: now
    };
    
    tasksStorage.push(newTask);
    
    return c.json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid JSON format'
    }, 400);
  }
});

// PATCH /tasks/:id - обновить задачу
tasks.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const taskIndex = tasksStorage.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return c.json({
        success: false,
        message: 'Task not found'
      }, 404);
    }
    
    const { isValid, errors } = validateUpdateTask(body);
    
    if (!isValid) {
      return c.json({
        success: false,
        message: 'Validation failed',
        errors
      }, 400);
    }
    
    // Обновляем только переданные поля
    const updatedTask: Task = {
      ...tasksStorage[taskIndex],
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description?.trim() }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && { priority: body.priority }),
      updatedAt: new Date()
    };
    
    tasksStorage[taskIndex] = updatedTask;
    
    return c.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid JSON format'
    }, 400);
  }
});

// DELETE /tasks/:id - удалить задачу
tasks.delete('/:id', (c) => {
  const id = c.req.param('id');
  const taskIndex = tasksStorage.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return c.json({
      success: false,
      message: 'Task not found'
    }, 404);
  }
  
  const deletedTask = tasksStorage.splice(taskIndex, 1)[0];
  
  return c.json({
    success: true,
    message: 'Task deleted successfully',
    data: deletedTask
  });
});

export default tasks;
