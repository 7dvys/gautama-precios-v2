import { Database } from "@/types";
import { IndexedDb } from "@/constants";

const openDatabase = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(IndexedDb.NAME, 1);
    
        request.onupgradeneeded = (event:IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            const movimientosObjectStore = db.createObjectStore(IndexedDb.OBJECTS_STORE.movimientos, { keyPath: "id", autoIncrement: true });
            movimientosObjectStore.createIndex("fuente", "fuente", { unique: false });
            movimientosObjectStore.createIndex("proveedor", "proveedor", { unique: false });
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
  
const initializeDb = async (objectStoreName:string):Promise<Database<any>> => {
    const db = await openDatabase();

    const add = (elements:any[]):Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{

            const transaction:IDBTransaction = db.transaction([objectStoreName],'readwrite');
            const objectStore:IDBObjectStore = transaction.objectStore(objectStoreName);

            const addPromises:Promise<IDBValidKey>[] = elements.map((element)=>{
                return new Promise((resolve,reject)=>{
                    const request = objectStore.add(element);
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

    const get = (idElements:number[]):Promise<any[]>=>{
        return new Promise( async (resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);
            
            const getPromises:Promise<any>[] = idElements.map((id)=>{
                return new Promise((resolve,reject)=>{
                    const request:IDBRequest<any> = objectStore.get(id)
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

    const getAll = ():Promise<any[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName]);
            const objectStore = transaction.objectStore(objectStoreName);

            const request:IDBRequest<any[]> = objectStore.getAll();
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

    const remove = (idElements:number[]):Promise<IDBValidKey[]>=>{
        return new Promise((resolve,reject)=>{
            const transaction:IDBTransaction = db.transaction([objectStoreName],'readwrite');
            const objectStore = transaction.objectStore(objectStoreName);

            const deletePromises:Promise<IDBValidKey>[] = idElements.map((id)=>{
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