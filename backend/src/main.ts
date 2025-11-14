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

  // Normalizar: remover trailing slash si existe
  frontendOrigin = frontendOrigin.replace(/\/$/, '');

  // Permitir múltiples orígenes en desarrollo (localhost con diferentes puertos)
  const allowedOrigins = [
    frontendOrigin,
    'http://localhost:4200',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Si no hay origin (requests sin CORS como mobile apps), permitir
      if (!origin) {
        callback(null, true);
      }
      // Si el origin está en la lista blanca, permitir
      else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      }
      // Si no está en la lista, denegar
      else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  });

  await app.listen(port);
  console.log(`API escuchando en puerto ${port}`);
}

bootstrap();