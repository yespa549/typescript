import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Persona } from '../../interfaces/persona';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AgregarEditarPersonaComponent } from '../agregar-editar-persona/agregar-editar-persona.component';
import { PersonaService } from '../../services/persona.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '@angular/cdk/dialog';

// const listPersonas: Persona[] = [
  
//   { nombre:"tomas", apellido:"hagamez", correo:"t@gmail.com", tipoDocumento: "Cedula", documento: 1038963325, fechaNacimiento: new Date()},
//   { nombre:"juan", apellido:"hernandeez", correo:"t@gmail.com", tipoDocumento: "Cedula", documento: 1038963325, fechaNacimiento: new Date()},
//   { nombre:"ana", apellido:"perez", correo:"t@gmail.com", tipoDocumento: "Cedula", documento: 1038963325, fechaNacimiento: new Date()},
//   { nombre:"camila", apellido:"rodriguez", correo:"t@gmail.com", tipoDocumento: "Cedula", documento: 1038963325, fechaNacimiento: new Date()},
//   { nombre:"tomas", apellido:"anza", correo:"t@gmail.com", tipoDocumento: "Cedula", documento: 1038963325, fechaNacimiento: new Date()},
//   { nombre:"tomas", apellido:"gaviria", correo:"t@gmail.com", tipoDocumento: "Cedula", documento: 1038963325, fechaNacimiento: new Date()}
// ];



@Component({
  selector: 'app-list-personas',
  templateUrl: './list-personas.component.html',
  styleUrl: './list-personas.component.css'
})

export class ListPersonasComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre','apellido','correo','tipoDocumento','documento','fechaNacimiento', 'acciones'];
  dataSource: MatTableDataSource<Persona>;
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  constructor(public dialog: MatDialog, private _personaService:PersonaService, 
    private _snackBar: MatSnackBar)
  { 
    // this.dataSource = new MatTableDataSource(listPersonas); //Cuando los datos son ingresados manualmente
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    //this.dataSource.sort = this.sort;
    this.obtenerPersonas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator._intl.itemsPerPageLabel = "Items por pagina";
  }

obtenerPersonas() {
  this.loading = true;
  this._personaService.getPersonas().subscribe(data => {
    this.loading = false;
    console.log(data);
    this.dataSource.data = data;
    
    //paginación 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  })
}

//filtra cada que escriba algo 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 //agregar nuevo registro de persona
 addEditPersona(id?: number) {
  const dialogRef = this.dialog.open(AgregarEditarPersonaComponent, {
        width: '700px',
        disableClose: true, //solo puede cancelar a traves del boton
        data: { //para traer los datos de la lista a editarlos
          id: id
        }
  });

  dialogRef.afterClosed().subscribe(result => { // refresaca despues de agregar
    console.log('The dialog was closed');
    if(result) {
        this.obtenerPersonas(); //recarga el formulario con todas las personas
      }
 });

 }

 deletePersona(id: number) {
  //console.log(id);
  this.loading = true;
   this._personaService.deletePersona(id).subscribe(() => {
           this.loading = false; 
           this.obtenerPersonas();
           this.mensajeElimarPersona();
   })
  }

  mensajeElimarPersona(){
    this._snackBar.open('La Persona fue Eliminada con exito', '',{
      duration: 4000,
      panelClass: ['snackbar']
    });
  }





}




