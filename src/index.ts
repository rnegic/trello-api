import { Hono } from 'hono'
import { cors } from 'hono/cors'
import tasks from '../src/routes/tasks'

const app = new Hono()

app.use('*', cors({
  origin: ['https://rnegic.github.io', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
}))

app.get('/', (c) => {
  return c.json({
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks'
    }
  })
})

app.route('/api/tasks', tasks)

export default app