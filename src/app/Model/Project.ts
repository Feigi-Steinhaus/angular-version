import { Customer } from './Customer';
import { User } from './User';

export interface Project {
  projectId: number;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  customer_id: Customer;
  createdDate?: Date;
}