import { Injectable } from '@angular/core'
import { ManufacturersList } from './manufacturers'

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

  constructor() { }

  getManufacturersList() {
    return ManufacturersList
  }
}
