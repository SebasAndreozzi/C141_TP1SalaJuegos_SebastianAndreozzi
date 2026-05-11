import { Injectable, signal, computed, inject } from '@angular/core';
import { Student } from '../models/student';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.github.com/users/SebasAndreozzi';
  
  private student = signal<Student | null>(null);

  studentData = this.student.asReadonly();
  loading = signal(false);
  error   = signal<string | null>(null);

  async loadStudent(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const apiStudent = await firstValueFrom(this.http.get<any>(this.apiUrl));

      this.student.set({
        id: apiStudent.id,
        nombre: apiStudent.name,
        avatar: apiStudent.avatar_url,
        username: apiStudent.login,
        ubicacion: apiStudent.location,
      });
    } catch (err) {
      this.error.set('Error al cargar el estudiante');
    } finally {
      this.loading.set(false);
    }
  }
}