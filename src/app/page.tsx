'use client'

import { Movement } from "@/types/movimientos";
import { initializeDb } from "@/utils/indexedDb";
import { useEffect, useState } from "react";

const Movimientos:React.FC = ()=>{

    const [movimientos,setMovimientos] = useState<Movement[]>([])

  useEffect(()=>{
    const probarDb = async ()=>{
      const movimientosDb = await initializeDb('movimientos');
      

      movimientosDb.getAll().then(movements=>{setMovimientos(movements)})
    }

    probarDb();
  },[])
  return (
    <>
        {movimientos.map((movimiento,index)=>(
            <div key={index}>
                <ul>
                    {Object.entries(movimiento).map(([key,value],index)=>(
                        <li key={index}>{key+value}</li>
                    ))}
                </ul>
            </div>
        ))}
    </>
  )}

export default Movimientos;