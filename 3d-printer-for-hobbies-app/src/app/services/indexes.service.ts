import { Injectable } from '@angular/core'
import { IndexKeysDescription } from './indexes-keys-description'
import { IndexesValues } from './indexes-values'

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

  getKeyDescription(key: string): string|undefined {
    return IndexKeysDescription.get(key)
  }

  getIndexValues() {
    return IndexesValues
  }
}
