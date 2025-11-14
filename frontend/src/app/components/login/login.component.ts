import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    error: string = '';
    isRegisterMode: boolean = false;
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // Si ya está autenticado, redirigir a las notas
        if (this.authService.isAuthenticated) {
            this.router.navigate(['/notes']);
        }
    }

    toggleMode(): void {
        this.isRegisterMode = !this.isRegisterMode;
        this.error = '';
    }

    onSubmit(): void {
        if (!this.username || !this.password) {
            this.error = 'Por favor, completa todos los campos';
            return;
        }

        this.isLoading = true;
        this.error = '';

        if (this.isRegisterMode) {
            this.authService.register(this.username, this.password).subscribe({
                next: () => {
                    // Después de registrarse, hacer login automático
                    this.authService.login(this.username, this.password).subscribe({
                        next: () => {
                            this.router.navigate(['/notes']);
                            this.isLoading = false;
                        },
                        error: () => {
                            this.error = 'Error al iniciar sesión después del registro';
                            this.isLoading = false;
                        }
                    });
                },
                error: (err) => {
                    this.error = err.error?.message || 'Error al registrarse. El usuario puede ya existir.';
                    this.isLoading = false;
                }
            });
        } else {
            this.authService.login(this.username, this.password).subscribe({
                next: () => {
                    this.router.navigate(['/notes']);
                    this.isLoading = false;
                },
                error: () => {
                    this.error = 'Credenciales inválidas';
                    this.isLoading = false;
                }
            });
        }
    }
}

