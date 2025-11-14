import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagService {
    private apiUrl = `${environment.apiBaseUrl}/tags`;

    constructor(private http: HttpClient) { }

    getTags(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getTag(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createTag(tag: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, tag);
    }

    updateTag(id: number, tag: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, tag);
    }

    deleteTag(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
