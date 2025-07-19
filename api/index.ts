import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import tasks from './tasks'

export const config = {
    runtime: 'edge'
}

const app = new Hono()

app.use('*', cors({
    origin: ['https://rnegic.github.io', 'http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'X-Powered-By'],
}))

app.get('/', (c) => {
    return c.json({
        message: 'Task Manager API',
        version: '1.0.0',
        endpoints: {
            tasks: '/tasks'
        }
    })
})

app.route('/api/tasks', tasks)

export default handle(app)