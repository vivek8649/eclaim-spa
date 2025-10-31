import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClaimService } from '../../services/claim.service';
import { UserClaimDetail } from '../../model/user-claim-detail';
import { decodeJwtManually, LoginService } from '../../services/login.service';
@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, NgbModule],
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  claimForm!: FormGroup;
  @Input() claimData: any;
  @Input() userPolicyId!: number;

  countries = ['India', 'USA', 'UK', 'Canada', 'Australia'];
  incidentTypes = ['Accident', 'Theft', 'Fire', 'Miscellaneous', 'Natural Disaster'];

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private claimService: ClaimService,
    private loginService: LoginService,
  ) {

  }
  ngOnInit(): void {
        this.claimForm = this.fb.group({
      claimID: ['-1', Validators.required],
      userPolicyID: [this.userPolicyId, Validators.required],
      claimDescription: ['', [Validators.required, Validators.maxLength(500)]],
      claimCountry: ['', Validators.required],
      incidentType: ['', Validators.required],
      incidentDate: ['', Validators.required],
      claimStreet: ['', Validators.required],
      claimCity: ['', Validators.required],
      claimState: ['', Validators.required],
      claimZip: ['', [Validators.required, Validators.pattern('^[0-9]{4,10}$')]],
      totalClaimed: ['', [Validators.required, Validators.min(0)]],
      userID: [decodeJwtManually(this.loginService.token).sub],
    });
    if (this.claimData) {
      this.claimForm.patchValue(this.claimData);
    }
  }

  onSubmit(): void {
    if (this.claimForm.valid) {
      const claimDetail = this.claimForm.getRawValue() as unknown as UserClaimDetail;
      this.claimService.saveClaim(claimDetail).subscribe(response => {
        console.log('Claim saved successfully:', response);
        this.activeModal.close({reason: 'save'});
      });
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      console.log('Selected file:', this.selectedFile);
    }
  }
}
