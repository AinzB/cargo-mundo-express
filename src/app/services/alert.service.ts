import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class AlertService { 
    showError(message: string): void {
        // Crear el contenedor principal del mensaje
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('mensajeAlerta', 'mensajeError'); // Agregar clases al contenedor

        // Crear el ícono de alerta (img)
        const alertImg = document.createElement('img');
        alertImg.src = 'error.svg'; // Ruta de la imagen
        alertImg.alt = 'Icono de alerta'; // Texto alternativo

        // Crear el mensaje dinámico (p)
        const alertMessage = document.createElement('p');
        alertMessage.textContent = message; // Asignar el texto dinámico

        // Agregar los elementos al contenedor
        alertDiv.appendChild(alertImg);
        alertDiv.appendChild(alertMessage);

        if(document.body) {
            document.body.appendChild(alertDiv); // Agregar el contenedor al body

            setTimeout(() => {
                alertDiv.remove(); // Remover el contenedor después de 4 segundos
            }, 3000);
        }
    }

    showSuccess(message: string): void {
        // Crear el contenedor principal del mensaje
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('mensajeAlerta', 'mensajeSuccess'); // Agregar clases al contenedor

        // Crear el ícono de alerta (img)
        const alertImg = document.createElement('img');
        alertImg.src = 'success.svg'; // Ruta de la imagen
        alertImg.alt = 'Icono de alerta'; // Texto alternativo

        // Crear el mensaje dinámico (p)
        const alertMessage = document.createElement('p');
        alertMessage.textContent = message; // Asignar el texto dinámico

        // Agregar los elementos al contenedor
        alertDiv.appendChild(alertImg);
        alertDiv.appendChild(alertMessage);

        if(document.body) {
            document.body.appendChild(alertDiv); // Agregar el contenedor al body

            setTimeout(() => {
                alertDiv.remove(); // Remover el contenedor después de 4 segundos
            }, 3000);
        }
    }
}