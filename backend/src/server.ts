import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

