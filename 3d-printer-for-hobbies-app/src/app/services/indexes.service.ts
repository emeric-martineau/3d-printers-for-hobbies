import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class IndexesService {
  private IndexKeysDescription: Map<string, string> = new Map()
  private IndexesValues: Map<string, string[]> = new Map()
  private Indexes: Map<string, number[]> = new Map()

  private ready = new BehaviorSubject(false)

  constructor(private http: HttpClient) {
    this.http.get(`./assets/index/indexes-keys-description.json`).subscribe(data => {
      this.IndexKeysDescription = new Map(Object.entries(data))

      if (this.isReady()) {
        this.ready.next(true)
      }
    })

    this.http.get(`./assets/index/indexes-values.json`).subscribe(data => {
      this.IndexesValues = new Map(Object.entries(data))

      if (this.isReady()) {
        this.ready.next(true)
      }
    })

    this.http.get(`./assets/index/indexes.json`).subscribe(data => {
      this.Indexes = new Map(Object.entries(data))

      if (this.isReady()) {
        this.ready.next(true)
      }
    })
  }

  private isReady(): boolean {
    return this.IndexKeysDescription.size > 0 && this.IndexesValues.size > 0 && this.Indexes.size > 0
  }

  getReady(): Observable<boolean> {
    return this.ready.asObservable()
  }

  // Return all of description for all keys
  getAllKeysDescription(): Map<string, string> {
    return this.IndexKeysDescription
  }

  // Get the description of this index key
  getKeyDescription(key: string): string {
    return this.IndexKeysDescription.get(key) || ''
  }

  // Return all database of values by index key name
  getIndexValues() {
    return this.IndexesValues
  }

  // Return the type
  getTypeOfIndex(key: string): string {
    let values = this.IndexesValues.get(key)

    if (values === undefined || values.length === 0) {
      return 'undefined'
    }

    return typeof values[0]
  }

  // Return list of value in database for one key of index
  getValuesOfIndexAsString(key: string): string[] {
    let values = this.IndexesValues.get(key)

    if (values === undefined) {
      values = []
    }

    return values.flatMap((value: string|number|boolean) => String(value))
  }

  // Get list of printers (by index in list) that contains this value of key.
  // That help to seach printers with this value.
  getPrintersListForOneKeyValue(key: string, value: string): number[] {
    return this.Indexes.get(`${key}-${value}`) || []
  }
}
