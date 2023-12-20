import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.css'],
})
export class AddGroupsComponent {
  addGroupForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.addGroupForm = new FormGroup(
      {
        productGroupName: new FormControl('', Validators.required),
        productGroupPrefix: new FormControl('', Validators.required),
        productGroupDetails: new FormControl(''),
      }
      // { validators: this.passwordMatchValidator }
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addGroupForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.addGroupForm.valid) {
      console.log('Form Data:', this.addGroupForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
