import { CanActivateFn } from '@angular/router';

export const authCodeGuard: CanActivateFn = (route, state) => {
  return true;
};

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthCodeDialogComponent } from '../Components/auth-code-dialog/auth-code-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class AuthCodeGuard implements CanActivate {
  constructor(private dialog: MatDialog) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.openAuthDialog();
  }

  openAuthDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(AuthCodeDialogComponent, {
      width: '300px',
      disableClose: true,
    });

    return dialogRef.afterClosed().toPromise();
  }
}
