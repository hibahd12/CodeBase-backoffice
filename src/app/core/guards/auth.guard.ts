import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private jwtHelper: JwtHelperService,
        private ystanceService: YstanceService,
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
        var token = user?.token;
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            return true;
        }        
        return await this.ystanceService.tryRefreshingTokens();        
    }
}
