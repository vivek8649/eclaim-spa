import { HttpClient } from "@angular/common/http";
import { BaseApiService } from "./base.http.service";
import { catchError, Observable, Subject, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserPolicyDetails } from "../model/user-policy-details";

@Injectable({
    providedIn: 'root'
})
export class LoginService extends BaseApiService {
    private endpoint = 'api/auth/'; // Example endpoint
    private _token!: string;
    private _email!: string;
    private _userId!: number;
    userLoggedInSubject = new Subject<boolean>();
    redirectingToRegister: boolean = false;

    // This service can be expanded to include actual login logic, such as API calls.
    constructor(
        protected override http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        super(http);
    }

    public get token(): string {
        return this._token;
    }
    public get userId(): number {
        return this._userId;
    }
    public get email(): string {
        return this._email;
    }

    public login(email: string, password: string): Observable<LoginResponse> {
        return this.post<LoginResponse>(this.endpoint + 'login', { email, password }).pipe(
            tap(response => {
                this.setLoginDetails(response.jwtToken);
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
                this.setLoginDetails(res.jwtToken);

            }))
    }

    public initializeApp() {
        if (this.redirectingToRegister) {
            this.redirectingToRegister = false;
            return Promise.resolve(); // Skip token check when redirecting to register
        }

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
                        this.router.navigate(['/login']);
                        resolve(); // Let app start (user will be logged out)
                    }
                });
            }
        });
    }

    
    private setLoginDetails(token: string) {
        this._token = token; // Store the token or handle it as needed
        this._email = decodeJwtManually(token).email;
        this._userId = decodeJwtManually(token).sub;
        this.userLoggedInSubject.next(true);
    }
}



export interface LoginResponse {
    jwtToken: string;
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