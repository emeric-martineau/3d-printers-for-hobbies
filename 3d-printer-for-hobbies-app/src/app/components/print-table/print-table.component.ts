import { Component, OnInit } from '@angular/core'
import { PrintersService } from '../../services/printers.service'
import { IndexesService } from '../../services/indexes.service'
import { Filter, FilterWithValue } from '@shared/filters'

const TABLE_COLUMNS = [
  "printer.name",
  "print.volume",
  "printer.type",
  "printer.closed",
  "print.bed.surface",
  "printer.release_year",
  "other.bed_leveling",
  "other.runout_sensor",
  "other.motherboard",
  "other.firmware",
  "filament.diameter",
  "nozzle.number",
  "nozzle.extrudeur_type",
  "printer.price",
]

class TableHeader {
  constructor(public key: string, public text: string|undefined) {
    if (text === undefined) {
      text = '-'
    }
  }
}

@Component({
  selector: 'print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.css']
})
export class PrintTableComponent implements OnInit {
  // Table header
  tableHeader: TableHeader[] = []
  // Filters name
  filtersNameList: Filter[] = []
  // Full printers list
  printersList: any[] = []
  // Current filter selected in menu
  selectedFilter = new FilterWithValue()
  // All filters selected
  currentFilterList: FilterWithValue[] = []

  constructor(private printers: PrintersService, private indexes: IndexesService) {  }

  ngOnInit(): void {
    this.printersList = this.printers.getPrinters()

    // Init table header with label
    TABLE_COLUMNS.forEach(key => {
      this.tableHeader.push(
        new TableHeader(key, this.indexes.getKeyDescription(key))
      )
    })

    // Init filter field
    this.indexes.getAllKeysDescription().forEach((value, key) =>  this.filtersNameList.push(new Filter(key, value)))
  }

  // Read value
  getProperty(obj: any, path: string) {
    path.split('.').forEach(key => {
      obj = obj[key]
    })

    return obj
  }

  onSelectedFilterName(filterName: string, filterText: string) {
    this.selectedFilter.key = filterName
    this.selectedFilter.text = filterText
    this.selectedFilter.values = this.indexes.getValuesOfOneIndex(filterName)
  }

  onSelectedFilterValue(filter: FilterWithValue, value: string) {
    let item = this.currentFilterList.find(element => element.key === filter.key)
console.log(item)
    if (item === undefined) {
      this.currentFilterList.push(new FilterWithValue(filter.key, filter.text, [value]))
    } else if (!item.values.includes(value)) {
      item.values.push(value)
    }
  }

  onDeleteFilter(filterKey: any) {
    this.currentFilterList = this.currentFilterList.filter(filter => filter.key !== filterKey)
  }

  isFilterValueIsSelected(filterKey: string, value: string) {
    let item = this.currentFilterList.find(element => element.key === filterKey)

    if (item) {
      return item.values.includes(value)
    }

    return false
  }
}
