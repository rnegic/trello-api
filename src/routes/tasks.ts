import { Hono } from 'hono';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskCategory, TaskPriority } from '../types';

const tasks = new Hono();

let tasksStorage: Task[] = [
  {
    id: '1',
    title: 'Создать API для задач',
    description: 'Разработать REST API с использованием Hono и Bun',
    category: 'Feature',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: '2',
    title: 'Написать документацию',
    description: 'Создать README с описанием API',
    category: 'Documentation',
    status: 'To Do',
    priority: 'Medium'
  }
];

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

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

// GET /api/tasks
tasks.get('/', (c) => {
  return c.json({
    success: true,
    data: tasksStorage,
    count: tasksStorage.length
  });
});

// POST /api/tasks
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
    
    const newTask: Task = {
      id: generateId(),
      title: body.title.trim(),
      description: body.description?.trim(),
      category: body.category,
      status: body.status || 'To Do',
      priority: body.priority || 'Medium'
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

// PUT /api/tasks/:id 
tasks.put('/:id', async (c) => {
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
    
    const updatedTask: Task = {
      ...tasksStorage[taskIndex],
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description?.trim() }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && { priority: body.priority })
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

// DELETE /api/tasks/:id 
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
