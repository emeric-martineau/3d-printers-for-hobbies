export class Filter {
  constructor(public key: string, public text: string) { }
}

export class FilterWithValue {
  constructor(public key: string = '', public text: string = '', public values: string[] = []) { }
}
