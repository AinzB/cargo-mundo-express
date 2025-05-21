import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cargo Mundo Express Inventario';

  paginas = [
    { nombre: 'Inicio', ruta: '/inicio' },
    { nombre: 'Envios', ruta: '/envios' },
    { nombre: 'Servicios', ruta: '/servicios' },
    { nombre: 'Bodegas', ruta: '/bodegas' },
    { nombre: 'Usuarios', ruta: '/usuarios' },
    { nombre: 'Reportes', ruta: '/reportes' }
  ];

  paginaActual:string = '/inicio';

  constructor(private router: Router, private route: ActivatedRoute){
    this.router.events.subscribe(() => {
      this.paginaActual = this.router.url;
    });
  }
}
