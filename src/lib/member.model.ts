// member.model.ts
export interface Member {
  serialNumber: number;
  name: string;
  age: number;
  email: string;
  gender: string;
  phone: string;
  address?: string; // Optional
  emergencyContact?: string; // Optional
  duration: number;
  paymentMode: string;
  utr?: string; // Optional
  receiverName?: string; // Optional
  verified: boolean;
  amount:string,
  DOJ:Date;
  planStarted: Date;
}
