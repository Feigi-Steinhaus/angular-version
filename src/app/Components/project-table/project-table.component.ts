import { CustomersService } from '@app/Services/customers.service';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Customer } from '@app/Model/Customer';
import { ProjectService } from '@app/Services/project.service';
import { Project } from 'src/app/Model/Project';
import Swal from 'sweetalert2';
import { AddProjectComponent } from '../add-project/add-project.component';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { GenericBourdComponent } from '../generic-bourd/generic-bourd.component';
import { StatusCodeProject } from '@app/Model/StatusCodeProject';
import { TaskService } from '@app/Services/task.service';
import { Task } from '@app/Model/Task';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Priority } from '@app/Model/Priority';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent {
  projects: Project[] = [];
  tasks: any[] = [];
  priorities: Priority[] = [];
  errorMessage: string = "";
  customers: Customer[] = [];
  statuses: StatusCodeProject[] = [];
  loading: boolean = true;
  @ViewChild(GenericBourdComponent) genericBourd!: GenericBourdComponent;
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;
  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private ProjectService: ProjectService,
    private active: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private taskService: TaskService,
    private CustomerService: CustomersService
  ) { }
  ngOnInit() {
    console.log("projectComponent");
    this.taskService.getAll().subscribe(
      (data) => {
        this.tasks = data
        console.log("tasks=", this.tasks);
      }
    );
    this.ProjectService.getAll().subscribe(
      (p: Array<Project>) => {
        this.projects = p;
        console.log("project=", this.projects);
        this.taskService.getAllStatus().subscribe(
          (data) => {
            this.statuses = data
          }
        );
        this.CustomerService.GetAllCustomers().subscribe(
          (data) => {
            this.customers = data
          }
        );
        this.taskService.getAllPriorities().subscribe(
          (data) => {
            this.priorities = data
          }
        );
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching project:', error);
        this.translate.get(['Close', 'unAuthorize']).subscribe(translations => {
          Swal.fire({
            text: translations['unAuthorize'],
            icon: "error",
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: translations['Close']
          });
        });
        this.router.navigate(['../home']);
        this.loading = true;
      }
    );
  }
  componentType!: Type<any>;

  onDeleteProject(p: Project) {
    this.ProjectService.deleteProject(p.projectId).subscribe(
      (res: any) => {

        // Remove the project from the local list after successful deletion
        this.loadP()
        Swal.fire({
          text: 'Project deleted successfully',
          icon: "success",
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: "#3085D6",
          confirmButtonText: 'OK'
        });
      },
      (error) => {
        Swal.fire({
          text: 'Error deleting project. Please try again.',
          icon: "error",
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: 'Close'
        });
      }
    );
    Swal.close();
  }
  loadP(): void {
    this.ProjectService.getAll().subscribe(res => {
      this.projects = res;
      this.loading = false;
    });
  }
  filterData(objToFilter: any) {
    let taskFilter: Task[] = this.tasks.filter(u => u.project.projectId == objToFilter.projectId);
    console.log(taskFilter);
    if (taskFilter.length != 0) {
      let loading: boolean = true;
      let col$types = { 'title': 'text', 'dueDate': 'date', 'createdDate': 'date' };
      let positionD = [this.statuses];
      let objData = [this.projects];
      let objFields = ['name'];
      const deletecallback = (row: any) => {
        this.onDeleteTask(row)
      }
      this.genericBourd.PopTable(taskFilter, loading, col$types, objData, objFields, positionD, '800px', deletecallback, true);

    } else {
      this.translate.get(['close', 'notasks']).subscribe(translations => {
        Swal.fire({
          text: translations['notasks'],
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: translations['close']
        });
      });
    }
  }
  addProject() {
    this.componentType = AddProjectComponent;
    this.popUpAddOrEdit("Add project", null)
   
  }
  fetchTasks(projectId: string): void {
    if (projectId) {
      this.ProjectService.getTaskByProject(projectId).subscribe(
        (data) => {
          this.tasks = data;
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error fetching tasks. Please try again.';
          this.tasks = [];
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid project code.';
    }
  }
  onEditProject(p: Project) {
    this.componentType = EditProjectComponent;
    this.popUpAddOrEdit("edit project", p.projectId);
    console.log('Edit p:', p);
  }
  popUpAddOrEdit(title: string, l: Number | null) {
    Swal.fire({


      html: '<div id="popupContainer"></div>',
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('popupContainer');
        if (container) {
          if(container==undefined)
            console.log(",l;,");
          const factory = this.resolver.resolveComponentFactory(this.componentType);
          const componentRef = this.popupContainer.createComponent(factory);
          if(l!=null && l!=undefined)         
          componentRef.instance.setData(l);
          container.appendChild(componentRef.location.nativeElement);
          componentRef.instance.dataRefreshed.subscribe(() => {
            this.refreshData();})
        }
      },
      });
      }

  
  refreshData() {
    this.ProjectService.getAll().subscribe(
      (p: Array<Project>) => {
        this.projects = p;
        console.log(this.projects);
        this.loading = false;
      })
  }
  onDeleteTask(task: Task) {
    debugger
    this.taskService.deleteTask(task.taskId!).subscribe(
      (data: any) => {
        if (data == true) {
          Swal.fire({
            text: "The task was successfully deleted",
            icon: "success",
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: "#3085D6",
            confirmButtonText: "close"
          }).then((result) => {
            this.taskService.getAll().subscribe((data) => {
              this.tasks = data
            })
          });
        }
      },
      (error: any) => {
        console.error('Error fetching Tasks:', error);
      }
    );
  }
}


