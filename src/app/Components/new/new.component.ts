import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Communication } from '@app/Model/Communication';
import { Customer } from '@app/Model/Customer';
import { Lead } from '@app/Model/Lead';
import { RelatedToProject } from '@app/Model/RelatedToCode';
import { CommunicationService } from '@app/Services/communication.service';
import { CustomersService } from '@app/Services/customers.service';
import { LeadService } from '@app/Services/lead.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
  @Output() dataRefreshed: EventEmitter<void> = new EventEmitter<void>();
  @Output() messageSent = new EventEmitter<Communication>();
  newMessageForm: FormGroup;

  constructor(private cdr: ChangeDetectorRef,private resolver: ComponentFactoryResolver, private leadservice: LeadService, private customerService: CustomersService, private formBuilder: FormBuilder, private communicationService: CommunicationService) {
    this.newMessageForm = this.formBuilder.group({
      details: [''],
      communicationId: [0],
      type: [''],
      date: [''],
      relatedId: [null],
      relatedTo: [null],
      name: []
    });
  }
  r!: RelatedToProject;
  firstName!:Lead | Customer;

  async sendMessage() {
    if (!this.newMessageForm.valid) {
      return;
    }
    if (this.newMessageForm.value.relatedTo == "Lead") {
      this.r = { id: 2, description: "Lead" };
      this.namesl.forEach(e => {
        if(e.leadId==this.newMessageForm.value.relatedId)
          this.firstName=e;
      });
    }
    else {
      this.r = { id: 1, description: "Customer" };
      this.namesc.forEach(e => {
        if(e.customerId==this.newMessageForm.value.relatedId)
          this.firstName=e;
      });
    }    
    this.newMessageForm.value.relatedTo = this.r;
    this.newMessageForm.value.date = new Date(new Date().getTime() - (new Date().getTimezoneOffset()) * 60000);
    this.newMessageForm.value.type = this.newMessageForm.value.type;
    this.newMessageForm.value.communicationId = 0;
    this.newMessageForm.value.name = this.firstName.firstName;
    this.newMessageForm.value.relatedId = this.newMessageForm.value.relatedId;
    this.communicationService.AddNewCommunication(this.newMessageForm.value).subscribe((response: Communication) => {
      // this.messageSent.emit(response); // Emit event to notify new message added
      // this.newMessageForm.reset();
      // this.dataRefreshed.emit(); // Emit event to trigger data refresh
      // this.cdr.detectChanges(); // Manually trigger change detection
      // Swal.close(); // Close the popup
  });
  await this.delay(50);
    Object.keys(this.newMessageForm.controls).forEach((key) => {
      this.newMessageForm.controls[key].markAsUntouched();
    });
    this.dataRefreshed.emit();
    Swal.close();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showaddtask: boolean = false;
  namesl: Lead[] = [];
  namesc: Customer[] = [];

  fetchNames(event: Event): void {
    const selectedOption = (event.target as HTMLSelectElement).value;
    if (selectedOption === 'Lead') {
      this.leadservice.getAllLeads()
      .subscribe((names: Lead[]) => {
        this.namesl = names;
        this.namesc = []
      });
    } else if (selectedOption === 'Customer') {
      this.customerService.GetAllCustomers().subscribe((names: Customer[]) => {
        this.namesc = names;
        this.namesl = []
      });
    }
  }
}
