import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';

// Nota: ClientCreateFormComponent ya no es necesario aquí.
import {Client} from '../../model/client.entity';
import {ClientsService} from '../../services/clients.service';
import {CreateClientRequest} from '../../model/create-client.request'; // Se mantiene solo por si se usa en el servicio, pero no en este componente

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    // Eliminado: ClientCreateFormComponent
  ],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.scss'
})
export class ClientManagementComponent implements OnInit {

  // Definición de columnas
  displayedColumns: string[] = ['id', 'fullName', 'email', 'dni', 'city', 'actions'];
  dataSource = new MatTableDataSource<Client>();

  // Eliminado: isCreating = false; <-- Ya no se usa

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

  // Eliminadas las funciones onClientCreated, onCancelCreation, y startCreation.
  // Este componente es ahora solo de visualización y gestión.
}
