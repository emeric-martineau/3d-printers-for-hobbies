import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from "@angular/router"
import { Subscription } from 'rxjs'
import { PrintersService } from '../../services/printers.service'

const SECTIONS = [
  { key: "printer", text: "Printer"},
  { key: "print", text: "Print specification" },
  { key: "nozzle", text: "Nozzle specification" },
  { key: "filament", text: "Filament" },
  { key: "screen", text: "Screen specification" },
  { key: "other", text: "Miscellaneous" }
]

@Component({
  selector: 'display-printer',
  templateUrl: './display-printer.component.html',
  styleUrls: ['./display-printer.component.css']
})
export class DisplayPrinterComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription()
  printer: any = null
  sections = SECTIONS
  printersAttributs

  constructor (private route: ActivatedRoute, private printers: PrintersService) {
    this.printersAttributs = printers.getPrintersAttributs()
  }

  async ngOnInit () {
    this.subscription = this.route.params.subscribe(async (params) => {
      const index = parseInt(params["id"], 10)
      this.printer = this.printers.getOnePrinterByIndex(index)
    })
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
  }

  getSectionData(section: string) {
    return this.printersAttributs[section]
  }

  isSubAttribut(section: string, key: string): boolean {
    return this.printersAttributs[section][key].text === undefined
  }

  getSubAttribut(section: string, key: string) {
    return this.printersAttributs[section][key]
  }

  getAttributText(section: string, key: string, subKey: string | undefined = undefined): string {
    if (subKey) {
      return this.printersAttributs[section][key][subKey].text
    }

    return this.printersAttributs[section][key].text
  }

  getAttributValue(section: string, key: string, subKey: string | undefined = undefined): string {
    if (subKey) {
      return this.printer[section][key][subKey]
    }

    return this.printer[section][key]
  }

  isArray(section: string, key: string, subKey: string | undefined = undefined): boolean {
    const value = this.getAttributValue(section, key, subKey)
    return Array.isArray(value)
  }
}
