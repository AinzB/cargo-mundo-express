import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../models/servicios.model';
import { ServicioService } from '../services/servicios.service';
import { AlertService } from '../services/alert.service';
import { BodegaService } from '../services/bodegas.service';
import { Bodega } from '../models/bodega.model';
import { Envio } from '../models/envio.model';
import { Envioservice } from '../services/envios.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  arrServicios:Servicio[] = [];
  arrBodegas:Bodega[] = [];
  arrEnvios:Envio[] = [];

  resumenEnvio:any = {
    en_bodega_nicaragua: 0,
    en_bodegas_usa: 0,
    en_delivery: 0,
    envio_mas_frecuente: '',
    envios_en_transito: 0,
    envios_totales: 0,
    listos_para_retirar: 0,
    peso_promedio: 0.0,
    servicio_mas_frecuente: {
      name: ''
    }
  };

  loading:boolean = false;

  constructor(private envioService:Envioservice, private alertService: AlertService) {}


  ngOnInit(): void {
    this.loading = true;
    this.prepararResumen('Semanal');
    this.obtenerEnvios();
  }

  obtenerEnvios(): void {
    try {
      this.envioService.getEnvios().subscribe({
        next: (data) => {
          this.arrEnvios = data;
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

  handleChangePeriod(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value ?? '';
    
    this.loading = true;

    this.prepararResumen(selectedValue);
  }

  prepararResumen(period:string) {
    let periodo = period.toLocaleLowerCase();    

    try {
      this.envioService.getResumenEnvio(periodo).subscribe({
        next: (data) => {
          this.resumenEnvio = data;          
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
      this.alertService.showError('Error al preparar el resumen.');
      this.loading = false;
    }
  }
}
