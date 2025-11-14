import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, CanActivateFn } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom, inject } from '@angular/core';
import { of } from 'rxjs';
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

  // Si hay token, consideramos que es válido (ya fue validado al cargar la app)
  // La validación completa ocurre en el constructor del AuthService
  return true;
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
