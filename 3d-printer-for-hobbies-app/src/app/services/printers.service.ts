import { Injectable } from '@angular/core'
import { PrintersList } from './printers'

@Injectable({
  providedIn: 'root'
})
export class PrintersService {

  constructor() { }

  getPrinters() {
    return PrintersList
  }

  getOnePrinterByIndex(index: number) {
    return PrintersList[index]
  }
}
