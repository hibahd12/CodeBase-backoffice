import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import Swal from 'sweetalert2';
import { YstanceService } from 'src/app/2_Services/YstanceService';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {

  resetForm: UntypedFormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, public ystanceService: YstanceService, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }


  /**
   * On form submit
   */

  onSubmit() {
    this.success = '';
    this.submitted = true;
    if (this.resetForm.valid) {
      this.sendRequestResetPasswordEmail();
    } else {
      return;
    }
  }

  sendRequestResetPasswordEmail() {
    sessionStorage.clear();
    let args = {
      mailSubject:'Réinitialisation mot de passe',
      idTenant: environment.idTenant,
      toAddresses: this.resetForm.get('email')?.value,
    };
    this.ystanceService.apiHandler(YstanceEndPoints.SendMailChangePassword, args).subscribe(
      async (data) => {
        Swal.fire({
          text: "We have sent you an email containing a link to reset your password",
          icon: "success",
          showCloseButton: true,
        });
        this.resetForm.get("email")?.reset();
      },
      (error) => {
        Swal.fire({
          text: "The user does not exist",
          icon: "warning",
          showCloseButton: true,
        });
      }
    );
  }


}
