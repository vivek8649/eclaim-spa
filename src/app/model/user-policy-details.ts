export class UserPolicyDetails {
  userPolicyDetailsID!: number;
  userID!: number;
  policyID!: number;
  startDate!: Date;
  endDate!: Date;
  remainingLimit!: number;
  totalAmount!: number;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
