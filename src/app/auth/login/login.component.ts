import { CommonModule, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as login from '../../../../public/assets/js/login.json';
import lottie from 'lottie-web';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../MaterialModule';
import { NgToastService } from 'ng-angular-popup';
import { ServicesService } from '../../API/services.service';
import { truncate } from 'fs';
import { RouteHistoryService } from '../../API/route-history.service';
import { MatInput } from '@angular/material/input';

export interface Login {
  SelectID?: any;
  UserName?: any
  Password?: any
  otp?: any;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  // providers: [DataservicesService]
})
export class LoginComponent {

  returnUrl: any;
  public Header: Login = {}
  forcelogin: any = false;
  Userinfo = {
    userid: 1,
    token: '',
    active: 'true',
  };
  loginForm: FormGroup;
  private boundHandler!: (event: PopStateEvent) => void;
  private isBrowser: boolean;
  @ViewChild('otpInput') otpInput!: MatInput;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: NgToastService,
    private spinner: NgxSpinnerService,
    private dataService: ServicesService,
    private fb: FormBuilder
    , private historyService: RouteHistoryService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      otp: new FormControl({ value: '', disabled: true }, [Validators.pattern(/^\d{6}$/)]) // 🔒 disabled at start
    });
  }


  // eyeicon
  passwordFieldType: string = 'password';
  SPName: any = 'INUR_GetUserLogin'
  correctOtp: any;
  isOtpValid: boolean | null = null;
  isOtpSent: boolean = false;

  animationData: any = (login as any).default;

  otpTimer: number = 0;
  timerInterval: any;
  displayTime = 0;
  otpControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]*$'),
    Validators.maxLength(8),
  ]);

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.returnUrl = this.returnUrl == "/" ? "/dashboard/dashboard" : this.returnUrl;
    this.isOtpSent = false;
    if (!this.isBrowser) return;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      requestIdleCallback(() => this.loadAnimation());
      // or
      // setTimeout(() => this.loadAnimation(), 0);
    }
  }

  validation() {
    debugger
    var userId = this.Header.UserName;
    var password = this.Header.Password;
    if (this.loginForm.invalid) {
      if (this.loginForm.get('UserName')?.hasError('required')) {
        Swal.fire({
          title: "User Name is Required",
          icon: "warning",
          showConfirmButton: false,
          timer: 1500
        });
        return false;
      }
    }
    // if (!!userId == false) {
    //   //this.toastr.danger("User Name is Required");
    //   Swal.fire({
    //     title: "User Name is Required",
    //     icon: "warning",
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    //   return false;
    // }
    // if (!!password == false) {
    //   Swal.fire({
    //     title: "Password is Required",
    //     icon: "warning",
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    //  // this.toastr.danger("","password is Required",5000);
    //   return false;
    // }
    return true;
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }



  // Verify OTP
  verifyOtp() {
    const otpValue = this.loginForm.get('otp')?.value;
    if (otpValue?.length === 6) {
      if (otpValue === this.correctOtp) {  // ✅ Replace with backend check
        this.isOtpValid = true;
        this.loginForm.get('otp')?.setErrors(null);
        clearInterval(this.timerInterval);
        this.otpTimer = 0
      } else {
        this.isOtpValid = false;
        this.loginForm.get('otp')?.setErrors({ invalidOtp: true });
      }
    } else {
      this.isOtpValid = null;
    }
  }

  verifyOtpold() {
    const OTP = this.otpControl.value ?? '';
    if (OTP.length === 6 && OTP === this.correctOtp) {
      this.isOtpValid = OTP === this.correctOtp;
      clearInterval(this.timerInterval);
      this.otpTimer = 0
      this.otpControl.setErrors(null);  // clear error
    } else {
      this.isOtpValid = false;
      this.otpControl.setErrors({ invalidOtp: true }); // mark as invalid
    }
  }


  startOtpTimerold(): void {
    this.otpTimer = 60;

    // Clear any previous interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Start the countdown
    this.timerInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;

        const minutes = '00';
        const seconds = this.otpTimer % 60;
        const textSec = seconds < 10 ? '0' + seconds : seconds;

        // this.displayTime = `${minutes}:${textSec}`; // Assign the formatted time to display

      } else {
        this.isOtpSent = false;
        clearInterval(this.timerInterval); // Stop the timer at 0
      }
    }, 1000);
  }

  startOtpTimer(seconds: number) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.otpTimer = seconds;
    this.displayTime = seconds;

    this.timerInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
        this.displayTime = this.otpTimer;
      } else {
        clearInterval(this.timerInterval);
        this.isOtpSent = false; // Lock field again
      }
    }, 1000);
  }

  SentOTP() {
    debugger
    if (this.validation()) {
      console.log('Form data:', this.loginForm.value.UserName);
      this.spinner.show();
      //this.dataService.LoginOtp(this.Header.UserName, this.Header.UserName).subscribe((data) => {
      this.dataService.LoginOtp(this.loginForm.value.UserName, this.loginForm.value.UserName).subscribe((data) => {
        if (data.success == true) {
          if (data.data.length > 0) {
            this.spinner.hide();
            debugger
            this.correctOtp = data.data[0].OTP
            localStorage.setItem('active', 'true');
            this.loginForm.get('otp')!.reset();
            this.loginForm.get('otp')!.enable();              // ✅ enable via FormControl API
            // optional autofocus
            setTimeout(() => this.otpInput?.focus(), 0);
            localStorage.setItem('userid', this.Header.UserName || '');
            //  localStorage.setItem('token', response.token);
            //  localStorage.setItem('sessionId', response.sessionId);
            localStorage.setItem('isLoggedin', 'true');
            // localStorage.setItem('AuthorisationWalkaroo', '');
            localStorage.setItem('ResponseNew', JSON.stringify(data));
            localStorage.setItem('LoginDetails', JSON.stringify(data.data[0]));
            debugger
            this.toastr.success(
              'success',
              'Email Sent',
            );
            this.startOtpTimer(60);
          } else {
            this.spinner.hide();
            this.toastr.warning(
              'WARNING',
              'Enter Credential Not Match Here !!!!!',
            );
            this.isOtpSent = false;
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.toastr.danger(
            'ERROR',
            data.message,
          );
          this.isOtpSent = false;

        }
      }, (error: any) => {
        this.toastr.danger('ERROR', error.Message)
        this.spinner.hide();
        this.isOtpSent = false;
      });
    }
    // else{
    //   this.toastr.warning(
    //   'WARNING',
    //     'Username is Required'
    //   );
    // }

  }
  onlogin() {

    this.toastr.success("Success", 'Login successfully!!!', 1000)
    this.historyService.markProgrammaticNav();
    this.router.navigate([this.returnUrl]);
  }
  async onLoggedin(e: Event) {
    e.preventDefault();
    //this.verifyOtp();
    debugger
    // if (this.isOtpValid) {
    if (this.validation()) {
      this.spinner.show();
      let headerOptions;
      debugger
      this.forcelogin = false;

      await this.CheckUser().then(async (CheckUser: any) => {

        if (CheckUser == "C" || CheckUser == "A") {
          this.forcelogin = true;
          let authorizationData = 'Basic ' + btoa(this.Header.UserName + ':' + this.Header.Password);

          headerOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': authorizationData,
              'Forcelogin': `'${this.forcelogin}'`
            })
          };
        }
        else {
          return
        }

        await this.dataService.getUserLogin(headerOptions).subscribe((response: any) => {

          let ipVar;
          if (response.success == true && response.data.length > 0) {

            // this.socket.emit('login', { userid: this.Header.UserName, token: response.token, active: true, IP: ipVar, sessionId: response.sessionId })
            this.spinner.hide();
            localStorage.setItem('active', 'true');
            localStorage.setItem('userid', this.Header.UserName || '');
            localStorage.setItem('token', response.token);
            localStorage.setItem('sessionId', response.sessionId);
            localStorage.setItem('isLoggedin', 'true');
            // localStorage.setItem('AuthorisationWalkaroo', '');
            localStorage.setItem('ResponseNew', JSON.stringify(response));
            localStorage.setItem('LoginDetails', JSON.stringify(response.data[0]));
            this.toastr.success("Success", 'Login successfully!!!', 9000)
            // this.toastr.success({ detail: "Success", summary: 'Login successfully!!!', duration: 9000 });
            this.router.navigate([this.returnUrl]);

          } else {
            this.spinner.hide();
            this.toastr.danger("Error", response.message, 9000)
            //this.toastr.danger({ detail: "Error", summary: response.message, duration: 9000 });
          }
        })


      });
    }
  }

  async CheckUser() {

    return new Promise(async (resolve, reject) => {

      this.forcelogin = false;

      const headerOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'UserID': `${this.Header.UserName}`
        })
      };
      console.log("ActiveUsers");


      await this.dataService.ActiveUsers(headerOptions).subscribe((response: any) => {
        console.log("response", response);

        if (response.success == true && response.data.length > 0) {

          this.spinner.hide()
          Swal.fire({
            title: "Alert",
            text: "Another user session already active. Do you want to force login ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
          }).then((result) => {

            //alert(result.isConfirmed);
            if (result.isConfirmed) {
              resolve("C");
              //return true
              //this.forcelogin = true;
            }
            else {
              reject("R");
              // return false
              //this.forcelogin = false;
            }

          });
        }
        else {
          reject("A");
        }
      })
      //reject(false);
    }
    )
      .then((result) => {
        return result;
      })
      .catch((result) => {
        return result;
      });
  }


  //loginanimation 
  loadAnimation() {
    const container = document.getElementById('animation-container');
    if (container) {
      const animation = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: this.animationData,
        name: 'demo animation'
      });
      // Find and hide the "Made with Lottielab" layer
      animation.addEventListener('DOMLoaded', () => {
        const layers = animation.renderer.elements;
        layers.forEach((layer: { name: string; hide: () => void; }) => {
          if (layer.name === 'Made with Lottielab') {
            layer.hide();
          }
        });
      });
    } else {
      console.error('Animation container not found');
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  // ngOnDestroy() {
  //  if (this.isBrowser) {
  //     window.removeEventListener('popstate', this.boundHandler);
  //  }

  // }


  // async canDeactivate() {
  //   const result = await Swal.fire({
  //     title: 'Leave login page?',
  //     text: 'Are you sure you want to go back?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   });
  //   return result.isConfirmed;
  // }

}


