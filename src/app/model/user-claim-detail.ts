export class UserClaimDetail {
  userPolicyID!: string;
  userID!: number;
  claimID!: number;
  claimDescription?: string;
  claimStreet?: string;
  claimCity?: string;
  claimState?: string;
  claimZip?: string;
  claimCountry?: string;
  incidentType?: string;
  totalClaimed?: number;
  processedClaim?: number;
  assignee?: string;
  status?: string;
  createdDate?: Date;
  updatedDate?: Date;
  createdBy?: string;
  updatedBy?: string;
  incidentDate?: Date; // ✅ if you’ve added this column in DB
}
