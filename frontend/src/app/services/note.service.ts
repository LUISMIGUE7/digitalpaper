import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NoteService {
    private apiUrl = `${environment.apiBaseUrl}/notes`;

    constructor(private http: HttpClient) { }

    getNotes(params: any = {}): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { params });
    }

    getNote(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createNote(note: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, note);
    }

    updateNote(id: number, note: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, note);
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
