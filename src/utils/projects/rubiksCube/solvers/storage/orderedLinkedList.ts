import { Storage } from ".";

type LinkListEntry<T> = {
  next?: LinkListEntry<T>;
  item: T;
  weight: number;
};

export class OrderedLinkedList<T> implements Storage<T> {
  private firstEntry?: LinkListEntry<T>;

  private lastEntry?: LinkListEntry<T>;

  private _length = 0;

  private weightFn: (item: T) => number;

  constructor(weightFn: (item: T) => number, items: T[] = []) {
    this.weightFn = weightFn;

    items.forEach(this.add);
  }

  get length() {
    return this._length;
  }

  find(predicate: (item: T) => boolean) {
    let entry: LinkListEntry<T> | undefined = this.firstEntry;

    while (entry) {
      if (predicate(entry.item)) {
        return entry.item;
      }

      entry = entry.next;
    }
  }

  includes(item: T) {
    return Boolean(this.find((el) => el === item));
  }

  add(item: T) {
    const newEntry: LinkListEntry<T> = {
      item: item,
      weight: this.weightFn(item),
    };

    // Check if is the only entry

    if (!this.firstEntry) {
      this.firstEntry = newEntry;

      this.lastEntry = newEntry;

      return;
    }

    // Check if should go in the first place

    if (newEntry.weight < this.firstEntry.weight) {
      const oldFirstEntry = this.firstEntry;

      newEntry.next = oldFirstEntry;

      this.firstEntry = newEntry;

      return;
    }

    // Insert between elements

    const previousEntry = this.firstEntry;

    const nextEntry = previousEntry.next;

    while (nextEntry) {
      if (newEntry.weight < nextEntry.weight) {
        newEntry.next = nextEntry;

        previousEntry.next = newEntry;

        return;
      }
    }

    // Enter in last position

    previousEntry.next = newEntry;

    this.lastEntry = newEntry;

    this._length++;
  }

  popFirst() {
    const firstEntry = this.firstEntry;

    this.firstEntry = firstEntry?.next;

    this._length--;

    return firstEntry?.item;
  }
}
