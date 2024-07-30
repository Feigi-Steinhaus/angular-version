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
import { Error404Component } from './Components/errors/error-404.component';
import { PropilListComponent } from './Components/propil-list/propil-list.component';
import { UsersComponent } from './Components/users/users.component';
import { ChatComponent } from './Components/chat/chat.component';
const routes: Routes = [
   // 1=customer, 2=worker, 3=admin
  // { path: 'worker', component: WorkerComponentComponent, canActivate: [AuthGuard], data: { roles: [3] } },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: [3] } },
  // { path: 'customer', component: CustomersComponent, canActivate: [AuthGuard], data: { roles: [3,2] } },
  // { path: 'edit', component: EditUserComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'add', component: AddUserComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'task', component: TaskBoardComponent ,canActivate: [AuthGuard], data: { roles: [3,2] }},
  // { path: 'addProject', component: AddProjectComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'add-task/:id', component: AddTaskComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'project', component: ProjectTableComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'projectTable', component: ProjectTableComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'customer-profile', component: CustomerProfileComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'add-task', component: AddTaskComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'addLead', component: AddLeadComponent,canActivate: [AuthGuard], data: { roles: [3] } },
  // { path: 'editLead', component: EditLeadComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'leads', component: ListLeadsComponent ,canActivate: [AuthGuard], data: { roles: [3] }},
  // { path: 'propil', component: PropilListComponent ,canActivate: [AuthGuard], data: { roles: [3] }},

  { path: 'customer', component: CustomersComponent },
  { path: 'worker', component: WorkerComponentComponent },
  {path: 'users', component : UsersComponent},
  { path: 'admin', component: AdminComponentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'edit', component: EditUserComponent },
  { path: 'add', component: AddUserComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'task', component: TaskBoardComponent },
  { path: 'addProject', component: AddProjectComponent },
  { path: 'add-task/:id', component: AddTaskComponent },
  { path: 'project', component: ProjectTableComponent },
  { path: 'projectTable', component: ProjectTableComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'customer-profile', component: CustomerProfileComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'add-task/:id', component: AddTaskComponent },
  { path: 'addLead', component: AddLeadComponent },
  { path: 'editLead', component: EditLeadComponent },
  { path: 'documents', component: ListDocumentComponent },
  { path: 'leads', component: ListLeadsComponent },
  { path: 'propil', component: PropilListComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'leads',
    component: ListLeadsComponent,
    children: [{ path: '', component: LeadComponent }],
  },
  {
    path: 'ResetPassword',
    component: ResetPasswordComponent,
    canActivate: [AuthCodeGuard],
  },
  { path: '404-not-found', pathMatch: 'full',  component:Error404Component },
  { path: '**', redirectTo: '404-not-found' },
  { path: 'home/:role', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }