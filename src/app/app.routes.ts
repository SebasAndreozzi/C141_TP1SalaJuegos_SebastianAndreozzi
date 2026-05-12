import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { studentExists } from './guards/studentExists';

export const routes: Routes = [
    { path:'login', component: Login },
    
    { path:'signup', component: Signup },

    { path:'', component: Home },

    { path:'about', component: About, canActivate: [studentExists] },

    { path:'**', redirectTo: '' }
];