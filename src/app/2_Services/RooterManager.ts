import { Router } from '@angular/router';
import { SessionManager } from './SessionManager';
import { NavigationParams } from '../1_Commons/NavigationParams';

export class RooterManager<T>{
  _store: T[] = [];

  public Push(val: T) {
    this._store.push(val);
  }

  public Pop(): T {
    return this._store.pop()!;
  }

  public Peek() {
    return this._store[this.Count() - 1];
  }

  public PeekOf(indexItem: any) {
    return this._store[this.Count() - indexItem];
  }

  public Count() {
    return this._store.length;
  }

  public GoTo(sessionManager: SessionManager, router: Router, component: any, pathUrl: string, pathTitle: string, navigationParams?: any) {
    let path: { url: string, title: string, navigationParams: NavigationParams } = { url: pathUrl, title: pathTitle, navigationParams: navigationParams };
    let rooterManager = new RooterManager<any>();
    rooterManager._store = sessionManager.getRooterManager()?._store!;
    if (pathTitle) {
      rooterManager.Push(path);
    }
    sessionManager.setRouterManager(rooterManager);
    router.config.push({ path: pathUrl, component, outlet: "MainComponent" });
    router.resetConfig(router.config);
    router.navigate([{ outlets: { MainComponent: pathUrl } }], { queryParams: navigationParams, skipLocationChange: true });
  }

}