import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  :['', Validators.required],
    pais    :['', Validators.required] ,
    frontera:['', Validators.required] ,
  })

  //llenar selectores
  regiones:string[] = [];
  paises: PaisSmall[] = [];
  codigo: Pais[] = [];

  constructor(private fb:FormBuilder,
              private paisesService:PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    /* this.miFormulario.get('region')?.valueChanges
        .subscribe( region => {
                        console.log(region)
    this.paisesService.getPaisesPorRegion(region)
          .subscribe(paises => {
            console.log(paises)
            this.paises = paises;
          })
    }) */

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) =>{
        this.miFormulario.get('pais')?.reset('');
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe(paises => {
      this.paises = paises;
    })
    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .subscribe(codigo => {
      this.codigo = codigo;
    })


  }

  guardar(){
    console.log(this.miFormulario.value)
  }

}
