'use client'
import { initializeCotizaciones } from "@/services/cotizaciones/initializeCotizaciones";
import { RefObject, useEffect, useState } from "react";

const Cotizaciones:React.FC<{cotizacionRef:RefObject<HTMLSelectElement>}> = ({cotizacionRef})=>{
    const [cotizaciones,setCotizaciones] = useState<Record<string,number>>({});

    useEffect(()=>{
        initializeCotizaciones().then(cotizaciones=>{
            setCotizaciones(cotizaciones.getCotizaciones())
        })
    },[])
    
    return (
        <>
            <label>cotizacion</label>
            <select ref={cotizacionRef} name="cotizacion">
                <option value="default">default</option>1
                {Object.entries(cotizaciones).map(([key,value])=>(
                    <option key={key} value={key}>{key} ${value}</option>
                ))}
            </select>
        </>
    )
}

export {Cotizaciones}