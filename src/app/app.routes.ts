import { Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { AboutComponent } from './public/pages/about/about.component';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { ClientManagementComponent } from './client/pages/client-management/client-management.component';
import { LoanApplicationComponent } from './loan/pages/loan-application/loan-application.component';
import { LoanEvaluationComponent } from './loan/pages/loan-evaluation/loan-evaluation.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'clients', component: ClientManagementComponent, title: 'Nexus | Client Management' },
  { path: 'loans/apply', component: LoanApplicationComponent, title: 'Nexus | Apply for Loan' },
  { path: 'loans/evaluate', component: LoanEvaluationComponent, title: 'Nexus | Loan Evaluation & Risk' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
