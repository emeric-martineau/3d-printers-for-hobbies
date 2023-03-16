import { Injectable } from '@angular/core'
import { IndexKeysDescription } from './indexes-keys-description'

@Injectable({
  providedIn: 'root'
})
export class IndexesService {

  constructor() { }

  getIndexKeysDescription() {
    return IndexKeysDescription
  }

  getKeyDescription(key: string): string|undefined {
    return IndexKeysDescription.get(key)
  }
}
