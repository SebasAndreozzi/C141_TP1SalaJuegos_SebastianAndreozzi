import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hour',
  standalone: true
})
export class HourPipe implements PipeTransform {

  transform(value: string): string {

    const fecha = new Date(value);

    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${horas}:${minutos}`;
  }
}