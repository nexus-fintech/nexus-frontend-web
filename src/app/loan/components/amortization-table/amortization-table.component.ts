import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ScheduleEntry } from '../../model/schedule-entry.entity';

@Component({
  selector: 'app-amortization-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule],
  templateUrl: './amortization-table.component.html',
  styleUrl: './amortization-table.component.scss'
})
export class AmortizationTableComponent {
  @Input() schedule: ScheduleEntry[] = [];

  displayedColumns: string[] = ['number', 'date', 'principal', 'interest', 'total', 'status'];
}
