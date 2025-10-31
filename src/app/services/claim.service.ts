import { HttpClient } from "@angular/common/http";
import { BaseApiService } from "./base.http.service";
import { Observable, Subject, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { UserClaimDetail } from "../model/user-claim-detail";

@Injectable({
    providedIn: 'root'
})
export class ClaimService extends BaseApiService {
    
    private endpoint = 'api/claim/'; 
    
    constructor(protected override http: HttpClient) {
        super(http);
    }

    public saveClaim(userClaimDetail: UserClaimDetail): Observable<boolean> {
        return this.post<boolean>(this.endpoint + 'save', userClaimDetail);
    }

    public getUserClaims(userId: number): Observable<UserClaimDetail[]> {
        return this.get<UserClaimDetail[]>(this.endpoint + 'list?userId='+userId);
    }
}