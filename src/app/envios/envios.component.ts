import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../models/servicios.model';
import { ServicioService } from '../services/servicios.service';
import { AlertService } from '../services/alert.service';
import { BodegaService } from '../services/bodegas.service';
import { Bodega } from '../models/bodega.model';
import { Envio } from '../models/envio.model';
import { Envioservice } from '../services/envios.service';
import { TicketService } from '../services/tickets.service';

@Component({
  selector: 'app-envios',
  imports: [CommonModule],
  templateUrl: './envios.component.html',
  styleUrl: './envios.component.scss'
})
export class EnviosComponent implements OnInit {

  arrServicios:Servicio[] = [];
  arrBodegas:Bodega[] = [];
  arrBodegasAux:Bodega[] = [];
  arrEnvios:Envio[] = [];
  arrEnviosAux:Envio[] = [];

  selectedBodega:Bodega = {
    id:0,
    codigo: '',
    dataJson: [],
    active: false
  };

  selectedServicio:Servicio = {
    id: 0,
    name: '',
    description: '',
    transporte: '',
    duracion: '',
    priceperlb: 0.00,
    extraprice: 0.00,
    active: false
  };

  envio:Envio = {
    id: 0,
    tracking_id: '',
    descripcion: '',
    servicio: {
      name: '',
      description: ''
    },
    status: 'Recibido',
    bodega: {
      codigo: '',
      dataJson: []
    },
    bodega_etiqueta: '',
    peso: 0,
    nombre_remitente: '',
    email_remitente: '',
    numero_remitente: '',
    nombre_receptor: '',
    email_receptor: '',
    numero_receptor: '',
    entrega: 'oficina',
    departamento: 'Managua',
    direccion: ''
  };

  ticketBuilder:any = {
    'remitente': '',
    'destinatario': '',
    'consolidado': '',
    'origen': '',
    'destino': '',
    'fecha': '2025-01-01',
    'transporte': '',
    'agencia': '',
    'cantidad': 0,
    'peso': 0,
    'codigoproducto': '',
    'weight': 0.00,
    'vweight': 0.00,
    'dimensiones': '0.00 x 0.00 x 0.00',
    'descripcion': '',
    'interncode': ''
  };

  bodegaValidada:string = '';
  prevBodegaValidada:string = '';
  loading:boolean = false;
  mostrarModal:boolean = false;
  mostrarDepartamento:boolean = false;
  onUpdate:boolean = false;

  mostrarModalTickets:boolean = false;
  modalTicketSeleccion:boolean = false;
  modalTicketCaptura:boolean = false;
  modalTicketSegundaCaptura:boolean = false;


  filtroStatus:any[] = [
    {name: 'Todos', value: 'Todos', active:true},
    {name: 'bodegaUSA', value: 'Bodega USA', active:false},
    {name: 'bodegaNicaragua', value: 'Bodega Nic.', active:false},
    {name: 'Recibido', value: 'Recibido', active:false},
    //{name: 'EnCamino', value: 'En Camino', active:false},
    //{name: 'Delivery', value: 'Delivery Enviado', active:false},
    {name: 'Entregado', value: 'Entregado', active:false},
    //{name: 'Retrasado', value: 'Retrasado', active:false}
  ];

  constructor(private envioService:Envioservice, private ticketService:TicketService, private servicioService: ServicioService, private bodegasService:BodegaService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.loading = true;
    this.obtenerServicios();
    this.obtenerBodegas();
    this.obtenerEnvios();
    this.obtenerFechaHoy();
  }

  obtenerFechaHoy(): void {
    const hoy = new Date();
    // Formatea como "YYYY-MM-DD"
    const yyyy = hoy.getFullYear();
    const mm   = String(hoy.getMonth() + 1).padStart(2, '0');  // meses 0–11
    const dd   = String(hoy.getDate()).padStart(2, '0');
    this.ticketBuilder.fecha = `${yyyy}-${mm}-${dd}`;
  }

