import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

export const AuthGuard: CanActivateFn = async () => {
  const userService = inject(UserService);
  const router = inject(Router);

  try {
    const user = await firstValueFrom(
      userService.getCurrentUser().pipe(
        catchError((error) => {
          console.error('AuthGuard: Failed to fetch user', error);
          router.navigate(['/login']);
          return of(null);
        })
      )
    );

    if (user) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('AuthGuard: Error', error);
    router.navigate(['/login']);
    return false;
  }
};
