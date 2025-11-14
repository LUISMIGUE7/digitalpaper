import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, CanActivateFn } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom, inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import 'zone.js';

import { NoteListComponent } from './app/components/note-list/note-list.component';
import { NoteFormComponent } from './app/components/note-form/note-form.component';
import { LoginComponent } from './app/components/login/login.component';
import { AuthService } from './app/services/auth.service';
import { Router } from '@angular/router';

const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  
  // Si no hay token, redirigir al login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  
  // Validar token contra el servidor
  return authService.validateToken(token).pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        // Token inválido, limpiar y redirigir al login
        authService.logout().subscribe(() => {
          router.navigate(['/login']);
        });
        return false;
      }
    }),
    catchError(() => {
      // Error al validar, limpiar y redirigir al login
      authService.logout().subscribe(() => {
        router.navigate(['/login']);
      });
      return of(false);
    })
  );
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'notes', component: NoteListComponent, canActivate: [authGuard] },
      { path: 'create-note', component: NoteFormComponent, canActivate: [authGuard] },
      { path: '', redirectTo: '/notes', pathMatch: 'full' }
    ])
  ]
}).catch(err => console.error(err));
