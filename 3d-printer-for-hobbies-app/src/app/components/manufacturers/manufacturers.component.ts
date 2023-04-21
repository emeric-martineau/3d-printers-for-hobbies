import { Component } from '@angular/core'
import { ManufacturersService } from '../../services/manufacturers.service'

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent {
  ManufacturerDescription: string = ""

  constructor(public manufacturers: ManufacturersService) { }

  getSmallLogo(manufacturer: string): string {
    return `assets/manufacturers/${manufacturer}_256x256.png`
  }

  loadManufacturer(manufacturer: string) {
    this.ManufacturerDescription = manufacturer
  }
}
