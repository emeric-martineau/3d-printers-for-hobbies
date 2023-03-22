import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FilterWithValue } from '@shared/filters'

@Component({
  selector: 'filters-gutter',
  templateUrl: './filters-gutter.component.html',
  styleUrls: ['./filters-gutter.component.css']
})
export class FiltersGutterComponent {
  @Input() filters: FilterWithValue[] = []
  @Output() onDeleteEvent: EventEmitter<string> = new EventEmitter()

  onDelete(key: string): void {
    this.onDeleteEvent.emit(key)
  }
}
