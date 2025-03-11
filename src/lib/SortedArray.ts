export default class SortedArray<T extends { id: string }> {
    private items: T[] = [];
    private index: Map<string, T> = new Map();
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
        this.index.set(item.id, item);
    }

    update(oldItem: T, newItem: T): void {
        this.delete(oldItem);
        this.insert(newItem);
    }

    delete(item: T): void {
        const index = this.items.indexOf(item);
        if (index !== -1) { 
            this.items.splice(index, 1);
        }
        this.index.delete(item.id);
    }

    getItems(): T[] {
        return this.items;
    }

    length(): number {
        return this.items.length;
    }

    getById(id: string): T | undefined {
        return this.index.get(id); // Fast lookup
    }

    pop(): T | undefined {
        const item = this.items.pop()
        if (item) this.index.delete(item.id);
        return item;
    }
}