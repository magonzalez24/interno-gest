import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Routes
import authRoutes from './routes/auth.routes';
import officesRoutes from './routes/offices.routes';
import departmentsRoutes from './routes/departments.routes';
import employeesRoutes from './routes/employees.routes';
import projectsRoutes from './routes/projects.routes';
import technologiesRoutes from './routes/technologies.routes';
import timeEntriesRoutes from './routes/timeEntries.routes';
import expensesRoutes from './routes/expenses.routes';
import invoicesRoutes from './routes/invoices.routes';
import dashboardRoutes from './routes/dashboard.routes';
import usersRoutes from './routes/users.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
const swaggerPath = path.join(__dirname, '../swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Backend - Documentación',
  customfavIcon: '/favicon.ico',
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes); // Debe ir antes de /api/offices para evitar conflictos
app.use('/api/offices', officesRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/technologies', technologiesRoutes);
app.use('/api/time-entries', timeEntriesRoutes);
app.use('/api/projects', expensesRoutes); // /api/projects/:projectId/expenses
app.use('/api/projects', invoicesRoutes); // /api/projects/:projectId/invoices
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;

