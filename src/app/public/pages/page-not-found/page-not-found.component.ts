import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit {
  invalidUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route.snapshot.url.length > 0) {
      this.invalidUrl = this.route.snapshot.url[0].path;
    } else {
      this.invalidUrl = 'Unknown';
    }
  }
}