  obtenerEnvios(): void {
    try {
      this.envioService.getEnvios().subscribe({
        next: (data) => {
          this.arrEnvios = data;
          this.arrEnviosAux = data;
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun servicio.');
          this.loading = false;
          console.log(error);
          
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de envios.');
      this.loading = false;
    };
  }

  obtenerServicios(): void {
    try {
      this.servicioService.getActiveServices().subscribe({
        next: (data) => {
          this.arrServicios = data;
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun servicio.');
        },
        complete: () => {
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de servicios.');
    };
  }

  obtenerBodegas(): void {
    try {
      this.bodegasService.getBodegasActivas().subscribe({
        next: (data) => {
          this.arrBodegas = data;
          this.arrBodegasAux = data;
          this.selectedBodega = data[0];
          console.log(this.selectedBodega);
          
        },
        error: (error) => {
          this.alertService.showError('No se encontro ninguna bodega.');
        },
        complete: () => {
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de bodegas.');
    };
  }

  cerrarModal():void {
    this.mostrarModal = false;
  }

  abrirModal():void {
    this.mostrarModal = true;
  }

  handleChangeBodega(event: Event): void {
    this.limpiarSelectedBodega();
    
    const newSelectBodega = event?.target as HTMLSelectElement;

    if(newSelectBodega) {
      const bodegaCode = newSelectBodega.value;
      const searchBodega = this.arrBodegas.filter((item) => item.codigo === bodegaCode);

      if ( searchBodega.length > 0 ) {
        this.selectedBodega = searchBodega[0];
      }
    }
  }

  limpiarSelectedBodega(): void {
    this.prevBodegaValidada = '';
    this.bodegaValidada = '';
    this.selectedBodega.dataJson.forEach((row) => {
      if( row.etiqueta === this.envio.bodega_etiqueta?.charAt(0) ) {
        row.datos.forEach((item) => {
          if(item.value === this.envio.bodega_etiqueta) {
            item.status = 'Disponible';
          }
        });
      }
    });
  }

  assignBodegaByCode(codigo: string) {
    if( codigo.length > 0 ) {
      const searchBodega = this.arrBodegas.filter((item) => item.codigo === codigo);

      if ( searchBodega.length > 0 ) {
        this.selectedBodega = searchBodega[0];
      }
    }
  }

  handleSelectedBodega(event: Event): void {
    const selectBodegaLabel = event?.target as HTMLDivElement;
    const labelBdg = selectBodegaLabel.getAttribute('bdgvalue') ?? '';
    const rowLabel = selectBodegaLabel.getAttribute('bdgrowlabel')?? '';

    if( labelBdg !== '' ) {      
      if ( this.selectedBodega.active ) {        
        this.selectedBodega.dataJson.forEach((row) => {            
          if( row.etiqueta === rowLabel ) { 
            row.datos.forEach((item) => {
              if ( item.status === 'Ocupado' && item.value !== this.bodegaValidada && item.value === labelBdg ) {
                this.alertService.showError('Este espacio ya esta siendo ocupado.');
              } else if( item.status !== 'ocupado' && item.value !== this.bodegaValidada && item.value === labelBdg ) {
                this.prevBodegaValidada = this.bodegaValidada != '' ? this.bodegaValidada : '';
                this.bodegaValidada = item.value;
                item.status = 'Ocupado';
                
                this.envio.bodega_etiqueta = this.bodegaValidada;
                this.envio.bodega = this.selectedBodega;
              }
            });
          }
        });

        if(this.prevBodegaValidada !== ''){          
          this.selectedBodega.dataJson.forEach((row) => {            
            if( row.etiqueta === this.prevBodegaValidada.charAt(0) ) {               
              row.datos.forEach((item) => {                
                if( item.status === 'Ocupado' && item.value === this.prevBodegaValidada ) {
                  item.status = 'Disponible';
                  this.prevBodegaValidada = '';
                }
              });
            }
          });
        }
      } else {
        this.alertService.showError('No se ha seleccionado ninguna bodega.');
      }
    } else {
      this.alertService.showError('No se ha detectado ninguna etiqueta.');
    }
  }

  handleSelectedServicio(event: Event): void {
    const serviceRow = event?.currentTarget as HTMLTableRowElement;
    const serviceId = serviceRow.getAttribute('srvid') ?? '';    

    if( serviceId != '' ) {
      try {
        const searchService = this.arrServicios.filter((item) => item.id === Number(serviceId));

        if( searchService.length > 0 ) {
          this.selectedServicio = searchService[0];
          this.envio.servicio = this.selectedServicio;
        } else {
          this.alertService.showError('No se ha encontrado el servicio.');
        }
      } catch(error) {
        this.alertService.showError('Error al seleccionar el servicio.');
      }
    } else {
      this.alertService.showError('No se ha encontrado el servicio.');
    }
  }

  handleInputChange(event: Event): void {
    const inputEl = event?.target as HTMLInputElement;
    const inputValue = inputEl.value ?? '';
    const inputName = inputEl.name ?? '';

    if( inputName in this.envio ) {
      this.envio[inputName] = inputValue;
      
    } else {
      this.alertService.showError('No se encontro el atributo del envio.');
    }
  }

  handleInputTicketChange(event: Event): void {
    const inputEl = event?.target as HTMLInputElement;
    const inputValue = inputEl.value ?? '';
    const inputName = inputEl.name ?? '';

    if( inputName in this.ticketBuilder ) {
      this.ticketBuilder[inputName] = inputValue;
    } else {
      this.alertService.showError('No se encontro el atributo del ticket.');
    }
  }

  handleEntregaChange(event: Event): void {
    const entrega = event?.target as HTMLSelectElement;
    const entregalabel = entrega.value;

    if(entregalabel.length > 0) {
      this.mostrarDepartamento = entregalabel === 'delivery_nicaragua';
    }
  }

  submitEnvio(): void {
    this.loading = true;

    if ( this.envio.tracking_id != '' && this.envio.servicio?.name != '' && this.envio.bodega_etiqueta != '' ) {
      if( this.onUpdate ) {
        this.actualizarEnvio();
      } else {
        this.crearEnvio();
      }
    } else {
      this.alertService.showError('Por favor complete todos los campos requeridos.');
      this.loading = false;
    }
  }

  submitTicket(): void {
    this.loading = true;

    let validarPrimero = this.ticketBuilder.transporte != '' && this.ticketBuilder.fecha != '' && this.ticketBuilder.codigoproducto != '' 
      && this.ticketBuilder.destino != '' && this.ticketBuilder.descripcion != '' && this.ticketBuilder.interncode != '';

    let validarSegundo = this.ticketBuilder.remitente != '' 
      && this.ticketBuilder.destinatario != '' 
      && this.ticketBuilder.consolidado != '' 
      && this.ticketBuilder.origen != '' 
      && this.ticketBuilder.destino != '' 
      && this.ticketBuilder.fecha != '' 
      && this.ticketBuilder.transporte != '' 
      && this.ticketBuilder.agencia != '' 
      && this.ticketBuilder.cantidad != 0 
      && this.ticketBuilder.peso != 0;

    if( this.modalTicketCaptura ) {
      if ( validarPrimero ) {
        this.ticketService.getTicketPdf(this.ticketBuilder).subscribe({
          next: (data) => {
            if (data != null ) {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url, '_blank');
            } else {
              this.alertService.showError('No se ha podido generar el ticket.');
            }
          },
          error: (error) => {
            this.alertService.showError('Error al obtener el ticket.');
            console.log(error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.alertService.showError('Faltan datos por completar.');
        this.loading = false;
      }
    } else if( this.modalTicketSegundaCaptura ) {
      if( validarSegundo ) {
        this.ticketService.getSegundoTicketPDF(this.ticketBuilder).subscribe({
          next: (data) => {
            if (data != null ) {
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              window.open(url, '_blank');
            } else {
              this.alertService.showError('No se ha podido generar el ticket.');
            }
          },
          error: (error) => {
            this.alertService.showError('Error al obtener el ticket.');
            console.log(error);
            this.loading = false;
            
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.alertService.showError('Faltan datos por completar.');
        this.loading = false;
      }
    }
  }

  crearEnvio(): void {
    this.cerrarModal();

    this.envioService.createEnvio(this.envio).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Servicio creado correctamente.');
        this.limpiarEnvio();
        this.obtenerEnvios();
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showError('Error al crear el envio.');
        this.loading = false;
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  actualizarEnvio(): void {
    this.onUpdate = false;
    this.cerrarModal();

    this.envioService.updatePartialEnvio(this.envio.id ?? 0, this.envio).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Servicio actualizado correctamente.');
        this.obtenerEnvios();
        this.loading = false;
        this.limpiarEnvio();
      },
      error: (error) => {
        this.alertService.showError('Error al crear el envio.');
        this.loading = false;
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filtrarEnvios(event:Event): void {
    this.loading = true;

    const inputEl = event?.target as HTMLInputElement;
    const inputName = inputEl.name ?? '';

    this.filtroStatus.forEach((item) => {
      item.active = item.name === inputName;
    });

    if( inputName === 'Todos' ) {
      this.obtenerEnvios();
      return;
    }

    try {
      this.envioService.getEnvioFiltrado(inputName).subscribe({
        next: (data) => {
          this.arrEnvios = data;
          this.arrEnviosAux = data;
        },
        error: (error) => {
          this.alertService.showError('No se encontro ningun servicio.');
          this.loading = false;
          this.arrEnvios = [];
          this.arrEnviosAux = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de envios.');
      this.loading = false;
    };
  }

  limpiarEnvio(): void {
    this.envio = {
      id: 0,
      tracking_id: '',
      descripcion: '',
      servicio: {
        name: '',
        description: ''
      },
      status: 'Recibido',
      bodega: {
        codigo: '',
        dataJson: []
      },
      bodega_etiqueta: '',
      peso: 0,
      nombre_remitente: '',
      email_remitente: '',
      numero_remitente: '',
      nombre_receptor: '',
      email_receptor: '',
      numero_receptor: '',
      entrega: '',
      departamento: '',
      direccion: ''
    };

    this.bodegaValidada = '';
    this.prevBodegaValidada = '';

    this.selectedBodega = {
      id:0,
      codigo: '',
      dataJson: [],
      active: false
    };
  
    this.selectedServicio = {
      id: 0,
      name: '',
      description: '',
      transporte: '',
      duracion: '',
      priceperlb: 0.00,
      extraprice: 0.00,
      active: false
    };
  }

  abrirEnvioUpdate(event:Event): void {
    const el = event?.currentTarget as HTMLElement;
    const envioId = el.getAttribute('envioid') ?? '';

    const searchEnvio = this.arrEnvios.filter((item) => item.id === Number(envioId));

    if ( searchEnvio.length > 0 ) {
      this.onUpdate = true;

      this.envio = searchEnvio[0];
      this.bodegaValidada = this.envio.bodega_etiqueta ?? '';
      this.prevBodegaValidada = '';
      this.selectedBodega = this.envio.bodega;
      this.selectedServicio = this.envio.servicio;
      this.mostrarModal = true;
      this.mostrarDepartamento = this.envio.entrega === 'delivery_nicaragua' ? true : false;
    } else {
      this.alertService.showError('No se ha encontrado el envio.');
    }
  }

  abrirEnvioTicket(event:Event): void {
    this.loading = true;
    const el = event?.currentTarget as HTMLElement;
    const envioId = el.getAttribute('envioId') ?? 0;

    if( envioId != 0 ) {
      const searchEnvio = this.arrEnvios.filter((item) => item.id === Number(envioId));

      if( searchEnvio.length > 0 ) {
        const envioNumId = searchEnvio[0].id;

        this.ticketService.getTicketPdf(envioNumId ?? 0).subscribe({
          next: (data) => {
            
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          },
          error: (error) => {
            this.alertService.showError('Error al obtener el ticket.');
            console.log(error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.alertService.showError('No se ha encontrado el envio.');
        this.loading = false;
      }
    } else {
      this.alertService.showError('No se ha encontrado el envio.');
      this.loading = false;
    }

    this.loading = false;
  }

  abrirModalTicketSeleccion(): void {
    this.mostrarModalTickets = true;
    this.modalTicketCaptura = false;
    this.modalTicketSegundaCaptura = false;
    this.modalTicketSeleccion = true;
  }

  cerrarModalTicketSeleccion(): void {
    this.mostrarModalTickets = false;
    this.modalTicketCaptura = false;
    this.modalTicketSegundaCaptura = false;
    this.modalTicketSeleccion = false;
  }

  abrirModalTicketCaptura(): void {
    this.mostrarModalTickets = true;
    this.modalTicketCaptura = true;
    this.modalTicketSeleccion = false;
    this.modalTicketSegundaCaptura = false;
  }

  abrirModalTicketSegundaCaptura(): void {
    this.mostrarModalTickets = true;
    this.modalTicketCaptura = false;
    this.modalTicketSeleccion = false;
    this.modalTicketSegundaCaptura = true;
  }

  generarTicketPrimeraSeleccion(): void {

  }

  handleSearchFilter(event: Event): void {
    let target = event.target as HTMLInputElement;
    let value = target.value.toLowerCase();

    this.arrEnvios = this.arrEnviosAux.filter((envio) => {
      return envio.tracking_id.toLowerCase().includes(value);
    });
  }

  handleStatusChange(event: Event): void {
    this.loading = true;

    let target = event.target as HTMLSelectElement;
    let value = target.value;

    const envioId = target.getAttribute('envioId') ?? '';

    let envioAux:Envio = this.arrEnvios.filter((item) => item.id === Number(envioId))[0];

    if( envioAux && envioAux.bodega_etiqueta != '' && envioAux.id != 0 ) {
      envioAux.status = value;

      this.envioService.updatePartialEnvio(envioAux.id ?? 0, envioAux).subscribe({
        next: (data) => {
          this.alertService.showSuccess('Status actualizado correctamente.');
          this.obtenerEnvios();
          this.loading = false;
        },
        error: (error) => {
          this.alertService.showError('Error al actualizar el status.');
          console.log(error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}