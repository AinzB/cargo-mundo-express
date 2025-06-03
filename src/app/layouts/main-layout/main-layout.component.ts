import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuarios.service';
import { AlertService } from '../../services/alert.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  title = 'Cargo Mundo Express Inventario';

  ussSess: Usuario = {
    id: 0,
    username: '',
    email: '',
    active: false,
    role: ''
  };

  editUser: any = {
    id: 0,
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  userRole: string = '';

  bootstrapModal: any;
  loading: boolean = false;

  paginas = [
    { nombre: 'Inicio', ruta: '/inicio' },
    { nombre: 'Envios', ruta: '/envios' },
    { nombre: 'Servicios', ruta: '/servicios' },
    { nombre: 'Bodegas', ruta: '/bodegas' },
    { nombre: 'Usuarios', ruta: '/usuarios' },
    { nombre: 'Reportes', ruta: '/reportes' }
  ];

  paginaActual:string = '/inicio';

  constructor(private router: Router, private route: ActivatedRoute, private usuarioService: UsuarioService, private alertService: AlertService) {
    this.router.events.subscribe(() => {
      this.paginaActual = this.router.url;
    });

    try {
      this.usuarioService.getSessionUser().subscribe({
        next: (data) => {
          this.ussSess = data;   
          
          this.userRole = data.role === 'Admin' ? 'Administrador' :
                        data.role === 'Editor' ? 'Editor' :
                        data.role === 'Vista' ? 'Vista' : 'Unknown';
          
          this.editUser.id = data.id;
          this.editUser.username = data.username;
          this.editUser.email = data.email;
        },
        error: (error) => {
          this.alertService.showError('Usuario desconocido.');
          console.log(error);
        },
        complete: () => {
        }
      });
    } catch(error) {
      this.alertService.showError('Error al preparar el resumen.');
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    let modalElement = document.getElementById('editSessionUser');    
    
    if(modalElement) {
      this.bootstrapModal = new bootstrap.Modal(modalElement);

      modalElement.addEventListener('hidden.bs.modal', () => {
      });
    }
  }

  cerrarModal(): void {
    if(this.bootstrapModal) {
      this.bootstrapModal.hide();
      this.editUser.password = '';
      this.editUser.confirmPassword = '';
    }
  }

  abrirModal(): void {
    if(this.bootstrapModal) {
      this.bootstrapModal.show();
    }
  }

  guardarActualizarUsuario(): void {
    this.loading = true;

    if ( 
        (this.editUser.username.trim() === '' || this.editUser.username === this.ussSess.username) && 
        (this.editUser.email.trim() === '' || this.editUser.email === this.ussSess.email) &&
        this.editUser.password.trim() === '' &&
        this.editUser.confirmPassword.trim() === ''
      ) 
    {
      this.alertService.showError('No se detecto ningun cambio.');
      this.loading = false;
      return;
    }

    if ( this.editUser.password !== this.editUser.confirmPassword && this.editUser.password.trim() !== '' ) {
      this.alertService.showError('Las contraseñas no coinciden.');
      this.loading = false;
      return;
    }

    let newEditUser: Usuario = {
      id: this.ussSess.id,
      username: this.ussSess.username,
      email: this.ussSess.email,
    };

    if ( this.editUser.username !== this.ussSess.username ) {
      newEditUser.username = this.editUser.username;
    }

    if ( this.editUser.email !== this.ussSess.email ) {
      newEditUser.email = this.editUser.email;
    }

    if ( this.editUser.password.trim() !== '' && this.editUser.password === this.editUser.confirmPassword ) {
      newEditUser.password = this.editUser.password;
    }

    if ( newEditUser.id === 0 ) {
      this.alertService.showError('No se pudo obtener el ID del usuario.');
      this.loading = false;
      return;
    }

    this.usuarioService.updatePartialUsuario(newEditUser.id ?? 0, newEditUser).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Usuario actualizado correctamente');
        this.ussSess.email = this.editUser.email;
        this.ussSess.username = this.editUser.username;
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showError('Error al actualizar el usuario');
        console.log('Error al actualizar el usuario: ', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.cerrarModal();
        window.location.reload();
      }
    });
  }

  cerrarSesion(): void {
    this.loading = true;

    this.usuarioService.logout().subscribe({
      next: () => {
        this.alertService.showSuccess('Sesión cerrada correctamente.');
        this.loading = false;
        window.location.reload();
      },
      error: (error) => {
        this.alertService.showError('Error al cerrar sesión.');
        console.log('Error al cerrar sesión: ', error);
        this.loading = false;
      }
    });
  }
}
