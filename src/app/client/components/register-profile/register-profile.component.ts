import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {ClientCreateFormComponent} from '../client-create-form/client-create-form.component';
import {ClientsService} from '../../services/clients.service';
import {CreateClientRequest} from '../../model/create-client.request';

@Component({
  selector: 'app-register-profile',
  standalone: true,
  imports: [
    CommonModule,
    ClientCreateFormComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './register-profile.component.html',
  styleUrl: './register-profile.component.scss'
})
export class RegisterProfileComponent {

  constructor(
    private router: Router,
    private clientsService: ClientsService
  ) {}

  onCreateProfile(clientData: CreateClientRequest) {
    this.clientsService.create(clientData).subscribe({
      next: (newClient) => {
        console.log('Client profile successfully created:', newClient);

        this.router.navigate(['/loans/apply']).then();
      },
      error: (err) => {
        console.error('Error creating client profile after sign-up:', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/home']).then();
  }
}
