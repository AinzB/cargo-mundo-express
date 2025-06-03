import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private userEmail:string = '';
  private userPass:string = '';

  loading:boolean = false;

  constructor(
    private alertService: AlertService, 
    private authService: AuthService, 
    private router: Router
  ) {}
  

  handleEmailChange(event: Event):void {
    let target = event.target as HTMLInputElement;
    let value = target.value;

    this.userEmail = value;
  }

  handlePassChange(event: Event):void {
    let target = event.target as HTMLInputElement;
    let value = target.value;

    this.userPass = value;
  }

  submitLogin():void {
    this.loading = true;

    if (!this.userEmail || !this.userPass) {
      this.alertService.showError('Email y contraseña requeridos.');
      this.loading = false;
      return;
    }

    this.authService.login(this.userEmail, this.userPass)
    .subscribe({
      next: () => {
        this.router.navigate(['/inicio']);
        this.alertService.showSuccess('Usuario autentificado.');
      },
      error: (err) => {
        this.alertService.showError('Credenciales inválidas. Por favor inténtalo de nuevo.');
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
