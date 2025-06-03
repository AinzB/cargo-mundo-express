import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../services/servicios.service';
import { Servicio } from '../models/servicios.model';
import { AlertService } from '../services/alert.service';

declare var bootstrap: any;

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  
  servicio: Servicio = {
    id: 0,
    name: '',
    description: '',
    transporte: '',
    duracion: '',
    priceperlb: 0,
    extraprice: 0,
    active: true
  };

  aux: number = 0;

  inputIds = {
    'servicioName' : 'name',
    'servicioDescription' : 'description',
    'servicioTransporte' : 'transporte',
    'servicioDuracion' : 'duracion',
    'servicioPriceperlb' : 'priceperlb',
    'servicioExtraprice' : 'extraprice'
  };
  
  loading: boolean = false;
  onUpdate: boolean = false;

  filtroStatus:any[] = [
    {name: 'Todos', value: 'Todos', active:true},
    {name: 'Aereo', value: 'Aereo', active:false},
    {name: 'Maritimo', value: 'Maritimo', active:false},
  ];

  bootstrapModal: any;

  constructor(private servicioService: ServicioService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.loading = true;
    this.obtenerServicios();
    this.cargarEventos();
  }

  cargarEventos(): void {
    let modalElement = document.getElementById('addNewServicio');    
    
    if(modalElement) {
      this.bootstrapModal = new bootstrap.Modal(modalElement);

      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('El modal se cerró correctamente.');
      });
    }
  }

  obtenerServicios(): void {
    try {
      this.servicioService.getServicios().subscribe({
        next: (data) => {
          this.servicios = data;
          console.log(data);
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun servicio.');
          console.log(error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de servicios');
      this.loading = false;
    };

  }

  verServicio(id: number): void {
    this.servicioService.getServicio(id).subscribe({
      next: (data) => {
        let usr = data; 

        this.servicio.id = usr?.id || 0;
        this.servicio.name = usr?.name || '';
        this.servicio.description = usr?.description || '';
        this.servicio.transporte = usr?.transporte || '';
        this.servicio.duracion = usr?.duracion || '';
        this.servicio.priceperlb = usr?.priceperlb || 0;
        this.servicio.extraprice = usr?.extraprice || 0;
        this.servicio.active = usr?.active || true;
        this.onUpdate = true;

        this.cargarServicio();
      },
      error: (error) => {
        this.alertService.showError('Error al cargar el servicio.');
      },
      complete: () => {
        console.log('Leo usuario: ' + this.servicio.name);
      }
    });
  }

  crearServicio(servicio: Servicio): void {
    this.servicioService.createServicio(servicio).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Servicio creado correctamente');
        this.obtenerServicios();
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showError('Error al crear el servicio');
        console.log('Error al crear el servicio: ', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.limpiarObjetoServicio();
      }
    });
  }

  actualizarServicio(servicio: Servicio): void {
    let servId = servicio.id || 0;

    if(servId > 0) {
      this.servicioService.updatePartialSerivicio(servId, servicio).subscribe({
        next: (data) => {
          this.alertService.showSuccess('Servicio actualizado correctamente');
          this.obtenerServicios();
          this.loading = false;
          this.limpiarObjetoServicio();
          this.onUpdate = false;
        },
        error: (error) => {
          this.alertService.showError('Error al actualizar el servicio');
          console.log('Error al actualizar el servicio: ', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.limpiarObjetoServicio();
          this.onUpdate = false;
        }
      });
    }
  }

  submitServicio(): void {
    this.loading = true;

    if(this.llenarServicio()) {
      this.cerrarModal();

      if(this.onUpdate) {
        this.actualizarServicio(this.servicio);
      } else {
        this.crearServicio(this.servicio);
      }
    }else {
      this.alertService.showError('Tienes campos por llenar.');
      this.loading = false;
    }
  }

  llenarServicio(): boolean {
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
          this.servicio[this.inputIds[idAux]] = element?.value || '';
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

  limpiarObjetoServicio(): void {
    this.servicio = {
      id: 0,
      name: '',
      description: '',
      transporte: '',
      duracion: '',
      priceperlb: 0,
      extraprice: 0
    };
  }

  cargarServicio(): void {    
    Object.keys(this.inputIds).forEach((id) => {
      console.log(id);
      
      let element = document.getElementById(id) as HTMLInputElement | null;
      let idAux = id as keyof typeof this.inputIds;

      if(element) {
        console.log(this.servicio[this.inputIds[idAux]]?.toString());
        
        element.value = this.servicio[this.inputIds[idAux]]?.toString() || '';
      }
    });

    this.abrirModal();
  }

  visualizarServicio(event: Event): void {
    let target = event.target as HTMLButtonElement;
    let id = target.getAttribute('servId') ?? 0;
    this.verServicio(Number(id));
  }

  filtrarEnvios(event:Event): void {
    this.loading = true;

    const inputEl = event?.target as HTMLInputElement;
    const inputName = inputEl.name ?? '';

    this.filtroStatus.forEach((item) => {
      item.active = item.name === inputName;
    });

    if( inputName === 'Todos' ) {
      this.obtenerServicios();
      return;
    }

    try {
      this.servicioService.getServicioFiltrado(inputName).subscribe({
        next: (data) => {
          this.servicios = data;
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun servicio.');
          this.loading = false;
          this.servicios = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de servicios.');
      this.loading = false;
    };
  }
}
