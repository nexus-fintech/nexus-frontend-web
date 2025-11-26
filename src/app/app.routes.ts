import { Routes } from '@angular/router';

import { HomeComponent } from './public/pages/home/home.component';
import { AboutComponent } from './public/pages/about/about.component';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { SignInComponent } from './iam/pages/sign-in/sign-in.component';
import { SignUpComponent } from './iam/pages/sign-up/sign-up.component';
import { authenticationGuard } from './iam/services/authentication.guard';
import { ClientManagementComponent } from './client/pages/client-management/client-management.component';
import { LoanApplicationComponent } from './loan/pages/loan-application/loan-application.component';
import { LoanEvaluationComponent } from './loan/pages/loan-evaluation/loan-evaluation.component';
import {RegisterProfileComponent} from './client/components/register-profile/register-profile.component';

export const routes: Routes = [
  // --- Public Routes ---
  { path: 'home', component: HomeComponent, title: 'Nexus | Home' },
  { path: 'about', component: AboutComponent, title: 'Nexus | About' },

  // --- Authentication Routes ---
  { path: 'sign-in', component: SignInComponent, title: 'Nexus | Sign In' },
  { path: 'sign-up', component: SignUpComponent, title: 'Nexus | Sign Up' },
  { path: 'register-profile', component: RegisterProfileComponent, title: 'Nexus | Register profile' },

  // --- Protected Routes (Require Login) ---
  { path: 'clients', component: ClientManagementComponent, canActivate: [authenticationGuard], title: 'Nexus | Client Management' },
  { path: 'loans/apply', component: LoanApplicationComponent, canActivate: [authenticationGuard], title: 'Nexus | Apply for Loan' },
  { path: 'loans/evaluate', component: LoanEvaluationComponent, canActivate: [authenticationGuard], title: 'Nexus | Loan Evaluation & Risk' },

  // --- Default & Fallback Routes ---
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, title: 'Nexus | 404 Not Found' }
];
