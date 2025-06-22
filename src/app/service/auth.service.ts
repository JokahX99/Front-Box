import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthReponse } from '../interfaces/response-auth.interface';
import { User } from '../interfaces/user.interface';

const URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus: string = 'checking';
  private _user: User | null = null;
  private _token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  public authStatus(): 'authenticated' | 'not-authenticated' | 'checking' {
    if (this._authStatus === 'checking') {
      return 'checking';
    }

    if (this._user) {
      return 'authenticated';
    }

    return 'not-authenticated';
  }

  public get user(): User | null {
    return this._user;
  }

  public get token(): string | null {
    return this._token;
  }

  public get isUser() {
    return this._user?.roles.includes('USER') ?? false;
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthReponse>(`${URL}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  register(fullName: string, email: string, password: string) {
    return this.http
      .post<AuthReponse>(`${URL}/auth/register`, {
        fullName: fullName,
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  public checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthReponse>(`${URL}/auth/check-status`).pipe(
      map((resp) => {
        this.handleAuthSuccess(resp);
        return true;
      }),
      catchError((error) => {
        this.handleAuthError(error);
        return of(false);
      })
    );
  }

  logout() {
    this._authStatus = 'not-authenticated';
    this._user = null;
    this._token = null;
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ user, token }: AuthReponse) {
    this._authStatus = 'authenticated';
    this._user = user;
    this._token = token;

    localStorage.setItem('token', token);

    return this._user;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
