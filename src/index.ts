import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import tasks from './routes/tasks'

const app = new Hono()

app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'https://rnegic.github.io/trello', 
      'https://rnegic.github.io',
      'http://localhost:5173', 
      'http://localhost:3000'
    ];
    
    // Разрешить запросы без origin (например, из Postman)
    if (!origin) return origin;
    
    // Проверить точные совпадения
    if (allowedOrigins.includes(origin)) return origin;
    
    // Проверить Vercel домены
    if (origin.match(/^https:\/\/.*\.vercel\.app$/)) return origin;
    
    return null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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
