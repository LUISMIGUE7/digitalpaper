import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Session } from './session.entity';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

/**
 * Servicio de autenticación
 * 
 * Gestiona el registro, inicio de sesión, validación de sesiones
 * y gestión de tokens de autenticación usando base de datos.
 * 
 * @class AuthService
 * @public
 */
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Session) private sessionRepo: Repository<Session>,
    ) { }

    /**
     * Registra un nuevo usuario en el sistema
     * 
     * Verifica que el nombre de usuario no exista y hashea la contraseña
     * antes de guardarla en la base de datos.
     * 
     * @param {string} username - Nombre de usuario único
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<{id: number, username: string}>} Datos del usuario creado (sin contraseña)
     * @throws {ConflictException} Si el nombre de usuario ya existe
     * 
     * @example
     * const user = await authService.register('john_doe', 'securePassword123');
     * // { id: 1, username: 'john_doe' }
     */
    async register(username: string, password: string): Promise<{ id: number; username: string }> {
        // Verificar si el usuario ya existe
        const existingUser = await this.userRepo.findOne({ where: { username } });
        if (existingUser) {
            throw new ConflictException('El nombre de usuario ya existe');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = this.userRepo.create({
            username,
            password: hashedPassword,
        });

        const savedUser = await this.userRepo.save(user);
        return { id: savedUser.id, username: savedUser.username };
    }

    /**
     * Valida las credenciales de un usuario
     * 
     * Compara la contraseña proporcionada con la almacenada usando bcrypt
     * y verifica que el usuario esté activo.
     * 
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<{id: number, username: string} | null>} Datos del usuario si es válido, null en caso contrario
     * 
     * @private
     */
    async validateUser(username: string, password: string): Promise<{ id: number; username: string } | null> {
        const user = await this.userRepo.findOne({ where: { username } });
        if (!user || !user.isActive) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return { id: user.id, username: user.username };
    }

    /**
     * Inicia sesión y crea una sesión persistente
     * 
     * Valida las credenciales y crea un token de sesión único que se guarda
     * en la base de datos. La sesión es válida por 30 días.
     * 
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise<{id: number, username: string, token: string}>} Datos del usuario y token de sesión
     * @throws {UnauthorizedException} Si las credenciales son inválidas
     * 
     * @example
     * const session = await authService.login('john_doe', 'securePassword123');
     * // { id: 1, username: 'john_doe', token: 'a1b2c3d4...' }
     */
    async login(username: string, password: string): Promise<{ id: number; username: string; token: string }> {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token único
        const token = crypto.randomBytes(32).toString('hex');

        // Crear sesión válida por 30 días
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const session = this.sessionRepo.create({
            token,
            userId: user.id,
            expiresAt,
            isActive: true,
        });

        await this.sessionRepo.save(session);

        return { id: user.id, username: user.username, token };
    }

    /**
     * Valida un token de sesión contra la base de datos
     * 
     * Verifica que el token exista, esté activo y no haya expirado.
     * También valida que el usuario asociado siga activo.
     * 
     * @param {string} token - Token de sesión a validar
     * @returns {Promise<{id: number, username: string} | null>} Datos del usuario si la sesión es válida, null en caso contrario
     * 
     * @example
     * const user = await authService.validateSession('a1b2c3d4...');
     * // { id: 1, username: 'john_doe' } o null
     */
    async validateSession(token: string): Promise<{ id: number; username: string } | null> {
        // Buscar sesión activa y válida
        const session = await this.sessionRepo.findOne({
            where: { token, isActive: true },
            relations: ['user'],
        });

        if (!session) {
            return null;
        }

        // Verificar si la sesión no ha expirado
        if (new Date() > session.expiresAt) {
            // Marcar sesión como inactiva
            session.isActive = false;
            await this.sessionRepo.save(session);
            return null;
        }

        // Verificar que el usuario sigue activo
        if (!session.user || !session.user.isActive) {
            return null;
        }

        return { id: session.user.id, username: session.user.username };
    }

    /**
     * Cierra la sesión del usuario
     * 
     * Marca la sesión como inactiva en la base de datos, invalidando el token.
     * 
     * @param {string} token - Token de sesión a invalidar
     * @returns {Promise<void>}
     * 
     * @example
     * await authService.logout('a1b2c3d4...');
     */
    async logout(token: string): Promise<void> {
        const session = await this.sessionRepo.findOne({ where: { token } });
        if (session) {
            session.isActive = false;
            await this.sessionRepo.save(session);
        }
    }

    /**
     * Limpia sesiones expiradas de la base de datos
     * 
     * Marca como inactivas todas las sesiones cuya fecha de expiración
     * haya pasado. Útil para ejecutar periódicamente como tarea programada.
     * 
     * @returns {Promise<void>}
     * 
     * @example
     * // Ejecutar diariamente para limpiar sesiones expiradas
     * await authService.cleanupExpiredSessions();
     */
    async cleanupExpiredSessions(): Promise<void> {
        // Marcar sesiones expiradas como inactivas
        await this.sessionRepo
            .createQueryBuilder()
            .update(Session)
            .set({ isActive: false })
            .where('expiresAt < :now', { now: new Date() })
            .andWhere('isActive = :active', { active: true })
            .execute();
    }
}

