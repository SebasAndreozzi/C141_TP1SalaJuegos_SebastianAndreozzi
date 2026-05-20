import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

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
  message = signal('');

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
      this.message.set('Registro exitoso!');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (err){
      this.loading.set(false);
      this.error.set((err as Error).message)
    }
  }
}
