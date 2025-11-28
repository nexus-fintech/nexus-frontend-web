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
import { RegisterProfileComponent } from './client/components/register-profile/register-profile.component';
import { LoanDetailComponent } from './loan/pages/loan-detail/loan-detail.component';
import { MyLoansComponent } from './loan/pages/my-loans/my-loans.component'; // <-- Key Import

export const routes: Routes = [
  // --- Public Routes (No login required) ---
  { path: 'sign-in', component: SignInComponent, title: 'Nexus | Sign In' },
  { path: 'sign-up', component: SignUpComponent, title: 'Nexus | Sign Up' },
  { path: 'register-profile', component: RegisterProfileComponent, title: 'Nexus | Register profile' },
  { path: 'about', component: AboutComponent, title: 'Nexus | About' },

  // --- Protected Routes ---

  // HOME: Requires a completed profile.
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard, onboardingGuard],
    title: 'Nexus | Home'
  },

  // CLIENT MANAGEMENT (ADMIN): Requires ADMIN role.
  {
    path: 'clients',
    component: ClientManagementComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_ADMIN']), onboardingGuard],
    title: 'Nexus | Client Management'
  },

  // APPLY LOAN (CLIENT): Requires CLIENT role and a completed profile.
  {
    path: 'loans/apply',
    component: LoanApplicationComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_CLIENT']), onboardingGuard],
    title: 'Nexus | Apply for Loan'
  },

  // MY LOANS (CLIENT): Personal loan list view.
  {
    path: 'my-loans',
    component: MyLoansComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_CLIENT']), onboardingGuard],
    title: 'Nexus | My Loans'
  },

  // LOAN EVALUATION (ADMIN): Requires ADMIN role.
  {
    path: 'loans/evaluate',
    component: LoanEvaluationComponent,
    canActivate: [authenticationGuard, hasRoleGuard(['ROLE_ADMIN'])],
    title: 'Nexus | Loan Evaluation & Risk'
  },

  // LOAN DETAIL (SHARED): Detail view (Schedule).
  // Accessible by CLIENT (to see their own) and ADMIN (to see any).
  {
    path: 'loans/detail/:id',
    component: LoanDetailComponent,
    canActivate: [authenticationGuard, onboardingGuard],
    title: 'Nexus | Loan Detail'
  },

  // --- Default & Fallback Routes ---
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, title: 'Nexus | 404 Not Found' }
];
