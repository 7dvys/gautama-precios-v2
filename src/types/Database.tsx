interface Database<ObjectStore>{
    add:(movements: ObjectStore[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    get:(idMovements: number[]) => Promise<ObjectStore[]>; 
    getAll:() => Promise<ObjectStore[]>,
    getAllKeys:()=>Promise<IDBValidKey[]>, // return all keys
    remove:(idMovements: number[]) => Promise<IDBValidKey[]>; //return a movement id key array;
}

export type {Database};