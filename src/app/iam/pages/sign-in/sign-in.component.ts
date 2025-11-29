import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {SignInRequest} from "../../model/sign-in.request";

import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent extends BaseFormComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  isLoginInvalid = false;

  hidePassword = true;
  isLoading = false;

  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoginInvalid = false;
    this.isLoading = true;

    let username = this.form.value.username;
    let password = this.form.value.password;
    const signInRequest = new SignInRequest(username, password);

    this.authenticationService.signIn(signInRequest).subscribe({
      next: () => {
        this.submitted = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.submitted = false;
        this.isLoginInvalid = true;
        this.isLoading = false;
        console.error('Login failed in component', err);
      }
    });
  }
}
