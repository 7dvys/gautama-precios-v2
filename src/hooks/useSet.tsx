import { useState } from "react";

const useSet = ():[array:any[],add:Function,remove:Function]=>{
    const [array, setArray] = useState<any[]>([] as any[]);

    // Función para agregar un elemento al conjunto
    const add = (item:any) => {
      // Creamos una copia del conjunto actual y agregamos el nuevo elemento
      const newSet = new Set(array);
      newSet.add(item);
      
      // Actualizamos el estado con el nuevo conjunto
      const newArray = Array.from(newSet);
      setArray(newArray);
    };
    
    // Función para eliminar un elemento del conjunto
    const remove = (item:any) => {
      // Creamos una copia del conjunto actual y eliminamos el elemento
      const newSet = new Set(array);
      newSet.delete(item);
      
      // Actualizamos el estado con el nuevo conjunto
      const newArray = Array.from(newSet);
      setArray(newArray);
    };

    return [array,add,remove];
}

export {useSet};