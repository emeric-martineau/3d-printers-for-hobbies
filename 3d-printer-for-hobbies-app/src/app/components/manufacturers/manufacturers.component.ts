import { Component, OnInit } from '@angular/core'
import { SafeHtml } from '@angular/platform-browser'

import { ManufacturersService } from '../../services/manufacturers.service'

@Component({
  selector: 'manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {
  ManufacturerDescription: SafeHtml = ""
  manufacturers: string[] = []

  constructor(
    private manufacturersService: ManufacturersService) { }

  ngOnInit () {
    this.manufacturersService.getList().subscribe(data => this.manufacturers = data)
  }

  getSmallLogo(manufacturer: string): string {
    return `assets/manufacturers/logo/${manufacturer}_256x256.png`
  }

  loadManufacturer(manufacturer: string) {
    this.manufacturersService.getDescriptions(manufacturer).subscribe(text => this.ManufacturerDescription = text)
  }
}
