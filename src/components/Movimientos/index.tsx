'use client'
import { Movement } from "@/types/movimientos";
import { initializeDb } from "@/data/indexedDb";
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
      <main className="flex-column">

        {movimientos.reverse().map((movimiento,index)=>(
          <div className="box" key={index}>
                <ul>
                    {Object.entries(movimiento).map(([key,value],index)=>(
                      <li  key={index}>{key+value}</li>
                      ))}
                </ul>
            </div>
        ))}
      </main>
    </>
  )}

  export {Movimientos};