import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TagService {
    private apiUrl = `${environment.apiBaseUrl}/tags`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        return this.authService.getAuthHeaders();
    }

    getTags(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getTag(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createTag(tag: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, tag, { headers: this.getHeaders() });
    }

    updateTag(id: number, tag: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, tag, { headers: this.getHeaders() });
    }

    deleteTag(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
}
