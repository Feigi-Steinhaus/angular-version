import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Communication } from '@app/Model/Communication';
import { CommunicationService } from '@app/Services/communication.service';

@Component({
  selector: 'app-propil',
  templateUrl: './propil.component.html',
  styleUrls: ['./propil.component.css']
})
export class PropilComponent {
  @Input() communication!: Communication;
  responses: Communication[] = [];
  responseForm!: FormGroup;
  
  @Output() deleteMessageEvent = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private communicationService: CommunicationService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.fetchResponses();
    this.initializeForm();
  }

  fetchResponses(): void {
    this.communicationService.readAll().subscribe(res => {
      console.log(res);
      this.responses = res.filter(comm => comm.relatedId === this.communication.communicationId);
    });
  }

  initializeForm(): void {
    this.responseForm = this.formBuilder.group({
      details: [''],
      communicationId: [0],
      type: [''],
      date: [new Date()],
      relatedId: [this.communication.communicationId],
      name: []
    });
  }

  sendResponse(): void {
    if (!this.responseForm.valid) {
      return;
    }
    this.communicationService.AddNewCommunication(this.responseForm.value).subscribe(() => {
      this.fetchResponses();
      this.responseForm.reset();
      this.responseForm.patchValue({ relatedId: this.communication.communicationId, date: new Date() });
    });
  }

  deleteMessage(message: any): void {
    this.communicationService.deleteCommunication(message.communicationId).subscribe(() => {
      this.deleteMessageEvent.emit(message);
    });
  }

}
