import { Customer } from './Customer';
import { StatusCodeProject } from './StatusCodeProject';
import { User } from './User';

export interface Project {
  projectId: number;
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: StatusCodeProject;
  customer?: Customer;
  createdDate?: Date;
  isActive?:boolean;
}