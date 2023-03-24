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
  constructor(public key: string, public text: string) { }
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
  printersIndexList: number[] = []
  // Current filter selected in menu
  selectedFilter = new FilterWithValue()
  // All filters selected
  currentFilterList: FilterWithValue[] = []

  constructor(private printers: PrintersService, private indexes: IndexesService) {  }

  private filterPrintersList() {
    // Now filter the printers list
    // For each key (e.g. "printer.name"), for each value of this key (e.g. "Ender 3", "BLU-5") get list of index
    let allIndex = new Map<string, number[]>()
    this.currentFilterList.forEach(item => {
      let data: number[] = []

      item.values.forEach(value => {
        data = data.concat(this.indexes.getOneIndexForOneKeyValue(item.key, value))
      })

      allIndex.set(item.key, data)
    })

    // Search first filter was set
    const firstKey = TABLE_COLUMNS.find(key => allIndex.get(key) !== undefined)

    if (firstKey !== undefined) {
      let newIndex = allIndex.get(firstKey) || []

      // Search union of all filter
      allIndex.forEach(value => {
        newIndex = newIndex.filter(item => value.includes(item))
      })

      newIndex.sort((a, b) => a - b)

      this.printersIndexList = newIndex
    } else {
      console.error('Cannot find first key with filter data')
    }
  }

  ngOnInit(): void {
    // Init index off display printer
    let printersList = this.printers.getPrinters()
    for (let index = 0; index < printersList.length; index++) {
      this.printersIndexList.push(index)
    }

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

  getOnePrinterByIndex(index: number) {
    return this.printers.getOnePrinterByIndex(index)
  }

  onSelectedFilterName(filterName: string, filterText: string) {
    this.selectedFilter.key = filterName
    this.selectedFilter.text = filterText
    this.selectedFilter.values = this.indexes.getValuesOfOneIndex(filterName)
  }

  onSelectedFilterValue(filter: FilterWithValue, value: string) {
    let item = this.currentFilterList.find(item => item.key === filter.key)

    if (item === undefined) {
      this.currentFilterList.push(new FilterWithValue(filter.key, filter.text, [value]))
    } else if (!item.values.includes(value)) {
      item.values.push(value)
    }

    this.filterPrintersList()
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
