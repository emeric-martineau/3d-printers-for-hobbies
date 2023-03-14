import { Component, OnInit } from '@angular/core'
import { PrintersService } from 'src/app/services/printers.service'

const TABLE_COLUMNS = [
  { text: "Name", key: "printer.name" },
  { text: "Print volume", key: "print.volume"},
  { text: "Type", key: "printer.type" },
  { text: "Closed", key: "printer.closed" },
  { text: "Bed type", key: "print.bed.surface" },
  { text: "Release Year", key: "printer.release_year" },
  { text: "Bed leveling", key: "other.bed_leveling" },
  { text: "Runout sensor", key: "other.runout_sensor" },
  { text: "Type of motherboard", key: "other.motherboard" },
  { text: "Firmware", key: "other.firmware" },
  { text: "Filament diameter", key: "filament.diameter" },
  { text: "Nozzle number", key: "nozzle.number" },
  { text: "Extruder", key: "nozzle.extrudeur_type" },
  { text: "Price", key: "printer.price" },
]

@Component({
  selector: 'print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.css']
})
export class PrintTableComponent implements OnInit {
  tableHeader = TABLE_COLUMNS

  printersList: any[] = []

  constructor(private printers: PrintersService) {  }

  ngOnInit(): void {
    this.printersList = this.printers.getPrinters()
  }

  // Read value
  getProperty(obj: any, path: string) {
    path.split('.').forEach(key => {
      console.log(key)
      obj = obj[key]
    })

    return obj
  }
}
