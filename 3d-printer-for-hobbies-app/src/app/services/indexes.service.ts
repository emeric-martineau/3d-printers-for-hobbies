import { Injectable } from '@angular/core'
import { IndexKeysDescription } from './indexes-keys-description'
import { IndexesValues } from './indexes-values'
import { Indexes } from './indexes'

@Injectable({
  providedIn: 'root'
})
export class IndexesService {

  constructor() { }

  getIndexKeysDescription() {
    return IndexKeysDescription
  }

  getAllKeysDescription(): Map<string, string> {
    return IndexKeysDescription
  }

  getKeyDescription(key: string): string {
    return IndexKeysDescription.get(key) || ''
  }

  getIndexValues() {
    return IndexesValues
  }

  getValuesOfOneIndex(key: string): string[] {
    let values = IndexesValues.get(key)

    if (values === undefined) {
      values = []
    }
    return values.flatMap((value: string|number|boolean) => String(value))
  }

  getOneIndexForOneKeyValue(key: string, value: string): number[] {
    return Indexes.get(`${key}-${value}`) || []
  }
}
