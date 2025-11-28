import { Routes } from '@angular/router';

import { HomeComponent } from './public/pages/home/home.component';
import { AboutComponent } from './public/pages/about/about.component';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { SignInComponent } from './iam/pages/sign-in/sign-in.component';
import { SignUpComponent } from './iam/pages/sign-up/sign-up.component';
import { authenticationGuard } from './iam/services/authentication.guard';
import { onboardingGuard } from './iam/services/onboarding.guard';
import { hasRoleGuard } from './iam/services/role-check.guard';
import { ClientManagementComponent } from './client/pages/client-management/client-management.component';
import { LoanApplicationComponent } from './loan/pages/loan-application/loan-application.component';
import { LoanEvaluationComponent } from './loan/pages/loan-evaluation/loan-evaluation.component';
import {RegisterProfileComponent} from './client/components/register-profile/register-profile.component';

export const routes: Routes = [
  // --- Public Routes (No login required) ---
  { path: 'sign-in', component: SignInComponent, title: 'Nexus | Sign In' },
  { path: 'sign-up', component: SignUpComponent, title: 'Nexus | Sign Up' },
  { path: 'register-profile', component: RegisterProfileComponent, title: 'Nexus | Register profile' },
  { path: 'about', component: AboutComponent, title: 'Nexus | About' },


  // --- Protected Routes ---

  // HOME: Requires a complete profile.
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard, onboardingGuard],
    title: 'Nexus | Home'
  },

  // CLIENT MANAGEMENT: RRequires ADMIN role and a complete profile (although the profile doesn't matter for ADMIN, we've included it for consistency).
  {
    path: 'clients',
    component: ClientManagementComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_ADMIN']), onboardingGuard],
    title: 'Nexus | Client Management'
  },

  // APPLY LOAN: Requires CLIENT Role and Full Profile
  {
    path: 'loans/apply',
    component: LoanApplicationComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_CLIENT', 'ROLE_ADMIN']), onboardingGuard],
    title: 'Nexus | Apply for Loan'
  },

  // LOAN EVALUATION: Requires ADMIN role (This is the sensitive path)
  {
    path: 'loans/evaluate',
    component: LoanEvaluationComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_ADMIN'])],
    title: 'Nexus | Loan Evaluation & Risk'
  },

  // --- Default & Fallback Routes ---
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, title: 'Nexus | 404 Not Found' }
];
