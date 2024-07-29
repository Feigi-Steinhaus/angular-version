import { Priority } from './Priority';
import { Project } from './Project';
import { StatusCodeProject } from './StatusCodeProject';
import { User } from './User';

export interface Task {
  taskId?: number;
  title?: string;
  description?: string;
  status?: StatusCodeProject;
  priority?: Priority;
  dueDate?: Date;
  assignedTo?: User
  project?: Project;
  createdDate?: Date;
  googleId?: string;
}
