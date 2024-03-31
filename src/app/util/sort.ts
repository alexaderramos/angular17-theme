export class Sort {
  private sortOrder = 1;
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  constructor() {
  }

  public startSort(id: string, second_id: string, order: string, type: string = '') {
    if (order === 'desc') {
      this.sortOrder = -1;
    }

    return (a: any, b: any) => {
      let va = second_id.length ? a[id][second_id] : a[id];
      let vb = second_id.length ? b[id][second_id] : b[id];
      if (type === 'date') {
        return this.sortData(new Date(va), new Date(vb));
      } else {
        return this.collator.compare(va, vb) * this.sortOrder;
      }
    };
  }

  private sortData(a: any, b: any) {
    if (a < b) {
      return -1 * this.sortOrder;
    } else if (a > b) {
      return 1 * this.sortOrder;
    } else {
      return 0 * this.sortOrder;
    }
  }
}
