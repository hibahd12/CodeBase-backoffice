import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionStorage } from 'ngx-webstorage';
import { RooterManager } from './RooterManager';
import { YstanceContext } from '../1_Commons/YstanceContext';

@Injectable()
export class SessionManager {
    @SessionStorage('rooterManager')
    public rooterManager: RooterManager<any>;
    @SessionStorage('token')
    public token :any;
    @SessionStorage('context')
    public context: YstanceContext;
    @SessionStorage('currentFormValue')
    public currentFormValue: any;
    private authenticationChanged = new Subject<boolean>();

    constructor() {
    }

    public isAuthenticated(): boolean {
        return (!(this.token === undefined || this.token === null || this.token === 'null' || this.token === 'undefined' || this.token === ''));
    }

    public isAuthenticationChanged(): any {
        return this.authenticationChanged.asObservable();
    }

    public getToken(): any {
        if (this.token === undefined || this.token === null || this.token === 'null' || this.token === 'undefined' || this.token === '') {
            return '';
        }
        return this.token;
    }

    public setToken(data: any): void {
        this.setStorageToken(data);
    }

    public failToken(): void {
        this.token = '';
    }

    public logout(): void {
        this.token = '';
        this.context = null!;
        this.rooterManager = null!;
        this.authenticationChanged.next(this.isAuthenticated());
    }

    private setStorageToken(value: any): void {
        this.token = value;
        this.authenticationChanged.next(this.isAuthenticated());
    }

    public getContext() {
        if (this.context === undefined ||
            this.context === null) {
            return '';
        }
        return this.context;
    }

    public setContext(context: YstanceContext) {
        this.context = context;
    }

    public getRooterManager() {
        if (this.rooterManager) {
            return this.rooterManager;
        }
        return null;
    }

    public setRouterManager(rooterManager: RooterManager<any>) {
        this.rooterManager = rooterManager;
    }

    public getCurrentFormValue() {
        if (this.currentFormValue === undefined || this.currentFormValue === null) {
            return null;
        }
        return this.currentFormValue;
    }

    public setCurrentFormValue(currentFormValue: any) {
        this.currentFormValue = currentFormValue;
    }

}