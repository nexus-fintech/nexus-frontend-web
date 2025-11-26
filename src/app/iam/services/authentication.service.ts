import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";

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

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const roles = localStorage.getItem('roles');

    const rolesString = localStorage.getItem('roles');

    if (token && userId && username && rolesString && rolesString !== 'undefined') {
      this.signedIn.next(true);
      this.signedInUserId.next(Number(userId));
      this.signedInUsername.next(username);

      try {
        this.signedInRoles.next(JSON.parse(rolesString));
      } catch (e) {
        console.error("Failed to parse roles from localStorage. Clearing key.", e);
        localStorage.removeItem('roles');
        this.signedIn.next(false);
      }
    }
  }


  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  get currentRoles() {
    return this.signedInRoles.asObservable();
  }

  hasRole(role: string): boolean {
    return this.signedInRoles.value.includes(role);
  }

  // --- Acciones ---

  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed up as ${response.username} with id: ${response.id}`);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error while signing up: ${error}`);
        }
      });
  }

  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          // 1. Actualizar Subjects
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInUsername.next(response.username);
          this.signedInRoles.next(response.roles);

          // 2. Guardar en LocalStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('username', response.username);
          localStorage.setItem('roles', JSON.stringify(response.roles));

          console.log(`Signed in as ${response.username} with roles: ${response.roles}`);
          this.router.navigate(['/home']).then();
        },
        error: (error) => {
          this.signOut();
          console.error(`Error while signing in: ${error}`);
        }
      });
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
