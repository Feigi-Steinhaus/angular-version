import { Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/Model/Project';
import { Lead } from 'src/app/Model/Lead';
import { GenericBourdComponent } from '../../generic-bourd/generic-bourd.component';
import { LeadService } from 'src/app/Services/lead.service';
import Swal from 'sweetalert2';
import { EditLeadComponent } from '../edit-lead/edit-lead.component';
import { DialogComponent } from '@app/Components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddLeadComponent } from '../add-lead/add-lead.component';

@Component({
  selector: 'app-list-leads',
  templateUrl: './list-leads.component.html',
  styleUrls: ['./list-leads.component.css']
})
export class ListLeadsComponent {

  Leads: Lead[] = [];
  projects: Project[] = [];
  loading: boolean = true;
  componentType!: Type<any>;
  @ViewChild(GenericBourdComponent) genericBourd!: GenericBourdComponent;
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;
  constructor(private dialog:MatDialog ,private leadService: LeadService, private router: Router, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads(): void {
    this.leadService.getAllLeads().subscribe(res => {
      this.Leads = res;
      this.loading = false;
    });
  }

  onEditLead(Lead: Lead) {
    this.componentType = EditLeadComponent;
    this.popUpAddOrEdit("Edit Lead", Lead.leadId);
  }

  onDeleteLead(lead: Lead) {
      this.leadService.deleteLead(lead.leadId).subscribe((res:any)=>{this.loadLeads();
  });
  }
 
  addLead(){
    this.componentType = AddLeadComponent;
    this.popUpAddOrEdit("Add Lead");
  } 

  popUpAddOrEdit(title: string, l?:Number) {
    Swal.fire({
      title: title,
      html: '<div id="popupContainer"></div>',
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('popupContainer');
        if (container) {
          const factory = this.resolver.resolveComponentFactory(this.componentType);
          const componentRef = this.popupContainer.createComponent(factory);
          if(l!=null && l!=undefined)         
          componentRef.instance.setData(l);
          componentRef.instance.dataRefreshed.subscribe(() => {
            this.refreshData();})
          container.appendChild(componentRef.location.nativeElement);
        }
      },
    });
  }

  refreshData() {
    this.leadService.getAllLeads().subscribe(
      (Leads: Array<Lead>) => {
        this.Leads = Leads;
        this.loading= false;
        console.log("refreshData: ", this.Leads);
      })
  }
}

