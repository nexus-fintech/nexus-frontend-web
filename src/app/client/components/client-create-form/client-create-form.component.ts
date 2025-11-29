import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges} from '@angular/core';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {CreateClientRequest} from '../../model/create-client.request';
import {Client} from '../../model/client.entity';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-client-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './client-create-form.component.html',
  styleUrl: './client-create-form.component.scss'
})
export class ClientCreateFormComponent extends BaseFormComponent implements OnInit, OnChanges {

  @Input() clientData: Client | null = null;

  @Output() formSubmitted = new EventEmitter<CreateClientRequest>();
  @Output() formCanceled = new EventEmitter<void>();

  clientForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: Client
  ) {
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

  ngOnInit(): void {
    if (this.dialogData) {
      this.isEditMode = true;
      this.clientForm.patchValue(this.dialogData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientData'] && this.clientData) {
      this.isEditMode = true;
      this.clientForm.patchValue(this.clientData);
    }
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.formSubmitted.emit(this.clientForm.value);

      if (!this.isEditMode) {
        this.clientForm.reset();
      }
    }
  }

  onCancel() {
    this.formCanceled.emit();
    if (!this.isEditMode) {
      this.clientForm.reset();
    }
  }
}
