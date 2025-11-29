import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Loan } from '../../../loan/model/loan.entity';
import { ClientsService } from '../../services/clients.service';
import { LoansService } from '../../../loan/services/loans.service';
import { Client } from '../../model/client.entity';
import { ClientCreateFormComponent } from '../../components/client-create-form/client-create-form.component';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss'
})
export class ClientProfileComponent implements OnInit {

  client: Client | null = null;
  clientLoans: Loan[] = [];
  displayedColumns: string[] = ['id', 'amount', 'rate', 'term', 'status', 'date', 'actions'];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private loansService: LoansService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    if (clientId) {
      this.loadClientData(clientId);
      this.loadClientLoans(clientId);
    }
  }

  loadClientData(id: number) {
    this.clientsService.getById(id).subscribe({
      next: (data) => {
        this.client = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading client', err);
        this.isLoading = false;
      }
    });
  }

  loadClientLoans(clientId: number) {
    this.loansService.getLoansByClientId(clientId).subscribe({
      next: (loans) => {
        this.clientLoans = loans;
      },
      error: (err) => console.error('Error loading client loans', err)
    });
  }

  onEditProfile() {
    if (!this.client) return;

    const dialogRef = this.dialog.open(ClientCreateFormComponent, {
      data: this.client,
      width: '600px',
      maxWidth: '95vw'
    });

    const sub = dialogRef.componentInstance.formSubmitted.subscribe((updatedData) => {

      this.clientsService.update(this.client!.id, updatedData).subscribe({
        next: (response) => {
          console.log('Client updated:', response);
          this.client = response;
          dialogRef.close();
        },
        error: (err) => console.error('Error updating client', err)
      });
    });

    dialogRef.componentInstance.formCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  getLoanStatusClass(status: string): string {
    return status.toLowerCase();
  }

  goBack() {
    window.history.back();
  }
}
