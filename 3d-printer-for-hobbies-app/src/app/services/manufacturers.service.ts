import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

import { BehaviorSubject, Observable } from "rxjs"

import { ManufacturersList } from './manufacturers'


@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer) { }

  getList(): Observable<string[]> {
    return this.http.get<string[]>(`./assets/manufacturers/manufacturers.json`)
  }

  getDescriptions(manufacturer: string): Observable<SafeHtml> {
    const data = new BehaviorSubject<SafeHtml>('Loading...')

    this.http.get(`./assets/manufacturers/description/${manufacturer}.html`, {responseType:'text'}).subscribe(res => {
      data.next(this.sanitizer.bypassSecurityTrustHtml(res))
    })

    return data
  }
}
