import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { UserNamePipe } from '../../pipes/userName';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, RouterLinkActive, UserNamePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  auth = inject(AuthService);
}
