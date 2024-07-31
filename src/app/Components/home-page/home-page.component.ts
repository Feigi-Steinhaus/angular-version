import { Component, ComponentFactoryResolver, ElementRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '@app/Model/Task';
import { User } from 'src/app/Model/User';
import Swal from 'sweetalert2';
import { AddLeadComponent } from '../Lead-components/add-lead/add-lead.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Project } from '@app/Model/Project';
import { Customer } from '@app/Model/Customer';
import { Subject } from 'rxjs';
import { GenericBourdComponent } from '../generic-bourd/generic-bourd.component';
import { StatusCodeProject } from '@app/Model/StatusCodeProject';
import { Lead } from '@app/Model/Lead';
import { UserService } from '@app/Services/user.service';
import { TaskService } from '@app/Services/task.service';
import { LeadService } from '@app/Services/lead.service';
import { CustomersService } from '@app/Services/customers.service';
import { ProjectService } from '@app/Services/project.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@app/Services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(private router: Router, private _userService: UserService, private authService: AuthService, private TaskService: TaskService, private _leadService: LeadService, private _customerService: CustomersService, private resolver: ComponentFactoryResolver,
    private ProjectService: ProjectService, private translate: TranslateService
  ) { }
  isAdmin: boolean = false;
  user: User | any
  users!: User[]
  leads!: Lead[]
  customers!: Customer[]
  statuses: StatusCodeProject[] = [];
  projects: Project[] = [];
  priorities: Project[] = [];
  tasks!: Task[]
  loading: boolean = true;

  // currentEmail: string = localStorage.getItem("email") ?? 'מסתננת';
  componentType!: Type<any>;

  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;
  @ViewChild(GenericBourdComponent) genericBourd!: GenericBourdComponent;
  @ViewChild('fullScreenComponent') fullScreenComponent!: ElementRef;

  data: any;
  selectedProject: string = 'מעבר ל..';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  activeCustomers: number = 0;
  inactiveCustomers: number = 0;
  totalLeads: number = 0;

  public chartOptions: any;
  public chartTaskDistribution: any;


  ngOnInit(): void {

    this.TaskService.getAll().subscribe(
      (data: any) => {
        this.tasks = data;
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
    this._leadService.getAllLeads().subscribe(
      (data: Lead[]) => {
        this.leads = data;
      },
      (error: any) => {
        console.error('Error fetching leads:', error);
      }
    );
    this._userService.getAll().subscribe((data: User[]) => {
      this.users = data
      const token = localStorage.getItem("token")?.toString()!
      const idtoken = this.authService.getClaim(token, "id")
      this.user = this.users.find(u => u.userId == idtoken)
      if (!this.user)
        this.user.firstName = "משתמש"
    },
      (error: any) => {
        console.error('Error fetching user:', error);
      }
    )
    this._customerService.GetAllCustomers().subscribe(
      (data: Customer[]) => {
        this.customers = data;
        this.calculateStats();
        this.initChart();
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );

    this.ProjectService.getAll().subscribe(
      (p: Array<Project>) => {
        this.projects = p.slice(0, 7);
      },
      (error) => {
        this.loading = true;
      })
    this.TaskService.getAllStatus().subscribe(
      (data) => {
        this.statuses = data
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
    this.TaskService.getAllPriorities().subscribe(
      (data) => {
        this.priorities = data
      },
      (error: any) => {
        console.error('Error fetching priorities:', error);
      }
    );
    this.loading = false;
  }

  calculateStats() {
    this.activeCustomers = this.customers.filter(customer => customer.status.description === 'Active').length;
    this.inactiveCustomers = this.customers.filter(customer => customer.status.description === 'Inactive').length;
    this.totalLeads = this.leads.length;
    console.log(this.activeCustomers, this.inactiveCustomers,);
  }

  initChart() {
    this.chartTaskDistribution = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: 400,
        width: '100%',
        type: 'polarArea',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      labels: ['Leads', 'Active Customers', 'Inactive Customers'],
      legend: {
        position: 'bottom',
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 1,
            strokeColor: '#E0E0E0',
          },
          spokes: {
            connectorColors: '#E0E0E0',
          },
        },
      },
      series: [this.totalLeads, this.activeCustomers, this.inactiveCustomers],
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.75,
          },
        },
      },
      stroke: {
        width: 2,
      },
      colors: ['#5CFFAC', '#A0A0A0', '#7F7F7F'],
      tooltip: {
        followCursor: true,
        theme: 'dark',
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9E9E9E',
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#E0E0E0',
        strokeDashArray: 0,
        position: 'back',
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
    };
  }


  openFullScreen(): void {
    const elem = this.fullScreenComponent.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }
  onToggleChange(event: any) {
    if (event.value === 'show-all') {
      this.router.navigate(['/project']);
    }
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  routing(list: any): void {
    this.filterData(list);
  }

  filterData(objToFilter: any): void {
    let taskFilter: Task[] = objToFilter;
    console.log(taskFilter);
    if (taskFilter.length != 0) {
      let loading: boolean = true;
      let col$types = { 'title': 'text', 'description': 'text', 'dueDate': 'date', 'createdDate': 'date' };
      let positionD = [this.statuses];
      let objData = [this.projects];
      let objFields = ['name'];
      if (this.genericBourd) {
        this.genericBourd.PopTable(taskFilter, loading, col$types, objData, objFields, positionD, "1000px");
      } else {
        console.error('genericBourd is not initialized');
      }
    } else {
      Swal.fire({
        text: 'no tasks',
        showCancelButton: false,
        showCloseButton: true,
        confirmButtonColor: "#5CFFAC",
        confirmButtonText: 'Close'
      });
    }
  }
  addLead() {
    this.componentType = AddLeadComponent;
    this.popUpAddOrEdit("Add Lead");
  }
  addTask() {
    this.componentType = AddTaskComponent;
    this.popUpAddOrEdit("Add Task");
  }
  addCustomer() {
    this.componentType = AddLeadComponent;
    this.popUpAddOrEdit("Add Lead");
  }

  popUpAddOrEdit(title: string) {
    Swal.fire({
      html: '<div id="popupContainer"></div>',
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('popupContainer');
        if (container) {
          const factory = this.resolver.resolveComponentFactory(this.componentType);
          const componentRef = this.popupContainer.createComponent(factory);
          componentRef.instance.dataRefreshed.subscribe(() => {
          })
          container.appendChild(componentRef.location.nativeElement);
        }
      },
    });
  }

  getAllTask(): Task[] {
    return this.tasks
  }
  getTodoTasks(): Task[] {
    if (this.tasks)
      // return this.tasks.filter(task => task.status?.description === "TO DO");
      return this.tasks.filter(task => task.status?.description === "Not Started");
    return []
  }
  getTodoTasksByUser(): Task[] {
    // return this.tasks.filter(task => task.status?.description === "TO DO");
    if (this.tasks)
      return this.tasks.filter(task => task.status?.description === "Not Started" && task.assignedTo?.email == this.user.email);
    return []
  }

  getTodoTasksFromToday(): Task[] {
    const today = new Date().toDateString();
    return this.getTodoTasks().filter(task => {
      if (task.createdDate) {
        return new Date(task.createdDate).toDateString() === today;
      }
      return false;
    })
  }

  getInProgressTasks(): Task[] {
    // return this.tasks.filter(task => task.status?.description === "In PROGRESS");
    if (this.tasks)
      return this.tasks.filter(task => task.status?.description === "In Progress");
    return []
  }
  getInProgressTasksByUser(): Task[] {
    if (this.tasks)
      // return this.tasks.filter(task => task.status?.description === "In PROGRESS");
      return this.tasks.filter(task => task.status?.description === "In Progress" && task.assignedTo?.email == this.user.email);
    return []
  }
  getInProgressTasksFromToday(): Task[] {
    const today = new Date().toDateString();
    return this.getInProgressTasks().filter(task => {
      if (task.createdDate) {
        return new Date(task.createdDate).toDateString() === today;
      }
      return false;
    })
  }


  getTasksDueToday(): Task[] {
    const today = new Date().toDateString();
    if (this.tasks) {
      return this.tasks.filter(task => {
        if (task.dueDate) {
          return new Date(task.dueDate).toDateString() === today;
        }
        return false;
      })
    }
    return []
  }
  getTasksDueTodayAndClosed(): Task[] {
    const today = new Date().toDateString();
    if (this.tasks)
      return this.tasks.filter(task => {
        if (task.dueDate) {
          // return new Date(task.dueDate).toDateString() === today&&task.status?.description=="DONE";
          return new Date(task.dueDate).toDateString() === today && task.status?.description == "Completed";
        }
        return false;
      })
    return []
  }
  getTasksOverdue(): Task[] {
    const now = new Date();
    if (this.tasks)
      return this.tasks.filter(task => {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          return dueDate < now && task.status?.description !== "Completed";
          // return dueDate < now && task.status?.description !== "DONE";
        }
        return false;
      });
    return []
  }
  getTasksOverdueFromYesterday(): Task[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateString = yesterday.toDateString();
    if (this.tasks)
      return this.tasks.filter(task => {
        if (task.dueDate) {
          return new Date(task.dueDate).toDateString() === yesterdayDateString;
        }
        return false;
      });
    return []
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private _fixSvgFill(element: Element): void {
    const currentURL = this.router.url;
    Array.from(element.querySelectorAll('*[fill]'))
      .filter(el => {
        const fillAttr = el.getAttribute('fill');
        return fillAttr && fillAttr.indexOf('url(') !== -1;
      })

  }


  private _prepareChartData(): void {

  }
}


