import { Component, Input } from '@angular/core'

@Component({
  selector: '[printer-value]',
  templateUrl: './printer-value.component.html',
  styleUrls: ['./printer-value.component.css']
})
export class PrinterValueComponent {
  @Input() text: string = ''
  @Input() value: any = undefined

  isArray(value: any): boolean {
    return Array.isArray(value)
  }

  isObject(value: any): boolean {
    return (typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null)
  }

  getType(value: any): string {
    if (this.isObject(value)) {
      return 'object'
    } else if (this.isArray(value)) {
      return 'array'
    }

    return 'raw'
  }
}
