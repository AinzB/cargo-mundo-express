import { Routes } from '@angular/router';
import { EnviosComponent } from './envios/envios.component';
import { BodegasComponent } from './bodegas/bodegas.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [ authGuard ],
    children: [
      { path: 'inicio',    component: InicioComponent },
      { path: 'envios',    component: EnviosComponent },
      { path: 'bodegas',   component: BodegasComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'usuarios',  component: UsuariosComponent },
      { path: 'reportes',  component: ReportesComponent },

      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
