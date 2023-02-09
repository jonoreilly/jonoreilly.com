import { Storage } from ".";

type StorageEntry = {
  weight: number;
  hashKey: string;
};

export class Hash<T> implements Storage<T> {
  private storage: Storage<StorageEntry>;

  private hash: Record<string, T> = {};

  private weightFn: (item: T) => number;

  private hashFn: (item: T) => string;

  constructor(
    storageGenerator: (
      weightFn: (item: StorageEntry) => number
    ) => Storage<StorageEntry>,
    weightFn: (item: T) => number,
    hashFn: (item: T) => string,
    items: T[] = []
  ) {
    this.storage = storageGenerator((el) => el.weight);

    this.weightFn = weightFn;

    this.hashFn = hashFn;

    items.forEach(this.add);
  }

  get length() {
    return this.storage.length;
  }

  find(predicate: (item: T) => boolean) {
    const storageEntry = this.storage.find((el) =>
      predicate(this.hash[el.hashKey])
    );

    return storageEntry ? this.hash[storageEntry.hashKey] : undefined;
  }

  includes(item: T) {
    return Boolean(this.hash[this.hashFn(item)]);
  }

  add(item: T) {
    const hashKey = this.hashFn(item);

    const weight = this.weightFn(item);

    this.hash[hashKey] = item;

    const newStorageEntry: StorageEntry = {
      hashKey,
      weight,
    };

    this.storage.add(newStorageEntry);
  }

  popFirst() {
    const firstStorageEntry = this.storage.popFirst();

    if (!firstStorageEntry) {
      return;
    }

    const firstItem = this.hash[firstStorageEntry.hashKey];

    delete this.hash[firstStorageEntry.hashKey];

    return firstItem;
  }
}
