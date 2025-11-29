import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, tap, throwError} from "rxjs"; // Importar tap y throwError
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";
import {ClientsService} from '../../client/services/clients.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  basePath: string = `${environment.serverBasePath}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'}) };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private signedInRoles: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    private router: Router,
    private http: HttpClient,
    private clientsService: ClientsService
  ) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const rolesString = localStorage.getItem('roles');

    if (token && userId && username && rolesString && rolesString !== 'undefined') {
      this.signedIn.next(true);
      this.signedInUserId.next(Number(userId));
      this.signedInUsername.next(username);

      try {
        this.signedInRoles.next(JSON.parse(rolesString));
      } catch (e) {
        console.error("Failed to parse roles from localStorage. Clearing roles key.", e);
        localStorage.removeItem('roles');
        this.signedIn.next(false);
      }
    }
  }

  get isSignedIn() { return this.signedIn.asObservable(); }
  get isUserSignedIn(): boolean { return this.signedIn.value; }
  get currentUserId() { return this.signedInUserId.asObservable(); }
  get currentUsername() { return this.signedInUsername.asObservable(); }
  get currentRoles() { return this.signedInRoles.asObservable(); }
  hasRole(role: string): boolean { return this.signedInRoles.value.includes(role); }

  // --- Actions ---
  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions);
  }

  signIn(signInRequest: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .pipe(
        tap((response) => {
          this.handleSignInSuccess(response);
        }),
        catchError((error) => {
          this.signOut();
          console.error(`Error while signing in: ${error}`);
          return throwError(() => error);
        })
      );
  }

  // Lógica de éxito extraída para limpieza
  private handleSignInSuccess(response: SignInResponse) {
    const rolesToStore = response.roles || [];

    this.signedIn.next(true);
    this.signedInUserId.next(response.id);
    this.signedInUsername.next(response.username);
    this.signedInRoles.next(rolesToStore);

    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.id.toString());
    localStorage.setItem('username', response.username);
    localStorage.setItem('roles', JSON.stringify(rolesToStore));

    console.log(`Signed in as ${response.username} with roles: ${rolesToStore}`);

    if (rolesToStore.includes('ROLE_ADMIN')) {
      console.log('Redirecting ADMIN to Home.');
      this.router.navigate(['/home']).then();
      return;
    }

    if (rolesToStore.includes('ROLE_CLIENT')) {
      const userId = response.id;
      this.clientsService.getClientByUserId(userId).subscribe({
        next: (clientProfile) => {
          if (clientProfile) {
            console.log('Client profile found. Redirecting to Home.');
            this.router.navigate(['/home']).then();
          } else {
            console.warn('Client profile MISSING. Redirecting to Onboarding.');
            this.router.navigate(['/register-profile']).then();
          }
        },
        error: (err) => {
          console.error('Error checking client profile:', err);
          this.router.navigate(['/register-profile']).then();
        }
      });
      return;
    }

    console.log('User role unknown. Redirecting to Home.');
    this.router.navigate(['/home']).then();
  }

  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    this.signedInRoles.next([]);

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');

    this.router.navigate(['/sign-in']).then();
  }
}
