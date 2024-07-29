import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '@app/Model/Customer';
import { StatusCodeProject } from '@app/Model/StatusCodeProject';
import { CustomersService } from '@app/Services/customers.service';
import { ProjectService } from '@app/Services/project.service';
import { TaskService } from '@app/Services/task.service';
import { Project } from 'src/app/Model/Project';
import { DialogComponent } from '../dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

 
  statuses: StatusCodeProject[] = [];
  date: Date = new Date();
  projectForm: FormGroup = new FormGroup({});
  titlePage: string = "AddProject"
  custom: Customer[] = [];
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private statusService: TaskService,
    private customerService: CustomersService,
    private dialog: MatDialog,
    private router: Router,
    private translate:TranslateService
 
 
    ) {}
  

 
  ngOnInit(): void {
    this.date=new Date()
    this.createForm();
    this.statusService.getAllStatus().subscribe(
      (data: any) => {
        this.statuses = data;
      },
      (error: any) => {
        console.error('Error fetching status:', error);
      }
    );
    this.customerService.GetAllCustomers().subscribe(
      (data: any) => {
        this.custom = data;
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  createForm() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description:  ['', Validators.required],
      startDate: ['',[ Validators.required,this.futureDateValidator.bind(this)]],
      endDate: ['',[ Validators.required,this.futureDateValidator.bind(this)]],
      status: '',
      customer: ['', Validators.required],
     createdDate:[new Date()]
    });
    this.dateValidator.bind(this)
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    if (this.projectForm.valid) {

      const newProject: Project = this.projectForm.value;
      this.projectService.addProject(newProject)
        .subscribe(
          (response) => {
            console.log(response);
            if (response) {
               this.translate.get(['seccesaddProject','close']).subscribe(translation=> 
              this.dialog.open(DialogComponent, {
                data: {
                  title:translation['seccesaddProject'],
                  context: newProject.name,
                  buttonText:translation['close'],
                  }, 
                    }), );
              Swal.close();
              }
          },
          (error) => {
            console.error('Error adding project', error);
          }
        );
    }
  }
  get name() { return this.projectForm.get('name') }
  get description() { return this.projectForm.get('description') }
  get startDate() { return this.projectForm.get('startDate') }
  get endDate() { return this.projectForm.get('endDate') }
  get status() { return this.projectForm.get('status') }
  get cucustomer(){ return this.projectForm.get('customer')}
  // get createdDate(){ return this.projectForm.get('createdDate')}
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today ? null : { notFutureDate: true };
  }

  dateValidator(group: FormGroup) {
    const startDate =new Date( group.get('startDate')?.value);
    const endDate = new Date(group.get('endDate')?.value);
    return startDate&&endDate&& startDate < endDate ? null : { invalidDates: true };
    
  }
}
