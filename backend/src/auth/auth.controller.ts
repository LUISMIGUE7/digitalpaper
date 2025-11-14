import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controlador de autenticación
 * 
 * Expone endpoints REST para el registro, inicio de sesión,
 * validación de sesiones y cierre de sesión.
 * 
 * @controller auth
 * @public
 */
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Registra un nuevo usuario
     * 
     * @route POST /auth/register
     * @param {Object} body - Cuerpo de la petición
     * @param {string} body.username - Nombre de usuario único
     * @param {string} body.password - Contraseña en texto plano
     * @returns {Promise<{id: number, username: string}>} Datos del usuario creado
     * @throws {ConflictException} Si el usuario ya existe
     * 
     * @example
     * POST /auth/register
     * Body: { "username": "john_doe", "password": "securePassword123" }
     */
    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        return this.authService.register(body.username, body.password);
    }

    /**
     * Inicia sesión y retorna un token
     * 
     * @route POST /auth/login
     * @param {Object} body - Cuerpo de la petición
     * @param {string} body.username - Nombre de usuario
     * @param {string} body.password - Contraseña
     * @returns {Promise<{id: number, username: string, token: string}>} Datos del usuario y token de sesión
     * @throws {UnauthorizedException} Si las credenciales son inválidas
     * 
     * @example
     * POST /auth/login
     * Body: { "username": "john_doe", "password": "securePassword123" }
     */
    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        try {
            return this.authService.login(body.username, body.password);
        } catch (error) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }

    /**
     * Valida un token de sesión
     * 
     * @route GET /auth/validate
     * @param {string} authorization - Header con el token en formato "Bearer {token}"
     * @returns {Promise<{id: number, username: string}>} Datos del usuario si el token es válido
     * @throws {UnauthorizedException} Si el token no es válido o expiró
     * 
     * @example
     * GET /auth/validate
     * Headers: { "Authorization": "Bearer a1b2c3d4..." }
     */
    @Get('validate')
    async validateSession(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        const token = authHeader.substring(7);
        const user = await this.authService.validateSession(token);

        if (!user) {
            throw new UnauthorizedException('Sesión inválida o expirada');
        }

        return user;
    }

    /**
     * Cierra la sesión del usuario
     * 
     * @route POST /auth/logout
     * @param {string} authorization - Header con el token en formato "Bearer {token}"
     * @returns {Promise<{message: string}>} Mensaje de confirmación
     * 
     * @example
     * POST /auth/logout
     * Headers: { "Authorization": "Bearer a1b2c3d4..." }
     */
    @Post('logout')
    async logout(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { message: 'Sesión cerrada' };
        }

        const token = authHeader.substring(7);
        await this.authService.logout(token);
        return { message: 'Sesión cerrada correctamente' };
    }
}

