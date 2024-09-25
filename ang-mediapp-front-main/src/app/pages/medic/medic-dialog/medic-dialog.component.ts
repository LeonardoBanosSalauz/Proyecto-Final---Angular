import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Medic } from 'src/app/models/medic';
import { MedicService } from 'src/app/services/medic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  templateUrl: './medic-dialog.component.html',
  styleUrls: ['./medic-dialog.component.css'],
  imports: [MaterialModule, FormsModule, NgIf],
})
export class MedicDialogComponent implements OnInit {
  medic: Medic;

  /* Se declaran las variables asociadas al formulario para realizar la validación de los campos 
    que contienen cadenas de texto. Estas variables se utilizarán para verificar y validar 
    el valor ingresado en cada campo correspondiente, asegurando que los datos cumplan 
    con los requisitos establecidos antes de proceder con el envío del formulario. */

  primaryName: string = '';
  surname: string = '';
  codMedic: string = '';
  photo: string = '';

  constructor(
    // Se inyecta el objeto 'MAT_DIALOG_DATA', que contiene la información del médico (tipo Medic),
    // permitiendo el acceso a los datos pasados al componente de diálogo.
    @Inject(MAT_DIALOG_DATA) private data: Medic, 
    
    // Se inyecta 'MatDialogRef' para controlar el diálogo, incluyendo la posibilidad de cerrarlo
    // desde dentro del componente, facilitando la interacción con la interfaz.
    private _dialogRef: MatDialogRef<MedicDialogComponent>, 
    
    // Se inyecta 'MedicService', un servicio que permite realizar operaciones relacionadas 
    // con el manejo de los datos del médico, como guardar o actualizar información.
    private medicService: MedicService
  ) {}
  
  ngOnInit(): void {
    // Durante la inicialización del componente, se asignan los datos del médico inyectados a la propiedad 'medic',
    // clonando el objeto recibido desde 'data'. Esto permite trabajar con una copia de los datos del médico 
    // en el diálogo sin afectar los datos originales directamente.
    this.medic = { ...this.data };
  }
  

  onSubmit(primaryName: any, surname: any, codMedic: any, photo: any) {
    // Se verifica si todos los campos de entrada son válidos (no tienen errores)
    // utilizando la propiedad 'invalid'. Esto garantiza que se requiere una entrada
    // correcta en cada campo antes de continuar con el procesamiento.
    if (
      !primaryName.invalid &&
      !surname.invalid &&
      !codMedic.invalid &&
      !photo.invalid
    ) {
      // Si todos los campos son válidos, se registra en la consola los datos del médico 
      // que se están guardando, incluyendo el nombre, apellido, código del médico 
      // y la foto. Esto es útil para la depuración y para confirmar que los datos son correctos.
      console.log('Datos del médico:', {
        primaryName: this.primaryName,
        surname: this.surname,
        codMedic: this.codMedic,
        photo: this.photo,
      });
  
      // Se muestra un cuadro de diálogo de confirmación utilizando SweetAlert para indicar 
      // que los datos han sido guardados con éxito. El diseño incluye un icono de éxito 
      // y un botón de confirmación con un color específico.
      Swal.fire({
        title: 'Datos guardados con éxito',
        icon: 'success', 
        confirmButtonColor: '#28a745', 
        confirmButtonText: 'Aceptar', 
      }).then((result) => {
        // Si el usuario confirma la acción (hace clic en "Aceptar"), se recarga la página 
        // para reflejar los cambios realizados, asegurando que el usuario vea la información actualizada.
        if (result.isConfirmed) {
          window.location.reload(); 
        }
      });
    } else {
      // Si alguno de los campos es inválido, se muestra una alerta al usuario indicando 
      // que debe corregir los errores antes de enviar el formulario. Esto mejora la experiencia 
      // del usuario al proporcionar retroalimentación clara sobre la necesidad de corregir 
      // los datos ingresados.
      alert('Por favor, corrige los errores antes de enviar.');
    }
  }
  

  operate() {
    if (this.medic != null && this.medic.idMedic > 0) {
      // UPDATE
      this.medicService
        .update(this.medic.idMedic, this.medic)
        .pipe(switchMap(() => this.medicService.findAll()))
        .subscribe((data) => {
          this.medicService.setmedicChange(data);
          this.medicService.setMessageChange('UPDATED!');
        });
    } else {
      // INSERT
      this.medicService
        .save(this.medic)
        .pipe(switchMap(() => this.medicService.findAll()))
        .subscribe((data) => {
          this.medicService.setmedicChange(data);
          this.medicService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }

  close() {
    this._dialogRef.close();
  }
}
