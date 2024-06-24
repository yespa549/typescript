import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Persona } from '../../interfaces/persona';
import { PersonaService } from '../../services/persona.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-editar-persona',
  templateUrl: './agregar-editar-persona.component.html',
  styleUrl: './agregar-editar-persona.component.css'
})

export class AgregarEditarPersonaComponent implements OnInit {
  tipoDocumento: string[] = ['Cedula','Tarjeta de Identidad','Pasaporte' ];
  form: FormGroup;
  maxDate: Date;
  loading: boolean = false; //solo lo va a mostrar cuando sea verdadero el spinner
  operacion: string = 'Agregar'; //
  id: number | undefined; //



  constructor(public dialogRef: MatDialogRef<AgregarEditarPersonaComponent>,
    private fb: FormBuilder, private _personaService: PersonaService,private _snackBar: MatSnackBar, private router: Router,
     @Inject(MAT_DIALOG_DATA) public data: any) {
      this.maxDate = new Date();
      this.form = this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(20)]],
        apellido: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        tipoDocumento: [null, Validators.required],
        documento: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        fechaNacimiento: [null, Validators.required],
      })
      //inyectando esto al controlador: private dateAdapter: DateAdapter<any>
      // dateAdapter.setLocale('es'); //cambia el formato a español del calendario y lo pone en dia-mes-año
       console.log('Estoy en el modal', data);
       this.id = data.id;
    }
  
  ngOnInit(): void {
    // Verificar si se está recargando la página
    if (this.router.navigated) {
      console.log('Página recargada');
      // Realiza las acciones que necesitas al recargar la página
    this.esEditar(this.id);
    }
  }

  esEditar(id: number | undefined) {
    if(id !== undefined){
      this.operacion = 'Editar ';
    }
  }

  cancelar(){
    this.dialogRef.close(false);
  }


  addEditPersona(id?: number){
    //console.log(this.form); imprimir solamente el objeto creado para el formulario
    //saber el valor del objeto const nombre = this.form.get('nombre).value;
    if (this.form.invalid){
      return;
    }
      
    const persona: Persona = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      correo: this.form.value.correo,
      tipoDocumento: this.form.value.tipoDocumento,
      documento: this.form.value.documento,
      fechaNacimiento: this.form.value.fechaNacimiento.toISOString().slice(0, 10) //estos dos ultimos toISOString convierte en strin la fecha y slice solo toma los caracteres desde la posicion cero hasta la 10
    }
    console.log(persona);
    //console.log(this.form);

    this.loading = true;

    setTimeout(() => { //va a mostrar el spinner solo cuando sea necesario por 1500 segundo
      this._personaService.addPersona(persona).subscribe(() => {
        this.loading = false;
        console.log('Persona agregada con exito');
        this.mensajeGuardarPersona();
        this.dialogRef.close(true);
        })
    }, 1500); 
  }

  mensajeGuardarPersona(){
    this._snackBar.open('La persona fue agregada con exito', '',{
      duration: 4000,
    });
  }
  
  }



