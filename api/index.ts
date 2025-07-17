import { Hono } from 'hono'
import { cors } from 'hono/cors'
import tasks from '../src/routes/tasks'

const app = new Hono()

app.use('*', cors({
    origin: (origin) => {
        console.log('CORS Origin:', origin)
        const allowedOrigins = [
            'https://rnegic.github.io',
            'https://rnegic.github.io/trello',
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        if (!origin) return origin;
        if (allowedOrigins.includes(origin)) return origin;
        if (origin.match(/^https:\/\/.*\.vercel\.app$/)) return origin;
        return null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
}))

app.get('/debug', (c) => {
    return c.json({
        origin: c.req.header('origin'),
        userAgent: c.req.header('user-agent'),
        method: c.req.method,
        url: c.req.url,
        headers: (() => {
            const headersObj: Record<string, string> = {};
            c.req.raw.headers.forEach((value, key) => {
                headersObj[key] = value;
            });
            return headersObj;
        })()
    })
})

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

export default app