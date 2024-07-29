import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkerComponentComponent } from './Components/worker-component/worker-component.component';
import { AdminComponentComponent } from './Components/admin-component/admin-component.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { HomeComponent } from './Components/home/home.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { AuthCodeGuard } from './Guard/auth-code.guard';
import { LoginComponent } from './Components/login/login.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { AddLeadComponent } from './Components/Lead-components/add-lead/add-lead.component';
import { ListLeadsComponent } from './Components/Lead-components/list-leads/list-leads.component';
import { LeadComponent } from './Components/Lead-components/lead/lead.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { AddTaskComponent } from './Components/add-task/add-task.component';
import { AddProjectComponent } from './Components/add-project/add-project.component';
import { ProjectTableComponent } from './Components/project-table/project-table.component';
import { EditLeadComponent } from './Components/Lead-components/edit-lead/edit-lead.component';
import { DocumentComponent } from './Components/documens/document/document.component';
import { TaskBoardComponent } from './Components/task-board/task-board.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { CustomerProfileComponent } from './Components/customer-profile/customer-profile.component';
import { ListDocumentComponent } from './Components/documens/list-document/list-document.component';
import { AuthGuard } from './Guard/auth.guard';
const routes: Routes = [
  { path: 'customer', component: CustomersComponent, canActivate: [AuthGuard], data: { roles: [3, 2, 1] } },
  { path: 'worker', component: WorkerComponentComponent, canActivate: [AuthGuard], data: { roles: [2, 1] } },
  { path: 'admin', component: AdminComponentComponent, canActivate: [AuthGuard], data: { roles: [1] } },
  { path: 'customer', component: CustomersComponent},
  { path: 'worker', component: WorkerComponentComponent },
  { path: 'admin', component: AdminComponentComponent},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'edit', component: EditUserComponent },
  { path: 'add', component: AddUserComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'addProject', component: AddProjectComponent },
  { path: 'add-task/:id', component: AddTaskComponent },
  { path: 'project', component: ProjectTableComponent },
  { path: 'projectTable', component: ProjectTableComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'home/:role', component: HomePageComponent },
  { path: 'customer-profile', component: CustomerProfileComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'add-task/:id', component: AddTaskComponent },
  { path: 'addLead', component: AddLeadComponent },
  { path: 'editLead', component: EditLeadComponent },
  { path: 'document', component: DocumentComponent },

  {
    path: 'leads',
    component: ListLeadsComponent,
    children: [{ path: '', component: LeadComponent }],
  },

  { path: 'task', component: TaskBoardComponent },
  {
    path: 'ResetPassword',
    component: ResetPasswordComponent,
    canActivate: [AuthCodeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
