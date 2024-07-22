import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: ' Login ' },
  { path: 'app', component: MainpageComponent, title: 'appPage' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
];
