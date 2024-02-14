module.exports =
class MemoryDatabase {
    constructor(size) {
        this.size = size;
        this.dataMap = new Map();
    }

    dump() {
        console.log("--------------------");
        console.log(this.dataMap);
        console.log(this.index);
        console.log("--------------------");
    }

    get(key) {
        return this.dataMap.get(key);
    }

    insert(key, item) {
        if (this.dataMap.size >= this.size) {
            const evicted_key = this.dataMap.keys().next().value
            this.dataMap.delete(evicted_key);
        }
        this.dataMap.set(key, item)
        // this.dump()
    }
}
