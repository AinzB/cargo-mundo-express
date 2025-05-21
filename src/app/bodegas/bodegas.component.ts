import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { Bodega } from '../models/bodega.model';
import { BodegaService } from '../services/bodegas.service';

interface BdgLabels {
  [key: string]: string;
}

@Component({
  selector: 'app-bodegas',
  imports: [CommonModule, FormsModule],
  templateUrl: './bodegas.component.html',
  styleUrl: './bodegas.component.scss'
})
export class BodegasComponent implements OnInit {
  nuevaBodegaSeleccionada:HTMLDivElement | null = null;
  mostrarModal:boolean = false;
  lblNewCodeBodega:string = '';
  loading:boolean = false;

  bdgArray: any[] = [
    {
      fila: 1, 
      etiqueta: 'A', 
      datos: [
        {id: 1, etiqueta: 'A',  label: 'A1', value: 'A1', status: 'Disponible', tracking_code: ''}
      ]
    }
  ];

  arryBodegas: Bodega[] = [];

  constructor(private bodegaService: BodegaService ,private alertService: AlertService) {}

  ngOnInit(): void {
    this.loading = true;
    this.obtenerBodegas();
  }

  obtenerBodegas(): void {
    try {
      this.bodegaService.getBodegas().subscribe({
        next: (data) => {
          this.arryBodegas = data;
          console.log(data);
          
        },
        error: (error) => {
          this.alertService.showError('No se encontro ninguna bodega.');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch(error) {
      this.alertService.showError('Error al obtener la lista de bodegas.');
      this.loading = false;
    };

  }

  crearBodega(bodega: Bodega): void {
    this.cerrarModal();

    this.bodegaService.createBodega(bodega).subscribe({
      next: (data) => {
        this.alertService.showSuccess('Bodega creada correctamente.');
        this.obtenerBodegas();
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showError('Error al crear la bodega.');
        console.log('Error al crear la bodega: ', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cerrarModal():void {
    this.mostrarModal = false;
    this.limpiarArrayNuevaBodega();
  }

  abrirModal():void {
    this.mostrarModal = true;
  }

  limpiarArrayNuevaBodega():void {
    this.bdgArray = [
      {
        fila: 1, 
        etiqueta: 'A', 
        datos: [
          {id: 1, etiqueta: 'A',  label: 'A1', value: 'A1', status: 'Disponible', tracking_code: ''}
        ]
      }
    ];

    this.nuevaBodegaSeleccionada = null;
  }

  handleBodegaSeleccionada(event: Event): void {
    const bodega = event.target as HTMLDivElement;
    if (this.nuevaBodegaSeleccionada) {
      this.nuevaBodegaSeleccionada.classList.remove('bodegaSeleccionada');
    }

    if(this.nuevaBodegaSeleccionada !== bodega) {
      this.nuevaBodegaSeleccionada = bodega;
      this.nuevaBodegaSeleccionada.classList.add('bodegaSeleccionada');
    }else {
      this.nuevaBodegaSeleccionada = null;
    }
  }

  handleNewRow(event: Event): void {
    if(this.bdgArray.length >= 5) {
      this.alertService.showError('No se pueden agregar mas de 5 filas.');
      return;
    }

    if( this.nuevaBodegaSeleccionada) {      
      let newBdgArrayAux:any[] = [];
      const bodegaSeleccionadaId: number = Number(this.nuevaBodegaSeleccionada.getAttribute('rowId') ?? 0);
      const bodegaSeleccionadaLabel = this.nuevaBodegaSeleccionada.getAttribute('rowLabel') ?? '';
      let bdgCount = 0;

      this.bdgArray.forEach((row) => {
        if(row.fila < bodegaSeleccionadaId) {          
          newBdgArrayAux.push(row);

          if( row.etiqueta === bodegaSeleccionadaLabel ) {
            bdgCount += row.datos.length;
          }
        }else if(row.fila === bodegaSeleccionadaId) {
          bdgCount += row.datos.length + 1;
          
          newBdgArrayAux.push(row);

          let newRow = {
            fila: row.fila + 1, 
            etiqueta: bodegaSeleccionadaLabel, 
            datos: [
              {id: bdgCount, etiqueta: bodegaSeleccionadaLabel,  label: bodegaSeleccionadaLabel + bdgCount, value: bodegaSeleccionadaLabel + bdgCount, status: 'Disponible', tracking_code:''}
            ]
          };

          newBdgArrayAux.push(newRow);
        }else if(row.fila > bodegaSeleccionadaId) {
          if( row.etiqueta === bodegaSeleccionadaLabel ) {
            row.fila = row.fila + 1;
            row.datos.forEach((item:any) => {
              item.id = ++bdgCount;
              item.label = bodegaSeleccionadaLabel + bdgCount;
              item.value = bodegaSeleccionadaLabel + bdgCount;
            });

            newBdgArrayAux.push(row);
          }else {
            row.fila = row.fila + 1;
            newBdgArrayAux.push(row);
          }
        }
      });

      this.bdgArray = newBdgArrayAux;
      this.nuevaBodegaSeleccionada.classList.remove('bodegaSeleccionada');
      this.nuevaBodegaSeleccionada = null;
    }else {
      let rowLabels: BdgLabels = {'A':'B', 'B':'C', 'C':'D', 'D':'E'};
      const bdgLength = this.bdgArray.length - 1;
      const lastRowLabel = this.bdgArray[bdgLength].etiqueta;
      const newRowLabel = rowLabels[lastRowLabel];

      if(newRowLabel) {
        let newRow = {
          fila: bdgLength + 2, 
          etiqueta: newRowLabel, 
          datos: [
            {id: 1, etiqueta: newRowLabel,  label: newRowLabel + '1', value: newRowLabel + '1', status: 'Disponible', tracking_code:''}
          ]
        };

        this.bdgArray.push(newRow);
      }else {
        this.alertService.showError('Fila no encontrada o límite excedido.');
      }
    }
  }
  
  handleSepararFila(event: Event): void {
    if( !this.nuevaBodegaSeleccionada ) {
      this.alertService.showError('Seleccione una fila para separar.');
      return;
    }

    let newBdgArrayAux:any[] = [];
    const rowLabel = this.nuevaBodegaSeleccionada.getAttribute('rowLabel') ?? '';
    const rowId = Number(this.nuevaBodegaSeleccionada.getAttribute('rowId') ?? 0);
    let bdgCount = 0;
    let flagContinuar = true;

    this.bdgArray.forEach((row) => {
      if(flagContinuar) {
        if(row.fila < rowId) {
          newBdgArrayAux.push(row);

          if( row.etiqueta === rowLabel ) {
            bdgCount += row.datos.length;
          }
        }else if(row.fila === rowId) {
          bdgCount += row.datos.length;

          if( row.datos.length >= 5 ) {
            this.alertService.showError('No se pueden separar filas con mas de 5 elementos.');
            flagContinuar = false;
          }else {
            let rowAux = row;
            let newDataBodega = {id: ++bdgCount, etiqueta: row.etiqueta,  label: row.etiqueta + bdgCount, value: row.etiqueta + bdgCount, status: 'Disponible', tracking_code:''};
            rowAux.datos.push(newDataBodega);
            newBdgArrayAux.push(rowAux);
          }
        } else if(row.fila > rowId) {
          if( row.etiqueta === rowLabel ) {
            let rowAux = row;
            rowAux.datos.forEach((item:any) => {
              item.id = ++bdgCount;
              item.label = rowLabel + bdgCount;
              item.value = rowLabel + bdgCount;
            });

            newBdgArrayAux.push(rowAux);
          }else {
            newBdgArrayAux.push(row);
          }
        }
      }
    });

    if(flagContinuar) {
      this.bdgArray = newBdgArrayAux;
      this.nuevaBodegaSeleccionada.classList.remove('bodegaSeleccionada');
      this.nuevaBodegaSeleccionada = null;
    }
  }

  handleEliminarFila(event: Event): void {
    if( !this.nuevaBodegaSeleccionada ) {
      this.alertService.showError('Seleccione una fila para eliminar.');
      return;
    }

    let newBdgArrayAux:any[] = [];
    const rowLabel = this.nuevaBodegaSeleccionada.getAttribute('rowLabel') ?? '';
    const rowId = Number(this.nuevaBodegaSeleccionada.getAttribute('rowId') ?? 0);
    let bdgCount = 0;
    let flagUniqueFile = false;
    let rowLabels: BdgLabels = {'B':'A', 'C':'B', 'D':'C', 'E':'D'};

    this.bdgArray.forEach((row) => {
      if( row.fila < rowId ) {
        newBdgArrayAux.push(row);

        if( row.etiqueta === rowLabel ) {
          bdgCount += row.datos.length;
        }
      } else if( row.fila === rowId ) {
        if( row.datos.length <= 0 ) {
          this.alertService.showError('No se pueden eliminar filas vacías.');
        } else if ( row.datos.length === 1 ) {
          if( this.bdgArray.length <= 1 ) {
            this.alertService.showError('No se puede crear una bodega vacía.');
            newBdgArrayAux = this.bdgArray;
          } else {
            const totalA = this.bdgArray.reduce((acumulador, fila) => {
              return fila.etiqueta === rowLabel ? acumulador + fila.datos.length : acumulador;
            }, 0);
            
            if( totalA <= 1 ) {
              flagUniqueFile = true;
            }
          }
        }else if ( row.datos.length > 1 ) {
          let rowAux = row;
          rowAux.datos.pop();
          newBdgArrayAux.push(rowAux);
          bdgCount += rowAux.datos.length;
        }
      } else if ( row.fila > rowId ) {
        if( flagUniqueFile ) {
          let rowAux = row;
          const newRowLabel = rowLabels[row.etiqueta] ?? '';
          rowAux.fila = rowAux.fila - 1;
          rowAux.etiqueta = newRowLabel;
          rowAux.datos.forEach((item:any) => {
            item.label = newRowLabel + item.id;
            item.value = newRowLabel + item.id;
          });

          if(newRowLabel != '') {
            newBdgArrayAux.push(rowAux);
          }
        } else {
          if( row.etiqueta === rowLabel ) {
            let rowAux = row;
            rowAux.datos.forEach((item:any) => {
              item.id = ++bdgCount;
              item.label = rowLabel + bdgCount;
              item.value = rowLabel + bdgCount;
            });
  
            newBdgArrayAux.push(rowAux);
          } else {
            newBdgArrayAux.push(row);
          }
        }
      }
    });

    this.bdgArray = newBdgArrayAux;
    this.nuevaBodegaSeleccionada.classList.remove('bodegaSeleccionada');
    this.nuevaBodegaSeleccionada = null;
  }

  handleNewCodeBodegaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.lblNewCodeBodega = input.value;
  }

  submitBodega(): void {
    if(this.lblNewCodeBodega.length <= 0) {
      this.alertService.showError('Ingrese un código para la nueva bodega.');
      return;
    }

    if(this.bdgArray.length <= 0) {
      this.alertService.showError('No se pueden crear bodegas vacías.');
      return;
    }

    this.loading = true;

    let newBodega: Bodega = {
      codigo: this.lblNewCodeBodega,
      dataJson: this.bdgArray,
      active: true
    };

    this.crearBodega(newBodega);
  }

  handleTrackingCodeCopy(event: Event): void {
    const divEl = event.target as HTMLDivElement;
    const trackingCode = divEl.getAttribute('trcode') ?? '';
    const bodegaStatus = divEl.getAttribute('bdstatus') ?? '';

    if(bodegaStatus === 'Ocupado') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(trackingCode)
          .then(() =>  this.alertService.showSuccess('Tracking Code copiado.') )
          .catch(err => this.alertService.showError('Error al copiar el Tracking Code.'));
      }
    }
  }
}