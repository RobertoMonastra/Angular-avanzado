import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaisSmall, Pais } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrlv1: string = 'https://restcountries.com/v3.1';
  private baseUrlv2: string = 'https://restcountries.com/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region:string):Observable<PaisSmall[]>{

    const url: string = `${this.baseUrlv1}/region/${region}?fields=cca3,name`
    return this.http.get<PaisSmall[]>( url )
  }

  getPaisPorCodigo(codigo : string): Observable<Pais | null>{

    if(!codigo){
      return of(null) 
    }

    const url = `${this.baseUrlv2}/alpha/${codigo}`;
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall(codigo : string): Observable<PaisSmall>{


    const url = `${this.baseUrlv2}/alpha/${codigo}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos( borders:string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of ([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }



}
