import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PrintersService {
  private PrintersList: any = undefined

  private ready = new BehaviorSubject(false)

  constructor(private http: HttpClient) {
    this.http.get(`./assets/printers.json`).subscribe(data => {
      this.PrintersList = data
      this.ready.next(true)
    })
  }

  getPrinters() {
    return this.PrintersList
  }

  getOnePrinterByIndex(index: number) {
    return this.PrintersList[index]
  }

  getReady(): Observable<boolean> {
    return this.ready.asObservable()
  }
}
