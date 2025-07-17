import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import tasks from '../src/routes/tasks'

export const config = {
  runtime: 'edge'
}

const app = new Hono()

app.use('*', cors({
  origin: ['https://rnegic.github.io', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Powered-By'],
}))

app.get('/debug', (c) => {
  return c.json({
    origin: c.req.header('origin') || 'no origin',
    path: c.req.path,
    method: c.req.method
  })
})

app.get('/', (c) => {
  return c.json({
    message: 'Task Manager API',
    version: '1.0.0'
  })
})

app.route('/api/tasks', tasks)

export default handle(app)