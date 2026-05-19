import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { studentExists } from './guards/studentExists';
import { authGuard } from './guards/auth';
import { Ahorcado } from './components/ahorcado/ahorcado';
import { Mayormenor } from './components/mayormenor/mayormenor';
import { Preguntados } from './components/preguntados/preguntados';
import { Nanograma } from './components/nanograma/nanograma';
import { guestGuard } from './guards/guest';
import { SalaChat } from './components/sala-chat/sala-chat';

export const routes: Routes = [
    { path:'login', component: Login, canActivate: [guestGuard] },
    
    { path:'signup', component: Signup, canActivate: [guestGuard] },

    { path:'home', component: Home },

    { path:'about', component: About, canActivate: [studentExists] },

    { path:'game', canActivate: [authGuard] , children:[

        { path:'ahorcado', component: Ahorcado },
        
        { path:'mayormenor', component: Mayormenor},

        { path:'preguntados', component: Preguntados},

        {path:'nanograma', component: Nanograma}

    ] },

    { path:'chat', component: SalaChat },

    {path:'', redirectTo:'home', pathMatch:'full'},

    { path:'**', redirectTo: '' }
];