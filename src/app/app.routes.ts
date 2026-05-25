import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { studentExists } from './guards/studentExists';
import { authGuard } from './guards/auth';
import { Ahorcado } from './components/ahorcado/ahorcado';
import { MayorMenor } from './components/mayormenor/mayormenor';
import { Preguntados } from './components/preguntados/preguntados';
import { Nanograma } from './components/nanograma/nanograma';
import { guestGuard } from './guards/guest';
import { SalaChat } from './components/sala-chat/sala-chat';
import { TablaPuntaje } from './components/tabla-puntaje/tabla-puntaje';

export const routes: Routes = [
    { path:'login', component: Login, canActivate: [guestGuard] },
    
    { path:'signup', component: Signup, canActivate: [guestGuard] },

    { path:'home', component: Home },

    { path:'about', component: About, canActivate: [studentExists] },

    { path:'game', canActivate: [authGuard] , children:[

        { path:'ahorcado', component: Ahorcado },
        
        { path:'mayormenor', component: MayorMenor},

        { path:'preguntados', component: Preguntados},

        {path:'nanograma', component: Nanograma}

    ] },

    { path:'chat', canActivate: [authGuard], component: SalaChat },

    { path:'score', canActivate: [authGuard], component: TablaPuntaje },

    {path:'', redirectTo:'home', pathMatch:'full'},

    { path:'**', redirectTo: '' }
];