import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ClientesComponent } from './pages/crud/clientes/clientes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clientes', component: ClientesComponent }
];
