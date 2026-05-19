import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

@Directive({
  selector: '[appMensajePropio]',
  standalone: true
})
export class MensajePropioDirective implements OnChanges {

  private el = inject(ElementRef);

  @Input() appMensajePropio = '';
  @Input() usuarioActivo = '';

  ngOnChanges() {

    if (this.appMensajePropio === this.usuarioActivo) {

      this.el.nativeElement.style.color = '#fc3130';

    }
  }
}