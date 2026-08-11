import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionManager } from './SessionManager';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(
        private router: Router,
        private sessionManager: SessionManager
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (!this.sessionManager.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}