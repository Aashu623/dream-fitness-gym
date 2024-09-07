// member.model.ts
export interface Member {
  id: string;
  serialNumber: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  weight: number;
  phone: string;
  address?: string; // Optional
  emergencyContact?: string; // Optional
  membershipType: string;
  paymentMode: string;
  utr?: string; // Optional
  receiverName?: string; // Optional
  verified: boolean;
}
