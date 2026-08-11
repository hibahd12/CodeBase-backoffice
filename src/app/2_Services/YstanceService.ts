import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { YstanceEndPoints } from '../1_Commons/YstanceEndPoints';
import { AuthenticationService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class YstanceService {

    /* #region Variables */

    private loggedIn = new BehaviorSubject<boolean>(false);
    requestOptions: any;
    getrequestOptions: any;

    /* #endregion */

    /* #region Constructor */

    constructor(
        public http: HttpClient,
        public router: Router,
        private authenticationService: AuthenticationService
    ) { }

    /* #endregion */

    /* #region Functions */

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    buildRequestOptions() {
        let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
        var token = user?.token
        this.requestOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            })
        }
    }

    apiHandler(endPointName: string, args: any) {
        this.buildRequestOptions();
        let strArgs = JSON.stringify(args);
        return this.http.post(environment.apiUrl + endPointName, strArgs, this.requestOptions).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    async tryRefreshingTokens() {
        let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
        const token = user?.token?.replace('Bearer ', '');
        const refreshToken = user?.refreshToken;
    
        if (!token || !refreshToken) {
            this.logout();
            return false;
        }
    
        let args = {
            accessToken: token,
            refreshToken: refreshToken
        };
        let strArgs = JSON.stringify(args);
        let requestOptionsRefrechToken = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        };
    
        try {
            const refreshRes = await new Promise<any>((resolve, reject) => {
                this.http.post<any>(environment.apiUrl + YstanceEndPoints.refreshTokenEndPoint, strArgs, requestOptionsRefrechToken).subscribe({
                    next: (res: any) => resolve(res),
                    error: (_) => {
                        reject();
                    }
                });
            });
    
            // C-08: ne JAMAIS stocker user.password côté client
            let newUserInfos = {
                email: "admin@themesbrand.com",
                username: "admin",
                id: undefined,
                firstName: undefined,
                lastName: undefined,
                token: 'Bearer ' + refreshRes.token,
                refreshToken: refreshRes.user.refreshToken,
                iduser: refreshRes.user.iduser,
                name: refreshRes.user.email,
                fullname: refreshRes.user.fullname,
            };
    
            sessionStorage.setItem('currentUser', JSON.stringify(newUserInfos));
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    timeOutSession() {
        this.loggedIn.next(false);
    }

    logout() {
        sessionStorage.clear();
        this.loggedIn.next(false);
        this.router.navigate(['/account/login']);
    }

    /* #endregion */

}