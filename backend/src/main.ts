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
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  await app.listen(port);
  console.log(`API escuchando en puerto ${port}`);
}

bootstrap();