import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NoteService {
    private apiUrl = `${environment.apiBaseUrl}/notes`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        return this.authService.getAuthHeaders();
    }

    getNotes(params: any = {}): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { params, headers: this.getHeaders() });
    }

    getNote(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createNote(note: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, note, { headers: this.getHeaders() });
    }

    updateNote(id: number, note: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, note, { headers: this.getHeaders() });
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
