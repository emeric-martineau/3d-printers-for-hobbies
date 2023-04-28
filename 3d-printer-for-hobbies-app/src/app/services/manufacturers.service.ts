import { Injectable } from '@angular/core'
import { ManufacturersList } from './manufacturers'
import { ManufacturersDescription } from './manufacturers-description'

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

  constructor() { }

  getManufacturersList() {
    return ManufacturersList
  }

  getManufacturerDescripton(name: string): string {
    return ManufacturersDescription.get(name) || "not found"
  }
}
