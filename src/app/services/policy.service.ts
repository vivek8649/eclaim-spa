import { HttpClient } from "@angular/common/http";
import { BaseApiService } from "./base.http.service";
import { Injectable } from "@angular/core";
import { UserPolicyDetails } from "../model/user-policy-details";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PolicyService extends BaseApiService {
    
    private endpoint = 'api/policy/';
    constructor(protected override http: HttpClient) {
        super(http);
    }

    
    public getUserPolicy(userId: number): Observable<UserPolicyDetails> {
      return this.get<UserPolicyDetails>(this.endpoint + userId.toString()+'/get');
    }
}