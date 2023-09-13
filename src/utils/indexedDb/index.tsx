import { Database } from "@/types";
import { Movement } from "@/types/movimientos";

const openDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open("gautama-precios", 1);
    
        request.onupgradeneeded = (event:IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const objectStore = db.createObjectStore("movimientos", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("fuente", "fuente", { unique: false });
            objectStore.createIndex("proveedor", "proveedor", { unique: false });
        }
    
        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        }
    
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        }
    })
}
  
const initializeDb = async (objectStoreName:string):Promise<Database> => {
    const db = await openDatabase();

    const add = (movements:Movement[]):Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{

            const transaction:IDBTransaction = db.transaction([objectStoreName],'readwrite');
            const objectStore:IDBObjectStore = transaction.objectStore(objectStoreName);

            const addPromises:Promise<IDBValidKey>[] = movements.map((movement)=>{
                return new Promise((resolve,reject)=>{
                    const request = objectStore.add(movement);
                    request.onsuccess = ()=>{
                        resolve(request.result);
                    }

                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(addPromises))
            }
                        
            // transaction.onerror = ()=>{
            //     reject(false);
            // }
        })
    }

    // const updateMovement

    const get = (idMovements:number[]):Promise<Movement[]>=>{
        return new Promise( async (resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);
            
            const getPromises:Promise<Movement>[] = idMovements.map((id)=>{
                return new Promise((resolve,reject)=>{
                    const request:IDBRequest<Movement> = objectStore.get(id)
                    request.onsuccess = ()=>{
                        resolve(request.result);
                    }
                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(getPromises))
            }
            // transaction.onerror = ()=>{}
        })
    }

    const getAll = ():Promise<Movement[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);

            const request:IDBRequest<Movement[]> = objectStore.getAll();
            request.onsuccess = ()=>{
                resolve(request.result)
            }
        })
    } 

    const getAllKeys = ():Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);

            const request = objectStore.getAllKeys();
            request.onsuccess = ()=>{
                resolve(request.result)
            }
        })
    }

    const remove = (idMovements:number[]):Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName],'readwrite');
            const objectStore = transaction.objectStore(objectStoreName);

            const deletePromises:Promise<IDBValidKey>[] = idMovements.map((id)=>{
                return new Promise((resolve,reject)=>{
                    const request = objectStore.delete(id)
                    request.onsuccess = ()=>{
                        resolve(id);
                    }
                })
            })

            transaction.oncomplete = ()=>{
                resolve(Promise.all(deletePromises))
            }
        })
    }
    

    return {get,getAll,getAllKeys,add,remove};
};



export {initializeDb};