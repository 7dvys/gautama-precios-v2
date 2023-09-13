import { Movement } from "./movimientos";

interface Database{
    add:(movements: Movement[]) => Promise<IDBValidKey[]>; //return a movement id key array;
    get:(idMovements: number[]) => Promise<Movement[]>; 
    getAll:() => Promise<Movement[]>,
    getAllKeys:()=>Promise<IDBValidKey[]>, // return all keys
    remove:(idMovements: number[]) => Promise<IDBValidKey[]>; //return a movement id key array;
}

export type {Database};