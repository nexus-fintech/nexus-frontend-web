import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {NgIf, AsyncPipe} from "@angular/common";
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../iam/services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  title = 'Nexus Finance';

  currentUserName: string = '';
  isSignedIn: boolean = false;

  private authSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authenticationService.isSignedIn.subscribe(
      (isSignedIn) => this.isSignedIn = isSignedIn
    );

    this.userSubscription = this.authenticationService.currentUsername.subscribe(
      (username) => this.currentUserName = username
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  onSignIn() {
    this.router.navigate(['/sign-in']);
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }

  onSignOut() {
    this.authenticationService.signOut();
    this.router.navigate(['/sign-in']);
  }
}
