import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private token: string | null = null;

    constructor(private http: HttpClient) {
        // Verificar si hay un token guardado en localStorage
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            this.token = savedToken;
            // Validar el token contra el servidor
            this.validateToken(savedToken).subscribe({
                next: (user) => {
                    if (user) {
                        this.currentUserSubject.next(user);
                    } else {
                        // Token inválido, limpiar
                        this.clearSession();
                    }
                },
                error: () => {
                    // Error al validar, limpiar
                    this.clearSession();
                }
            });
        }
    }

    get currentUserValue() {
        return this.currentUserSubject.value;
    }

    get isAuthenticated(): boolean {
        return this.token !== null && this.currentUserSubject.value !== null;
    }

    getToken(): string | null {
        return this.token;
    }

    getAuthHeaders(): HttpHeaders {
        if (this.token) {
            return new HttpHeaders({
                'Authorization': `Bearer ${this.token}`
            });
        }
        return new HttpHeaders();
    }

    validateToken(token: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/validate`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).pipe(
            catchError(() => of(null))
        );
    }

    register(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
            tap(response => {
                if (response && response.token) {
                    this.token = response.token;
                    localStorage.setItem('authToken', response.token);
                    this.currentUserSubject.next({ id: response.id, username: response.username });
                }
            })
        );
    }

    logout(): Observable<any> {
        if (this.token) {
            return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
                headers: this.getAuthHeaders()
            }).pipe(
                tap(() => {
                    this.clearSession();
                }),
                catchError(() => {
                    // Aunque falle en el servidor, limpiar localmente
                    this.clearSession();
                    return of(null);
                })
            );
        }
        this.clearSession();
        return of(null);
    }

    private clearSession(): void {
        this.token = null;
        localStorage.removeItem('authToken');
        this.currentUserSubject.next(null);
    }
}

