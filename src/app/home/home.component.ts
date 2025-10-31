import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimService } from '../services/claim.service';
import { LoginService } from '../services/login.service';
import { UserClaimDetail } from '../model/user-claim-detail';
import { forkJoin } from 'rxjs';
import { UserPolicyDetails } from '../model/user-policy-details';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  error: string = '';
  public userClaims: UserClaimDetail[] = [];
  private userPolicyDetailsID!: number;

  constructor(
    private modalService: NgbModal,
    private claimService: ClaimService,
    private loginService: LoginService,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  private loadClaims() {
    forkJoin({
      userClaims: this.claimService.getUserClaims(this.loginService.userId),
      userPolicy: this.policyService.getUserPolicy(this.loginService.userId)
    })
      .subscribe(res => {
        this.userClaims = res.userClaims;
        this.userPolicyDetailsID = (res.userPolicy as UserPolicyDetails).userPolicyDetailsID;
      });
  }

  openClaimForm(existingClaim?: any) {
    const modalRef = this.modalService.open(ClaimFormComponent, { size: 'lg', backdrop: 'static' });
    if (existingClaim) {
      modalRef.componentInstance.claimData = existingClaim;
    }
    if(this.userPolicyDetailsID <=0){
      alert('No policy found for the user. Cannot file claim.');
      return;
    }

    modalRef.componentInstance.userPolicyId = this.userPolicyDetailsID;

    modalRef.result.then((result) => {
      if (result.reason === 'save') {
        this.loadClaims();
        console.log('Claim saved:', result);
      }
    }).catch(() => {});
  }
}