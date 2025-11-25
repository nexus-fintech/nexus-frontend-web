import {Component, EventEmitter, Output} from '@angular/core';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {CreateClientRequest} from '../../model/create-client.request';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card'; // <--- NUEVO: Para el contenedor
import {MatIconModule} from '@angular/material/icon'; // <--- NUEVO: Para iconos visuales

@Component({
  selector: 'app-client-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule, // Importante
    MatIconModule  // Importante
  ],
  templateUrl: './client-create-form.component.html',
  styleUrl: './client-create-form.component.scss'
})
export class ClientCreateFormComponent extends BaseFormComponent {

  @Output() formSubmitted = new EventEmitter<CreateClientRequest>();
  @Output() formCanceled = new EventEmitter<void>();

  clientForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.formSubmitted.emit(this.clientForm.value);
      this.clientForm.reset();
    }
  }

  onCancel() {
    this.formCanceled.emit();
    this.clientForm.reset();
  }
}
