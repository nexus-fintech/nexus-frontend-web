import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { map, take } from "rxjs";

/**
 * Role-based Guard Generator: Creates a CanActivateFn that checks if the
 * logged-in user has any of the required roles.
 * * @param allowedRoles Array of allowed roles (e.g., ['ROLE_ADMIN', 'ROLE_CLIENT'])
 */
export const hasRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    if (!authService.isUserSignedIn) {
      router.navigate(['/sign-in']).then();
      return false;
    }

    // 1. Get the current roles of the user
    return authService.currentRoles.pipe(
      take(1),
      map(userRoles => {

        // 2. Check if the user has AT LEAST ONE of the allowed roles
        const hasPermission = userRoles.some(role => allowedRoles.includes(role));

        if (hasPermission) {
          return true; // Access granted
        } else {
          // Security block: Redirect to Home since user lacks required permission
          console.warn(`Access denied. User does not have required roles: ${allowedRoles.join(', ')}.`);
          router.navigate(['/home']).then();
          return false;
        }
      })
    );
  };
};
