import { Hono } from 'hono'
// Use native Edge fetch handler
import { cors } from 'hono/cors'

export const config = {
    runtime: 'edge'
}

const app = new Hono()

app.use('*', cors({
    origin: ['https://rnegic.github.io', 'http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}))


app.get('/', (c) => {
    return c.json({
        message: 'Task Manager API',
        version: '1.0.0',
        status: 'working'
    })
})

app.get('/debug', (c) => {
    return c.json({
        message: 'Debug endpoint works',
        timestamp: new Date().toISOString()
    })
})

app.get('/api/tasks', (c) => {
    return c.json({
        success: true,
        data: [],
        message: 'Tasks endpoint working'
    })
})

// Export Edge fetch handler
export default app.fetch