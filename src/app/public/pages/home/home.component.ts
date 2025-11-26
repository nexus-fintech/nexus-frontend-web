import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatButton, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
