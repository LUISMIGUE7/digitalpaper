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

  // Obtener el puerto desde variables de entorno o usar el por defecto
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Habilitar CORS para que el frontend pueda consumir la API
  app.enableCors({
    origin: 'http://localhost:4200', // Frontend Angular por defecto
    credentials: true,
  });

  await app.listen(port);
  console.log(`Aplicación ejecutándose en http://localhost:${port}`);
}

bootstrap();
