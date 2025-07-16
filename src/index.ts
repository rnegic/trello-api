import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import tasks from './routes/tasks'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
}))

// handle CORS preflight requests
app.options('*', (c) => {
  return new Response(null, { status: 204 })
})

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

app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found'
  }, 404)
})

app.onError((err, c) => {
  console.error(err)
  return c.json({
    success: false,
    message: 'Internal server error'
  }, 500)
})

// Экспорт для Vercel
export default app.fetch

// Для локальной разработки
if (require.main === module) {
  const port = 3000
  console.log(`Server is running on port ${port}`)
  
  serve({
    fetch: app.fetch,
    port
  })
}
