import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntajeService } from '../../services/puntaje';
import { Puntaje } from '../../models/puntaje';
import { DatePipe } from '../../pipes/date';
import { MensajePropioDirective } from '../../directives/userActivo';
import { AuthService } from '../../services/auth';
import { UserNamePipe } from '../../pipes/userName';

@Component({
  selector: 'app-tabla-puntaje',
  imports: [CommonModule, DatePipe, MensajePropioDirective],
  templateUrl: './tabla-puntaje.html',
  styleUrl: './tabla-puntaje.css',
})
export class TablaPuntaje {
  private puntajeService = inject(PuntajeService)
  auth = inject(AuthService);
  userNameFormat = new UserNamePipe();

  activeUser = signal<string>('');

  puntajeAhorcado = signal<Puntaje[]>([]);
  puntajeMayorMenor = signal<Puntaje[]>([]);
  puntajePreguntados = signal<Puntaje[]>([]);
  puntajeNanograma = signal<Puntaje[]>([]);

  async ngOnInit(){
    await this.auth.checkSession();
    this.activeUser.set(await this.userNameFormat.transform(this.auth.userEmail()))
    
    await this.cargarPuntajes();
  }

  async cargarPuntajes(){
    this.puntajeAhorcado.set(await this.puntajeService.obtenerPuntajes('ahorcadoPuntaje'));
    this.puntajeMayorMenor.set(await this.puntajeService.obtenerPuntajes('mayormenorPuntaje'));
    this.puntajePreguntados.set(await this.puntajeService.obtenerPuntajes('preguntadosPuntaje'));
    this.puntajeNanograma.set(await this.puntajeService.obtenerPuntajes('nanogramaPuntaje'));
  }
}
