import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { JwtRequest } from 'src/app/model/JwtRequest';
import { AuthService } from 'src/app/service/auth-service/auth-service.service';
import { TokenStorageService } from 'src/app/service/auth-service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })
  
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor( private tokenStorage: TokenStorageService, private formBuilder: FormBuilder,
    private authService: AuthService, private route:Router) {
     
     }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  get username(): any{
    return this.form.get("username") as FormArray;
  }
  get password(): any{
    return this.form.get("password") as FormArray;
  }
  
  onSubmit(): void {
    let state: RouterStateSnapshot
    let authenticationRequest = new JwtRequest(this.username.value, this.password.value);
   
    this.authService.login(authenticationRequest).subscribe(
     
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.route.navigate(['/home'])
        .finally(() => {
          window.location.reload();
        });
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

}
