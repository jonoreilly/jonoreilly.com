import { Heap } from "./heap";
import { List } from "./list";
import { OrderedLinkedList } from "./orderedLinkedList";
import { Hash } from "./hash";

export type Storage<T> = {
  add: (item: T) => void;
  popFirst: () => T | undefined;
  includes: (item: T) => boolean;
  find: (predicate: (item: T) => boolean) => T | undefined;
  length: number;
};

export type WeightFn<T> = (item: T) => number;

export type HashFn<T> = (item: T) => string;

export function getStorage<T>(
  storageType:
    | "heap"
    | "hashed-heap"
    | "list"
    | "hashed-list"
    | "ordered-linked-list"
    | "hashed-ordered-linked-list",
  weightFn: WeightFn<T>,
  hashFn: HashFn<T>,
  items?: T[]
): Storage<T> {
  switch (storageType) {
    case "heap":
      return new Heap(weightFn, items);

    case "hashed-heap":
      return new Hash(
        (weightFn) => new Heap(weightFn),
        weightFn,
        hashFn,
        items
      );

    case "list":
      return new List<T>(items);

    case "hashed-list":
      return new Hash(() => new List(), weightFn, hashFn, items);

    case "ordered-linked-list":
      return new OrderedLinkedList<T>(weightFn, items);

    case "hashed-ordered-linked-list":
      return new Hash(
        (weightFn) => new OrderedLinkedList(weightFn),
        weightFn,
        hashFn,
        items
      );
  }
}
