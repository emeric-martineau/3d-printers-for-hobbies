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

  getAllKeysDescription(): Map<string, string> {
    return this.IndexKeysDescription
  }

  getKeyDescription(key: string): string {
    return this.IndexKeysDescription.get(key) || ''
  }

  getIndexValues() {
    return this.IndexesValues
  }

  getValuesOfOneIndex(key: string): string[] {
    let values = this.IndexesValues.get(key)

    if (values === undefined) {
      values = []
    }
    return values.flatMap((value: string|number|boolean) => String(value))
  }

  getOneIndexForOneKeyValue(key: string, value: string): number[] {
    return this.Indexes.get(`${key}-${value}`) || []
  }
}
