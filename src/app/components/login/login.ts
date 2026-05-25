import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = ''
  password = ''

  loading = signal(false)
  error = signal('')

  async onSubmit() {
    this.loading.set(true)
    this.error.set('')

    const success = await this.auth.login(this.email, this.password)

    if (success) {
      this.loading.set(false)
      this.router.navigate(['/'])
    }else{
      this.loading.set(false)
      this.error.set('Credenciales incorrectas.')
      this.mostrarError(this.error())
    }
    
  }

  async fastLogin1() {
    this.email = 'sandreozzi@salajuegos.com';
    this.password = '123456';
  }

  async fastLogin2() {
    this.email = 'nalvarez@salajuegos.com';
    this.password = 'qwerty';
  }

  async fastLogin3() {
    this.email = 'test@salajuegos.com';
    this.password = 'asdfgh';
  }

  mostrarError(error: string) {
    Swal.fire({
      title: error,
      icon: 'error',
      confirmButtonColor: '#fc3130',
    })
  }
}