import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { ApiConfig } from '../config/api.config';
import { HttpXsrfTokenExtractor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = ApiConfig.baseUrl;
  private hostUrl = ApiConfig.hostBase;

  constructor(private http: HttpClient, private tokenService: HttpXsrfTokenExtractor) { }

  getCsrf(): Observable<any> {
    return this.http.get<any>(this.hostUrl + 'sanctum/csrf-cookie', { withCredentials: true, observe: 'response' });
  }
  
  login(email: string, password: string): Observable<void> {
    return this.http
      .get('/sanctum/csrf-cookie', { withCredentials: true })
      .pipe(
        switchMap(() =>
          this.http.post<void>(
            '/login',
            { email, password },
            { withCredentials: true }
          )
        )
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/logout', {}, { withCredentials: true });
  }

  user(): Observable<Usuario> {
    return this.http.get<Usuario>('/api/user', { withCredentials: true });
  }
}
