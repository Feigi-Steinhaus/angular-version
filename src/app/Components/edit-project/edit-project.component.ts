import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '@app/Model/Customer';
import { Project } from '@app/Model/Project';
import { StatusCodeProject } from '@app/Model/StatusCodeProject';
import { CustomersService } from '@app/Services/customers.service';
import { LanguageService } from '@app/Services/language.service';
import { ProjectService } from '@app/Services/project.service';
import { TaskService } from '@app/Services/task.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent {
  @Output() dataRefreshed: EventEmitter<void> = new EventEmitter<void>();
  customerName: any;
  flag: boolean = false;
  custom: Customer[] = [];
  statuses: StatusCodeProject[] = [];
  project!: Project;
  status: StatusCodeProject = {};
  customer: Customer ={customerId:0,status:{}};
  ProjectForm!: FormGroup;
  submitted = false;
  data: any;
  styles = {
    'text-align': 'right', // ברירת מחדל עברית
    'direction': 'rtl'     // ברירת מחדל עברית
  };
  @Output() ProjectId: EventEmitter<void> = new EventEmitter<void>();
  constructor(private server: ProjectService, private formBuilder: FormBuilder, private pro: ProjectService, private statusService: TaskService,
    private customerService: CustomersService,
    private languageService: LanguageService,private translate:TranslateService) {
  }
  ngOnInit() {
    this.languageService.language$.subscribe(lang=> {
      if (lang === 'he') {
        this.styles['text-align'] = 'right';
        this.styles['direction'] = 'rtl';
      } else {
        this.styles['text-align'] = 'left';
        this.styles['direction'] = 'ltr';
      }
      })
    this.statusService.getAllStatus().subscribe(
      (data: any) => {
        this.statuses = data;
        console.log("statuses", this.statuses);
      },
      (error: any) => {
        console.error('Error fetching status:', error);
      }
    );
    this.customerService.GetAllCustomers().subscribe(
      (data: any) => {
        this.custom = data;
        console.log("custom", this.custom);
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
  setData(data: any) {
    debugger;
    this.data = data;
    console.log("data: ", data);
    this.server.getProjectById(this.data).subscribe((project2: Project) => {
      this.project = project2;
      console.log(`project: `, this.project);
      this.fullForm();
    });
  }
  extractDate(dateTime: string): string {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  fullForm() {
    console.log("full form");
    debugger
    if (!this.project) { console.error('Project data is not available'); return; }
    console.log(`this.project.status:`);
    // console.log(`this.custom" ${this.custom[this.customerId].firstName} `);
    // console.log(`this.stattus" ${this.statuses[this.status].description} `);
    // this.customerName = this.custom[this.customerId].firstName != null ? this.custom[this.customerId].firstName : 0;
    this.status = this.project.status!;
    this.customer = this.project.customer!
    this.ProjectForm = this.formBuilder.group({
      projectId: [null, Validators.required],
      name: [this.project.name, Validators.required],
      description: [this.project.description, Validators.required],
      startDate: [this.extractDate(String(this.project.startDate)), Validators.required],
      endDate: [this.extractDate(String(this.project.endDate)), Validators.required],
      status: [this.project.status, Validators.required],
      createdDate: [this.extractDate(String(this.project.createdDate)), Validators.required],
      customerId: [this.project.customer, Validators.required],
    });
    console.log(this.project);
    this.flag = true;
  }
  async toEnter() {
    this.server.update(this.ProjectForm.value, this.data).subscribe(() => Swal.close())
    await this.delay(50);
    Object.keys(this.ProjectForm.controls).forEach((key) => {
      this.ProjectForm.controls[key].markAsUntouched();
    });
    this.dataRefreshed.emit();
    Swal.close();
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
