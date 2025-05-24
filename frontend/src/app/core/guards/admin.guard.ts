import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';

export const AdminGuard: CanActivateFn = async () => {
  const userService = inject(UserService);
  const user = await firstValueFrom(userService.getCurrentUser());
  return user?.role === 'admin';
};
