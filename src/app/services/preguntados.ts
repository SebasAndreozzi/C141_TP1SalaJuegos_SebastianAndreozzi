import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pregunta } from '../models/pregunta';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {

  private http = inject(HttpClient);
  private apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

  preguntas: Pregunta[] = [];

  loading = signal(false);
  error   = signal<string | null>(null);

  async loadPreguntas(): Promise<void> {
      this.loading.set(true);
      this.error.set(null);
  
      try {
        const apiPreguntados = await firstValueFrom(this.http.get<any>(this.apiUrl));
  
        this.preguntas = apiPreguntados.results.map((item: any) => ({
          pregunta: item.question,
          respuesta_correcta: item.correct_answer,
          respuestas_incorrectas: item.incorrect_answers
        }));
      } catch (err) {
        this.error.set('Error al cargar las preguntas');
      } finally {
        this.loading.set(false);
      }
    }

}