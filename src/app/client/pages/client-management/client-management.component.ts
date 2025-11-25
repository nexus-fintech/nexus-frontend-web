import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card'; // INDISPENSABLE
import {MatTooltipModule} from '@angular/material/tooltip'; // EXCELENTE UX
import {CommonModule} from '@angular/common';
import {ClientCreateFormComponent} from '../../components/client-create-form/client-create-form.component';
import {Client} from '../../model/client.entity';
import {ClientsService} from '../../services/clients.service';
import {CreateClientRequest} from '../../model/create-client.request';

@Component({
  selector: 'app-client-management',
  standalone: true, // Arquitectura moderna
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    ClientCreateFormComponent
  ],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.scss'
})
export class ClientManagementComponent implements OnInit {

  // Definición de columnas
  displayedColumns: string[] = ['id', 'fullName', 'email', 'dni', 'city', 'actions'];
  dataSource = new MatTableDataSource<Client>();

  // Estado de la vista
  isCreating = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.clientsService.getAll().subscribe((response: any) => {
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onClientCreated(clientData: CreateClientRequest) {
    this.clientsService.create(clientData).subscribe({
      next: (newClient) => {
        console.log('Client created:', newClient);
        this.isCreating = false; // Volver a la lista automáticamente
        this.getAllClients();    // Refrescar datos
      },
      error: (err) => console.error('Error creating client:', err)
    });
  }

  onCancelCreation() {
    this.isCreating = false; // El usuario canceló, volvemos a la lista
  }

  startCreation() {
    this.isCreating = true; // El usuario quiere crear, mostramos formulario
  }
}
