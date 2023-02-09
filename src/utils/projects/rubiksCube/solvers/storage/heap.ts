import { Storage } from ".";

type HeapEntry<T> = {
  weight: number;
  item: T;
};

export class Heap<T> implements Storage<T> {
  private heap: HeapEntry<T>[] = [];

  private weightFn: (item: T) => number;

  constructor(weightFn: (item: T) => number, items: T[] = []) {
    this.weightFn = weightFn;

    items.forEach(this.add);
  }

  get length() {
    return this.heap.length;
  }

  find(predicate: (item: T) => boolean) {
    return this.heap.find((el) => predicate(el.item))?.item;
  }

  includes(item: T) {
    return Boolean(this.heap.find((el) => el.item === item));
  }

  add(item: T) {
    const weight = this.weightFn(item);

    const newHeapEntry: HeapEntry<T> = {
      weight,
      item,
    };

    // Rebalance Heap (float the new entry from the bottom)

    this.heap.push(newHeapEntry);

    let newHeapEntryIndex = this.heap.length - 1;

    while (newHeapEntryIndex > 0) {
      const parentHeapEntryIndex = Math.floor((newHeapEntryIndex - 1) / 2);

      const parentHeapEntry = this.heap[parentHeapEntryIndex];

      if (newHeapEntry.weight >= parentHeapEntry.weight) {
        break;
      }

      this.heap[newHeapEntryIndex] = parentHeapEntry;

      this.heap[parentHeapEntryIndex] = newHeapEntry;

      newHeapEntryIndex = parentHeapEntryIndex;
    }
  }

  popFirst() {
    const lastHeapEntry = this.heap.pop();

    if (!lastHeapEntry) {
      return;
    }

    if (!this.heap.length) {
      return lastHeapEntry.item;
    }

    const topHeapEntry = this.heap[0];

    // Rebalance Heap (sink the last entry from the top)

    this.heap[0] = lastHeapEntry;

    let lastHeapEntryIndex = 0;

    while (lastHeapEntryIndex < this.heap.length) {
      const leftChildHeapEntryIndex = 2 * lastHeapEntryIndex + 1;

      const rightChildHeapEntryIndex = 2 * lastHeapEntryIndex + 2;

      const leftChildHeapEntry = this.heap[leftChildHeapEntryIndex];

      const rightChildHeapEntry = this.heap[rightChildHeapEntryIndex];

      if (!leftChildHeapEntry) {
        break;
      }

      if (!rightChildHeapEntry) {
        if (leftChildHeapEntry.weight < lastHeapEntry.weight) {
          this.heap[lastHeapEntryIndex] = leftChildHeapEntry;

          this.heap[leftChildHeapEntryIndex] = lastHeapEntry;

          lastHeapEntryIndex = leftChildHeapEntryIndex;
        } else {
          break;
        }
      } else {
        if (rightChildHeapEntry.weight < leftChildHeapEntry.weight) {
          if (rightChildHeapEntry.weight < lastHeapEntry.weight) {
            this.heap[lastHeapEntryIndex] = rightChildHeapEntry;

            this.heap[rightChildHeapEntryIndex] = lastHeapEntry;

            lastHeapEntryIndex = rightChildHeapEntryIndex;
          } else {
            break;
          }
        } else {
          if (leftChildHeapEntry.weight < lastHeapEntry.weight) {
            this.heap[lastHeapEntryIndex] = leftChildHeapEntry;

            this.heap[leftChildHeapEntryIndex] = lastHeapEntry;

            lastHeapEntryIndex = leftChildHeapEntryIndex;
          } else {
            break;
          }
        }
      }
    }

    return topHeapEntry.item;
  }
}
