import { Component, inject, signal } from '@angular/core';
import { ChatService } from '../../services/chat';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { UserNamePipe } from '../../pipes/userName';
import { HoraPipe } from '../../pipes/hora'; 

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, HoraPipe],
  templateUrl: './sala-chat.html',
  styleUrl: './sala-chat.css'
})

export class SalaChat {
  chatService = inject(ChatService);
  auth = inject(AuthService);
  userNameFormat = new UserNamePipe();

  userName = signal<string>('');
  newMessage = '';

  async ngOnInit() {

    await this.auth.checkSession();

    this.userName.set(await this.userNameFormat.transform(this.auth.userEmail()))
  }

  async enviar() {
    const user_id = this.auth.user()?.id;
    const user_name = this.userNameFormat.transform(this.auth.userEmail());
    const texto = this.newMessage.trim();

    if (user_id && texto) {
      await this.chatService.enviarMensajeConUsuario(texto, user_id, user_name);
      this.newMessage = '';
    }
  }
}