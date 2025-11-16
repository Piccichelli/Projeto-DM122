export default class GastosService{
    constructor() {
        this.dbName = "GastosDB";
        this.storeName = "gastos";
        this.db = null;

        this.ready = this.initDB();
    }

    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains(this.storeName)) {
                    const store = this.db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
                    store.createIndex("data", "data", { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("[GastosService] Banco inicializado!");
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("[GastosService] Erro ao abrir DB:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async insertData(gasto) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.add(gasto);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    }

    async getAll() {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    }

    async deleteData(id) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }
}