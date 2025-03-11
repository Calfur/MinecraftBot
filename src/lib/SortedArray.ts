export default class SortedArray<T> {
    private items: T[] = [];
    private comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    private findInsertionIndex(item: T): number {
        let low = 0, high = this.items.length;
        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            if (this.comparator(this.items[mid], item) < 0) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    insert(item: T): void {
        const index = this.findInsertionIndex(item);
        this.items.splice(index, 0, item);
    }

    update(oldItem: T, newItem: T): void {
        const index = this.items.indexOf(oldItem);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        this.insert(newItem);
    }

    getItems(): T[] {
        return this.items;
    }

    length(): number {
        return this.items.length;
    }

    pop(): T | undefined {
        return this.items.pop();
    }
}