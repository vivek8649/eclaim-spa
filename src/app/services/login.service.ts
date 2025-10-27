import { HttpClient } from "@angular/common/http";
import { BaseApiService } from "./base.http.service";
import { Observable, Subject, tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoginService extends BaseApiService {
    private endpoint = 'api/auth/'; // Example endpoint
    private _token!: string;
    private _email!: string;
    userLoggedInSubject = new Subject<boolean>();

    // This service can be expanded to include actual login logic, such as API calls.
    constructor(protected override http: HttpClient) {
        super(http);
}

    public get token(): string {
        return this._token;
    }
    public get email(): string {
        return this._email;
    }

    public login(email: string, password: string): Observable<LoginResponse> {
        return this.post<LoginResponse>(this.endpoint + 'login', { email, password }).pipe(
            tap(response => {
                this._token = response.token; // Store the token or handle it as needed
                this._email = decodeJwtManually(response.token).email;
                this.userLoggedInSubject.next(true);
            })
        );
    }

    public register(registerRequest: RegisterRequest): Observable<boolean> {
        return this.post<boolean>(this.endpoint + 'register', registerRequest)
    }

      public logout(): Observable<boolean> {
        return this.post<boolean>(this.endpoint + 'logout', {}, { withCredentials: true }).pipe(
            tap(() => {
                this._token = '';
                this.userLoggedInSubject.next(false);
            })
        );
    }

    public isTokenExpired(token: string): boolean {
        const decoded: any = decodeJwtManually(token);
        return Date.now() >= decoded.exp * 1000;
    }

    public refreshAccessToken(): Observable<any> {
        return this.post(this.endpoint + 'refresh', {}, { withCredentials: true })
            .pipe(tap((res: any) => {
                this._token = res.jwtToken;
                this._email = decodeJwtManually(res.jwtToken).email;
                this.userLoggedInSubject.next(true);
            }
            ));
    }

    public initializeApp() {
        return new Promise<void>((resolve) => {
            const token = this.token;
            if (token && !this.isTokenExpired(token)) { // && !authService.isTokenExpired(token)
                resolve(); // Token valid → user stays logged in
            } else {
                // Try to get new token silently using refresh cookie
                this.refreshAccessToken().subscribe({
                    next: () => {
                        resolve()
                    },
                    error: () => {
                        resolve(); // Let app start (user will be logged out)
                    }
                });
            }
        });
    }
}



export interface LoginResponse {
    token: string;
    userId: number;
    username: string;
    // Add other fields as necessary
}

export interface RegisterRequest {
    Username: string;
    Password: number;
    Email: string;
    policyId: string;
    // Add other fields as necessary
}

export function decodeJwtManually(token: string): any {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Failed to decode token', e);
        return null;
    }
}