import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  apellido = '';
  edad = null;
  email = '';
  password = '';

  loading = signal(false);
  error = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');

    const newUser: User = {
      id: '',
      email: this.email,
      nombre: this.nombre,
      apellido: this.apellido,
      edad: this.edad,
    }

    try{
      await this.auth.register(newUser, this.password);
      
      this.loading.set(false);
      this.registroExitoso('Registro exitoso!');

    } catch (err){
      this.loading.set(false);
      this.error.set((err as Error).message)
      this.mostrarError(this.error());

    }
  }

  mostrarError(error: string) {
    Swal.fire({
      title: error,
      icon: 'error',
      confirmButtonColor: '#fc3130',
    })
  }

  registroExitoso(mensaje: string) {
    Swal.fire({
      title: mensaje,
      html: `<div style="font-size: 1.2rem; margin-bottom: 1rem;">
                Redirigiendo al inicio...
              </div>`,
      icon: 'success',
      showConfirmButton: false,
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: 2000,
      timerProgressBar: true,
      willClose: () => {
        this.router.navigate(['/']);
      }
    })
  }
}
