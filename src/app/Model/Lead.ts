export interface Lead {
  leadId: Number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  createdDate: Date;
  lastContactedDate: Date;
  businessName: string;
  notes: string;
}
