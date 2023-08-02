import { Component, OnInit } from '@angular/core'
import { PrintersService } from '../../services/printers.service'
import { IndexesService } from '../../services/indexes.service'
import { Filter, FilterWithValue } from '@shared/filters'

const TABLE_COLUMNS = [
  "printer.name",
  "printer.manufacturer",
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
  constructor(public key: string, public text: string, public sort: boolean = false, public sortAsc: boolean = false) { }
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
  // To know if can display page
  canDisplayPage = false

  page: number = 1
  printersPerPage: number = 10

  constructor(private printers: PrintersService, private indexes: IndexesService) {  }

  private initPrinterList() {
    // Init index off display printer
    let printersList = this.printers.getPrinters()
    for (let index = 0; index < printersList.length; index++) {
      this.printersIndexList.push(index)
    }
  }

  private filterPrintersList() {
    // Now filter the printers list
    // For each key (e.g. "printer.name"), for each value of this key (e.g. "Ender 3", "BLU-5") get list of index
    let allIndex = new Map<string, number[]>()

    this.currentFilterList.forEach(item => {
      let data: number[] = []

      // Get item index of each printer
      item.values.forEach(value => {
        data = data.concat(this.indexes.getPrintersListForOneKeyValue(item.key, value))
      })

      allIndex.set(item.key, data)
    })

    // Search first filter was set.
    // Filter must be present in TABLE_COLUMNS.
    const firstKey = TABLE_COLUMNS.find(key => allIndex.get(key) !== undefined)

    if (firstKey === undefined) {
      this.initPrinterList()
    } else {
      let newIndex = allIndex.get(firstKey) || []

      // Search union of all filter
      allIndex.forEach(value => {
        newIndex = newIndex.filter(item => value.includes(item))
      })

      newIndex.sort((a, b) => a - b)

      this.printersIndexList = newIndex
    }
  }

  private sort(key: string, sortAsc: boolean) {
    // First take type of data to sort right
    const typeOfKey = this.indexes.getTypeOfIndex(key)

    let sortFunction = (a: any, b: any): number => 0

    switch(typeOfKey) {
      case 'number': {
         if (sortAsc) {
           sortFunction = (a: number, b: number): number => a - b
         } else {
           sortFunction = (a: number, b: number): number => b - a
         }
         break;
      }
      case 'string': {
        if (sortAsc) {
          sortFunction = (a: string, b: string): number => a.localeCompare(b)
        } else {
          sortFunction = (a: string, b: string): number => b.localeCompare(a)
        }
        break;
      }
      case 'boolean': {
        if (sortAsc) {
          sortFunction = (a: boolean, b: boolean): number => a ? -1 : 1
        } else {
          sortFunction = (a: boolean, b: boolean): number => b ? -1 : 1
        }
        break;
      }
      default: {
        break;
      }
    }

    this.printersIndexList.sort((printer1, printer2) => {
      const value1 = this.getProperty(this.getOnePrinterByIndex(printer1), key)
      const value2 = this.getProperty(this.getOnePrinterByIndex(printer2), key)

      return sortFunction(value1, value2)
    })
  }

  ngOnInit(): void {
    this.indexes.getReady().subscribe(isIndexReady => {
      if (isIndexReady) {
        this.printers.getReady().subscribe(isPrintersReady => {
          if (isPrintersReady) {
            this.initPrinterList()

            // Init table header with label
            TABLE_COLUMNS.forEach(key => {
              this.tableHeader.push(
                new TableHeader(key, this.indexes.getKeyDescription(key))
              )
            })

            // Init filter field
            this.indexes.getAllKeysDescription().forEach((value, key) =>  this.filtersNameList.push(new Filter(key, value)))
            // sort filter list
            this.filtersNameList.sort((a, b) => a.text.localeCompare(b.text))
            this.canDisplayPage = true
          }
        })
      }
    })
  }

  /////////////////////////////////////////////////////////////////////////////
  // Getter & Setter

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

  getStartPage() {
    return (this.page - 1) * this.printersPerPage
  }

  getEndPage() {
    return this.getStartPage() + this.printersPerPage
  }

  isFilterValueIsSelected(filterKey: string, value: string) {
    let item = this.currentFilterList.find(element => element.key === filterKey)
    let selected = false

    if (item) {
      selected = item.values.includes(value)
    }

    return selected
  }

  /////////////////////////////////////////////////////////////////////////////
  // Event
  onSelectedFilterName(filterName: string, filterText: string) {
    this.selectedFilter.key = filterName
    this.selectedFilter.text = filterText
    this.selectedFilter.values = this.indexes.getValuesOfIndexAsString(filterName).sort((a, b) => a.localeCompare(b))
  }

  onSelectedFilterValue(filter: FilterWithValue, value: string) {
    let item = this.currentFilterList.find(item => item.key === filter.key)

    if (item === undefined) {
      // At first time, filter is not present, so add it
      this.currentFilterList.push(new FilterWithValue(filter.key, filter.text, [value]))
      // and sort array
      this.currentFilterList.sort((a, b) => a.text.localeCompare(b.text))
    } else if (item.values.includes(value)) {
      // This value of filter is selected, so remove it
      const index = item.values.indexOf(value)
      item.values.splice(index, 1)

      if (item.values.length === 0) {
        this.currentFilterList = this.currentFilterList.filter(item => item.key !== filter.key)
      }
    } else {
      // Value of filter is not selected, add it
      item.values.push(value)
    }

    this.filterPrintersList()
  }

  onDeleteFilter(filterKey: any) {
    this.currentFilterList = this.currentFilterList.filter(filter => filter.key !== filterKey)

    if (this.currentFilterList.length === 0) {
      this.initPrinterList()
    }
  }

  onSelectedFilter(filter: FilterWithValue) {
    this.selectedFilter = filter
  }

  onSortColumn(column: TableHeader) {
    let oldState

    this.tableHeader.forEach(c => {
      oldState = c.sort
      c.sort = c === column

      if (c.sort && oldState) {
        // Invert sort
        c.sortAsc = !c.sortAsc
      }

      if (c.sort) {
        this.sort(c.key, c.sortAsc)
      }
    })
  }
}
