import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { map, switchMap, take, of } from "rxjs";
import {ClientsService} from '../../client/services/clients.service';

/**
 * OnboardingGuard: Protects routes by ensuring that ROLE_CLIENT
 * has completed their profile in the Clients table (Onboarding step).
 */
export const onboardingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const clientService = inject(ClientsService);
  const router = inject(Router);

  if (!authService.isUserSignedIn) {
    router.navigate(['/sign-in']).then();
    return of(false);
  }

  return authService.currentRoles.pipe(
    take(1),
    switchMap(roles => {

      // If the user is not a CLIENT, this check is not needed (could be ADMIN or no role)
      // Note: If the role were already ADMIN, the roleGuard would have allowed access.
      // This Guard focuses on CLIENT.
      if (!roles.includes('ROLE_CLIENT')) {
        return of(true);
      }

      return authService.currentUserId.pipe(
        take(1),
        switchMap(userId => clientService.getClientByUserId(userId)),

        map(clientProfile => {
          if (clientProfile) {
            // Profile found: Allow navigation.
            return true;
          } else {
            // Profile NOT found: Block access and redirect to Onboarding.
            console.warn('Access blocked: Profile not completed.');
            router.navigate(['/register-profile']).then();
            return false;
          }
        })
      );
    })
  );
};
