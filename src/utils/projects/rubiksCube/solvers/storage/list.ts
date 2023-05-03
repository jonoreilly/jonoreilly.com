import { Storage } from ".";

export class List<T> implements Storage<T> {
  private list: T[] = [];

  constructor(items: T[] = []) {
    items.forEach((item) => this.add(item));
  }

  get length() {
    return this.list.length;
  }

  find(predicate: (item: T) => boolean) {
    return this.list.find(predicate);
  }

  includes(item: T) {
    return this.list.includes(item);
  }

  add(item: T) {
    this.list.push(item);
  }

  popFirst() {
    return this.list.shift();
  }
}
