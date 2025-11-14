import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

/**
 * Inicia la aplicación NestJS
 * 
 * Configura el servidor HTTP y habilita CORS para permitir
 * solicitudes desde el frontend Angular.
 * 
 * @async
 * @function bootstrap
 * @throws {Error} Si la aplicación no puede iniciarse
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Usa PORT de Render o 3000 en local
  const port = Number(process.env.PORT) || 3000;

  // Permite CORS desde tu frontend en producción y localhost en desarrollo
  let frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

  // Normalizar: remover trailing slash y protocolo para comparación
  const normalizedOrigin = frontendOrigin.replace(/\/$/, '');

  app.enableCors({
    origin: (origin, callback) => {
      // Si no hay origin (requests sin CORS como mobile apps), permitir
      if (!origin) {
        callback(null, true);
        return;
      }

      // Normalizar origin recibido
      const normalizedReceivedOrigin = origin.replace(/\/$/, '');

      // Permitir si coincide exactamente
      if (normalizedReceivedOrigin === normalizedOrigin) {
        callback(null, true);
        return;
      }

      // Permitir localhost en cualquier puerto (desarrollo)
      if (normalizedReceivedOrigin.includes('localhost')) {
        callback(null, true);
        return;
      }

      // Permitir vercel.app en cualquier dominio (desarrollo/producción)
      if (normalizedReceivedOrigin.includes('vercel.app')) {
        callback(null, true);
        return;
      }

      // Si no cumple ninguna condición, denegar
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port);
  console.log(`API escuchando en puerto ${port}`);
  console.log(`CORS configurado para frontend: ${normalizedOrigin}`);
}

bootstrap();