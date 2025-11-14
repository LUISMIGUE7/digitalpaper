import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './notes/note.entity';
import { Tag } from './tags/tag.entity';
import { User } from './auth/user.entity';
import { Session } from './auth/session.entity';
import { NoteModule } from './notes/note.module';
import { TagModule } from './tags/tag.module';
import { AuthModule } from './auth/auth.module';

/**
 * Módulo principal de la aplicación Digital Paper
 * 
 * Este módulo configura:
 * - TypeORM para la conexión a la base de datos PostgreSQL
 * - Módulos de funcionalidad: Notes, Tags, Auth
 * - Variables de entorno para configuración
 * 
 * @module AppModule
 */
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Configuración de TypeORM con variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('DB_PASSWORD');
        if (!password) {
          throw new Error('DB_PASSWORD no está definida en las variables de entorno. Por favor, crea un archivo .env con la configuración de la base de datos.');
        }
        
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: password,
          database: configService.get<string>('DB_DATABASE', 'digitalpaper'),
          entities: [Note, Tag, User, Session],
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
        };
      },
      inject: [ConfigService],
    }),
    NoteModule,
    TagModule,
    AuthModule,
  ],
})
export class AppModule { }
