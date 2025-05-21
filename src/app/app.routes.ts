import { Routes } from '@angular/router';
import { EnviosComponent } from './envios/envios.component';
import { BodegasComponent } from './bodegas/bodegas.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent },
    { path: 'envios', component: EnviosComponent },
    { path: 'bodegas', component: BodegasComponent },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'reportes', component: ReportesComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];
