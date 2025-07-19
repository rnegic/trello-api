import express from 'express'
import cors from 'cors'
import { Task } from './types.js'

const app = express()

app.use(cors({
    origin: ['https://rnegic.github.io', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}))

app.use(express.json())

let tasksStorage: Task[] = [
    {
        id: '1',
        title: 'Create Task API',
        description: 'Develop REST API using Express',
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
]

function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11)
}

app.get('/', (req: any, res: any) => {
    res.json({
        message: 'Task Manager API',
        version: '1.0.0',
        status: 'working',
        endpoints: {
            tasks: '/api/tasks'
        }
    })
})

app.get('/debug', (req: any, res: any) => {
    res.json({
        message: 'Debug endpoint works',
        timestamp: new Date().toISOString()
    })
})

// GET /api/tasks
app.get('/api/tasks', (req: any, res: any) => {
    const { search, date } = req.query
    let filteredTasks = [...tasksStorage]

    if (search && typeof search === 'string') {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
        )
    }

    if (date && typeof date === 'string') {
        const searchDate = new Date(date)
        if (!isNaN(searchDate.getTime())) {
            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.createdAt)
                return taskDate.toDateString() === searchDate.toDateString()
            })
        }
    }

    res.json({
        success: true,
        data: filteredTasks,
        count: filteredTasks.length,
        total: tasksStorage.length
    })
})

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req: any, res: any) => {
    const { id } = req.params
    const task = tasksStorage.find(task => task.id === id)

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        })
    }

    res.json({
        success: true,
        data: task
    })
})

// POST /api/tasks
app.post('/api/tasks', (req: any, res: any) => {
    try {
        const { title, description, category, status, priority } = req.body

        // Валидация
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required and must be a non-empty string'
            })
        }

        const validCategories = ['Bug', 'Feature', 'Documentation', 'Refactor', 'Test']
        if (!category || !validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Category is required and must be one of: ${validCategories.join(', ')}`
            })
        }

        const now = new Date()
        const newTask: Task = {
            id: generateId(),
            title: title.trim(),
            description: description?.trim(),
            category,
            status: status || 'To Do',
            priority: priority || 'Medium',
            createdAt: now,
            updatedAt: now
        }

        tasksStorage.push(newTask)

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid request data'
        })
    }
})

// PATCH /api/tasks/:id
app.patch('/api/tasks/:id', (req: any, res: any) => {
    try {
        const { id } = req.params
        const { title, description, category, status, priority } = req.body

        const taskIndex = tasksStorage.findIndex(task => task.id === id)

        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            })
        }

        const updatedTask: Task = {
            ...tasksStorage[taskIndex],
            ...(title !== undefined && { title: title.trim() }),
            ...(description !== undefined && { description: description?.trim() }),
            ...(category !== undefined && { category }),
            ...(status !== undefined && { status }),
            ...(priority !== undefined && { priority }),
            updatedAt: new Date()
        }

        tasksStorage[taskIndex] = updatedTask

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid request data'
        })
    }
})

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req: any, res: any) => {
    const { id } = req.params
    const taskIndex = tasksStorage.findIndex(task => task.id === id)

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        })
    }

    const deletedTask = tasksStorage.splice(taskIndex, 1)[0]

    res.json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask
    })
})

app.use('*', (req: any, res: any) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

export default app