import { Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StatusCodeUser } from '@app/Model/StatusCodeUser';
import { Customer } from 'src/app/Model/Customer';
import { CustomersService } from 'src/app/Services/customers.service';
import { ValidatorsService } from 'src/app/Services/validators.service';
import { DocumentComponent } from '../documens/document/document.component';
import { ChatComponent } from '../chat/chat.component';
import { Router } from '@angular/router';
import { LanguageService } from '@app/Services/language.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  editCustomerFlag: boolean = false;
  loading: boolean = true;
  statusCodeUser: StatusCodeUser[] = [];
  customers: Customer[] = [];
  newCustomerFlag: boolean = false;
  editCustomerId: number = -1;
  submitted: boolean = false;
  submitted1: boolean = false;
  date: Date = new Date();
  customerForm!: FormGroup;
  selectedStatus!: StatusCodeUser;
  status: any;
  private originalParent: HTMLElement | null = null;
  newCustomer!: Customer;
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;
  titlePage!: string;
  styles = {
    'text-align': 'right', // ברירת מחדל עברית
    'direction': 'rtl'     // ברירת מחדל עברית
  };

  constructor(private resolver: ComponentFactoryResolver, private router: Router, private formBuilder: FormBuilder, private customerService: CustomersService, private validatorsService: ValidatorsService, private languageService: LanguageService) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerId: [0],
      firstName: ['', [Validators.required, this.customNameValidator()]],
      lastName: ['', [Validators.required, this.customNameValidator()]],
      phone: ['', [Validators.required,this.customPhoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      businessName: ['', [Validators.required]],
      source: ['', [Validators.required]],
      status: ['', [Validators.required]],
      createdDate: ['', [Validators.required,this.futureDateValidator()]],
    });

    this.loadCustomers();
    this.loadStatusUsers();

    // this.languageService.language$.subscribe(lang => {
     
    //   if (lang === 'he') {
    //     this.styles['text-align'] = 'right';
    //     this.styles['direction'] = 'rtl';
        
    //   } else {
    //     this.styles['text-align'] = 'left';
    //     this.styles['direction'] = 'ltr';
      
    //   }
    //   })
  }

  private loadCustomers(): void {
    this.customerService.GetAllCustomers().subscribe(res => {
     res= res.filter(cutomer=>cutomer.status.id!==2)
      this.customers = res;
      this.loading = false;
    });
  }

  private loadStatusUsers(): void {
    this.customerService.GetAllStatusUser().subscribe(res => {
      this.statusCodeUser = res;
      if (this.statusCodeUser.length > 0) {
        this.selectedStatus = this.statusCodeUser[0];
      }
    });
  }

  get formControls() { return this.customerForm.controls; }

  openEditCustomerPopup(title: string, formId: string) {
    const formElement = document.getElementById(formId);
    this.titlePage=title
    if (formElement) {
      this.originalParent = formElement.parentElement;
      Swal.fire({
        html: `<div id="popupContainer"></div>`,
        showConfirmButton: false,
        didOpen: () => {
          const container = document.getElementById('popupContainer');
          if (container) {
            container.appendChild(formElement);
            formElement.style.display = 'block';
          }
        },
        willClose: () => {
          this.customerForm.reset();
          if (formElement && this.originalParent) {
            formElement.style.display = 'none';
            this.originalParent.appendChild(formElement);
          }
        }
      });
    }
  }

  addCustomer() {
    this.openEditCustomerPopup("AddCustomerTitle", "addCustomer");
  }

  addCustomerSubmit() {
    this.submitted1 = true;
    if (this.customerForm.invalid) {
      return;
    }
    this.newCustomer = this.customerForm.value;
    this.selectedStatus=this.customerForm.value.status as StatusCodeUser
    this.newCustomer.status = this.selectedStatus;
    this.newCustomer.customerId = 0;
    this.newCustomer.customerId = 0;
    this.customerService.AddNewCustomer(this.newCustomer).subscribe(() => {
      this.loadCustomers();
      this.customerForm.reset();
      this.submitted1 = false;


      Swal.close();
    });
  }

  editCustomer(customer: Customer) {
    this.customerService.GetCustomerById(customer.customerId).subscribe((res1: any) => {
      if (res1.createdDate)
        res1.createdDate = new Date(res1.createdDate);
      const status = res1.status as StatusCodeUser
      res1.status = status
      this.customerForm.setValue(res1);
      this.openEditCustomerPopup("EditCustomerTitle", "editCustomer");
    });
  }

  editCustomerSubmit(): void {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    this.customerService.EditCustomer(this.customerForm.value).subscribe(() => {
      Swal.close();
      this.loadCustomers();
      this.customerForm.reset();
      this.submitted = false;
    });
  }

  deleteCustomer(customer: Customer) {
    customer.status.description='Inactive';
    customer.status.id=2;
  
    

    this.customerService.DeleteCustomer(customer).subscribe(() => {
      this.loadCustomers();
    });
  
  }
  selectItem(event: any) {
    this.status = event.target.value;
    this.selectedStatus = this.statusCodeUser.find(s => s.id == this.status) as StatusCodeUser;
  }

  customNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.validatorsService.name(control.value) ? null : { invalidName: true };
    };
  }

  customPhoneValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      return this.validatorsService.phone(control.value) ? null : { invalidPhone: true };
    };
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today ? null : { notFutureDate: true };
    };
  }

  propil(customer: Customer) {
    this.componentType = ChatComponent;
    this.popUpAddOrEdit(`Communication ${customer.firstName}`, customer, "customer", customer.customerId);
  }
  popupOpen = false;
  componentType!: Type<any>;

  popUpAddOrEdit(title: string, l: Customer, s: String, id: Number) {
    this.popupOpen = true;
    Swal.fire({
      title: title,
      html: '<div id="popupContainer"></div>',
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('popupContainer');
        if (container) {
          const factory = this.resolver.resolveComponentFactory(this.componentType);
          const componentRef = this.popupContainer.createComponent(factory);
          if (l != null && l != undefined)
            componentRef.instance.setData(l, s, id);
          container.appendChild(componentRef.location.nativeElement);
        }
      },
      didClose: () => {
        this.popupOpen = false; // Set popupOpen to false when the pop-up is closed
      }
    });
    this.logNumbersWhilePopupOpen();
  }

  logNumbersWhilePopupOpen() {
    let counter = 0;
    const interval = setInterval(() => {
      if (this.popupOpen) {
        counter++;
      } else {
        clearInterval(interval); 
      }
    }, 1000); 
  }
  popUpAddDocument(nameCustomer: string) {
    this.componentType = DocumentComponent;
    Swal.fire({
      html: '<div id="popupContainer"></div>',
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('popupContainer');
        if (container) {
          console.log(this.componentType);
          if (this.componentType && this.resolver) {
            const factory = this.resolver.resolveComponentFactory(this.componentType);
            const componentRef = this.popupContainer.createComponent(factory);
            container.appendChild(componentRef.location.nativeElement);
            componentRef.instance.setName(nameCustomer);
          }
        }
      }
    });
  }

  addDocument(customer: Customer) {
    const fullName=customer.firstName!+" "+customer.lastName!;
    this.popUpAddDocument(fullName);
  }
}