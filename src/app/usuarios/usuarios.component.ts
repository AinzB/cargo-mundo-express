import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuarios.service';
import { Usuario } from '../models/usuario.model';
import { AlertService } from '../services/alert.service';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosAux: Usuario[] = [];

  user: Usuario = {
    id: 0,
    username: '',
    email: '',
    role: '',
    genre: '',
    activo: true
  };

  aux: number = 0;
  searchFilter: string = '';

  inputIds = {
    'userName' : 'username',
    'userEmail' : 'email',
    'userRole' : 'role',
    'userGenre' : 'genre'
  };

  filtroStatus:any[] = [
    {name: 'Todos', value: true, active:true},
    {name: 'Activos', value: true, active:false},
    {name: 'Inactivos', value: false, active:false}
  ];
  
  loading: boolean = false;
  onUpdate: boolean = false;

  bootstrapModal: any;

  constructor(private usuariosService: UsuarioService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.loading = true;
    this.obtenerUsuarios();
    this.cargarEventos();
  }

  cargarEventos(): void {
    let modalElement = document.getElementById('addNewUser');    
    
    if(modalElement) {
      this.bootstrapModal = new bootstrap.Modal(modalElement);

      modalElement.addEventListener('hidden.bs.modal', () => {
      });
    }
  }

  obtenerUsuarios(): void {
    this.searchFilter = '';

    try {
      this.usuariosService.getUsuarios().subscribe({
        next: (data) => {
          this.usuarios = data;
          this.usuariosAux = data;
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun usuario.');
          console.log(error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de usuarios');
      this.loading = false;
    };

  }

  verUsuario(id: number): void {
    this.usuariosService.getUsuario(id).subscribe({
      next: (data) => {
        let usr = data; 

        this.user.id = usr?.id || 0;
        this.user.username = usr?.username || '';
        this.user.email = usr?.email || '';
        this.user.role = usr?.role || '';
        this.user.genre = usr?.genre || '';
        this.onUpdate = true;

        this.cargarUsuario();
      },
      error: (error) => {
        this.alertService.showError('Error al cargar el usuario.');
      },
      complete: () => {
      }
    });
  }

  eliminarUsuario(id: number): void {
    this.loading = true;

    this.usuariosService.inactivateUsuario(id).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Usuario inactivado correctamente');
        let filtroLabel = 'Todos';

        this.filtroStatus.forEach((item) => {
          filtroLabel = item.active ? item.name : filtroLabel;
        });

        if(filtroLabel === 'Todos') {
          this.obtenerUsuarios();
        } else if (filtroLabel === 'Activos') {
          this.filtrarUsuarioPorActivo(true);
        } else {
          this.filtrarUsuarioPorActivo(false);
        }
      },
      error: (error) => {
        this.alertService.showError('Error al inactivar el usuario');
        console.log('Error al inactivar el usuario: ', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  activarUsuario(id: number): void {
    this.loading = true;

    this.usuariosService.activarUsuario(id).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Usuario activado correctamente');

        let filtroLabel = 'Todos';

        this.filtroStatus.forEach((item) => {
          filtroLabel = item.active ? item.name : filtroLabel;
        });

        if(filtroLabel === 'Todos') {
          this.obtenerUsuarios();
        } else if (filtroLabel === 'Activos') {
          this.filtrarUsuarioPorActivo(true);
        } else {
          this.filtrarUsuarioPorActivo(false);
        }
      },
      error: (error) => {
        this.alertService.showError('Error al activar el usuario');
        console.log('Error al activar el usuario: ', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  crearUsuario(usuario: Usuario): void {
    this.usuariosService.createUsuario(usuario).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Usuario creado correctamente');
        this.obtenerUsuarios();
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showError('Error al crear el usuario');
        console.log('Error al crear el usuario: ', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.limpiarObjetoUser();
      }
    });
  }

  actualizarUsuario(usuario: Usuario): void {
    let usId = usuario.id || 0;

    if(usId > 0) {
      this.usuariosService.updatePartialUsuario(usId, usuario).subscribe({
        next: (data) => {
          this.alertService.showSuccess('Usuario actualizado correctamente');
          this.obtenerUsuarios();
          this.loading = false;
          this.limpiarObjetoUser();
          this.onUpdate = false;
        },
        error: (error) => {
          this.alertService.showError('Error al actualizar el usuario');
          console.log('Error al actualizar el usuario: ', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.limpiarObjetoUser();
          this.onUpdate = false;
        }
      });
    }
  }

  submitUser(): void {
    this.loading = true;

    if(this.llenarUsuario()) {
      this.cerrarModal();

      if(this.onUpdate) {
        this.actualizarUsuario(this.user);
      } else {
        this.crearUsuario(this.user);
      }
    }else {
      this.alertService.showError('Tienes campos por llenar.');
      this.loading = false;
    }
  }

  llenarUsuario(): boolean {
    let flag = true;

    Object.keys(this.inputIds).forEach((id) => {
      let element = document.getElementById(id) as HTMLInputElement | null;
      let idAux = id as keyof typeof this.inputIds;

      if(element) {
        if(!element?.value) {
          element?.classList.add('is-invalid');
          flag = false;
        } else {
          element?.classList.remove('is-invalid');
          this.user[this.inputIds[idAux]] = element?.value || '';
        }
      }
    });

    return flag;
  }

  cerrarModal(): void {
    if(this.bootstrapModal) {
      this.limpiarCampos();
      this.bootstrapModal.hide();
    }
  }

  abrirModal(): void {
    if(this.bootstrapModal) {
      this.bootstrapModal.show();
    }
  }

  limpiarCampos(): void { 
    Object.keys(this.inputIds).forEach((id) => {
      let element = document.getElementById(id) as HTMLInputElement | null;

      if(element) {
        element.value = '';
        element.classList.remove('is-invalid');
      }
    });
  }

  limpiarObjetoUser(): void {
    this.user = {
      id: 0,
      username: '',
      email: '',
      role: '',
      genre: ''
    };
  }

  cargarUsuario(): void {    
    Object.keys(this.inputIds).forEach((id) => {
      let element = document.getElementById(id) as HTMLInputElement | null;
      let idAux = id as keyof typeof this.inputIds;

      if(element) {
        element.value = this.user[this.inputIds[idAux]]?.toString() || '';
      }
    });

    this.abrirModal();
  }

  visualizarUsuario(event: Event): void {
    let target = event.target as HTMLButtonElement;
    let id = target.getAttribute('userid') ?? 0;
    this.verUsuario(Number(id));
  }

  inactvidarUsuario(event: Event): void {
    let target = event.target as HTMLButtonElement;
    let id = target.getAttribute('userid') ?? 0;
    this.eliminarUsuario(Number(id));
  }

  handleActivarUsuario(event: Event): void {
    let target = event.target as HTMLButtonElement;
    let id = target.getAttribute('userid') ?? 0;
    this.activarUsuario(Number(id));
  }

  handleSearchFilter(event: Event): void {
    let target = event.target as HTMLInputElement;
    let value = target.value.toLowerCase();

    this.usuarios = this.usuariosAux.filter((usuario) => {
      return usuario.username.toLowerCase().includes(value);
    });
  }

  handleFiltroPorActivo(event: Event): void {
    this.loading = true;

    const ele = event.target as HTMLInputElement;
    const name = ele.name ?? 'Todos';
    const value = ele.value == 'true' ? true:false;

    this.filtroStatus.forEach((item) => {
      item.active = item.name === name;
    });

    if(name === 'Todos') {
      this.obtenerUsuarios();
      return;
    }    

    this.filtrarUsuarioPorActivo(value);
  }

  filtrarUsuarioPorActivo(status:boolean): void {
    try {
      this.usuariosService.getUsuariosPorActive(status).subscribe({
        next: (data) => {                   
          this.usuarios = data;
          this.usuariosAux = data;
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun usuario.');
          this.loading = false;
          this.usuarios = [];
          this.usuariosAux = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de usuarios');
      this.loading = false;
    };
  }
}
