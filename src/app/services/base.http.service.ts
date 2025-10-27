// base-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  // Abstract property that must be implemented in child services
  protected  baseUrl: string = 'https://localhost:7220';

  constructor(protected http: HttpClient) { }

  // Generic GET method
  public get<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get<T>(url);
  }

  // Generic POST method
  public post<T>(endpoint: string, body: any, options: any={}): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post<T>(url, body, {withCredentials: true });
  }

  // Generic PUT method
  public put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.put<T>(url, body);
  }

  // Generic DELETE method
  public delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.delete<T>(url);
  }
}