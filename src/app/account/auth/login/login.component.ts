import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  /* #region Variables */

  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  passwordFieldType: string = 'password';

  /* #endregion */

  /* #region Constructor */

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authFackservice: AuthfakeauthenticationService,
    private ystanceService: YstanceService
  ) { }

  /* #endregion */

  /* #region Init & Loading */

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /* #endregion */

  /* #region Functions */

  get f() { return this.loginForm.controls; }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    sessionStorage.clear();
    this.submitted = true;
    let args = {
      login: this.f.email?.value,
      password: this.f.password?.value,
      idTenant: environment.idTenant
    }
    this.ystanceService.apiHandler(YstanceEndPoints.login, args).subscribe({ next: this.onSuccessSubmit, error: YstanceHelper.onErrorResponse })
  }

  /* #endregion */

  /* #region Arrow Function */

  onSuccessSubmit = (data: any) => {
    // C-08: ne JAMAIS stocker le mot de passe côté client (XSS = vol immédiat).
    // Si l'API Ystance renvoie user.password, on l'ignore explicitement.
    let user = {
      email: this.f.email?.value,
      username: data.user.fullname,
      id: undefined,
      firstName: undefined,
      lastName: undefined,
      token: 'Bearer ' + data.token,
      refreshToken: data.user.refreshToken,
      iduser: data.user.iduser,
      name: data.user.email,
      fullname: data.user.fullname,
    };
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.router.navigate(['/AlerteSanitaire']);
    this.authFackservice.currentUserSubject.next(user);
  }

  /* #endregion */

}