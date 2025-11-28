import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../iam/services/authentication.service';
import {ClientsService} from '../../../client/services/clients.service';

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
  currentRoles: string[] = [];

  isProfileComplete: boolean = true;

  private authSubscription!: Subscription;
  private userSubscription!: Subscription;
  private roleSubscription!: Subscription;
  private clientSubscription!: Subscription;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authenticationService.isSignedIn.subscribe(
      (isSignedIn) => {
        this.isSignedIn = isSignedIn;
        if (isSignedIn) {
          this.checkProfileCompletion();
        }
      }
    );

    this.userSubscription = this.authenticationService.currentUsername.subscribe(
      (username) => this.currentUserName = username
    );

    this.roleSubscription = this.authenticationService.currentRoles.subscribe(
      (roles) => this.currentRoles = roles
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.roleSubscription) this.roleSubscription.unsubscribe();
    if (this.clientSubscription) this.clientSubscription.unsubscribe();
  }

  /**
   * Checks whether the current user (if they are a CLIENT) has their profile completed.
   */
  checkProfileCompletion(): void {
    if (!this.isClient) return;

    this.authenticationService.currentUserId.subscribe(userId => {
      if (userId) {
        this.clientSubscription = this.clientsService.getClientByUserId(userId).subscribe({
          next: (profile) => {
            this.isProfileComplete = !!profile;
          },
          error: () => this.isProfileComplete = false
        });
      }
    }).unsubscribe();
  }

  get isAdmin(): boolean {
    return this.currentRoles.includes('ROLE_ADMIN');
  }

  get isClient(): boolean {
    return this.currentRoles.includes('ROLE_CLIENT');
  }

  onSignIn() { this.router.navigate(['/sign-in']); }
  onSignUp() { this.router.navigate(['/sign-up']); }

  onSignOut() {
    this.authenticationService.signOut();
    this.router.navigate(['/sign-in']);
  }
}
