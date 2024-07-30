import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Lead } from 'src/app/Model/Lead';
import { LeadService } from '../../../Services/lead.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@app/Services/language.service';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css'],
})
export class AddLeadComponent {
  @Output() dataRefreshed: EventEmitter<void> = new EventEmitter<void>();
  userForm: FormGroup;
  titlePage: string;
  styles = {
    'text-align': 'right', // ברירת מחדל עברית
    'direction': 'rtl'     // ברירת מחדל עברית
  };
  constructor(
    private formBuilder: FormBuilder,
    private leadSrv: LeadService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService

  ) {
    // בניית הטופס בעזרת FormBuilder
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(12),
          this.phoneValidator,
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      source: ['', [Validators.required]],
      createdDate: [new Date()],
      lastContactedDate: [new Date()],
      businessName: ['', [Validators.required]],
      notes: [''],
    });
    this.titlePage = 'AddLead';
  }
  ngOnInit() {
    // האזנה לשינויים בשפה
    this.languageService.language$.subscribe(lang => {
      if (lang === 'he') {
        this.styles['text-align'] = 'right';
        this.styles['direction'] = 'rtl';
      } else {
        this.styles['text-align'] = 'left';
        this.styles['direction'] = 'ltr';
      }
    });
  }
  submitForm = () => {
    let formData = this.userForm.value;
    this.leadSrv.addLead(formData).subscribe((lead) => {
      //alert('הליד נוסף בהצלחה' + lead);
      this.translate.get('addLeadSuccess').subscribe((translation) =>
        Swal.fire({ title: translation, icon: 'success' }).then(() => {
          this.userForm.reset();
          Object.keys(this.userForm.controls).forEach((key) => {
            this.userForm.controls[key].markAsUntouched();
          });
          this.dataRefreshed.emit();
          Swal.close();
        })
      );
    });
  };

  backListLeadsPage = () => {
    this.router.navigate(['leads']);
  };
  // Validator מותאם אישית לטלפון
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex =
      /^(\d{10}|\d{3}-\d{3}-\d{4}|\d{2}-\d{7}|\d{2}-\d{3}-\d{4}|\d{2}-\d{6,7})$/; // ביטוי רגולרי שמאפשר רק מספרים ומקף
    const valid = phoneRegex.test(control.value);
    return valid ? null : { invalidPhone: true };
  }
}