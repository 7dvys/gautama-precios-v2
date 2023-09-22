'use client'
import { initializeCotizaciones } from "@/services/cotizaciones/initializeCotizaciones";
import { CotizacionesProps } from "@/types/cotizaciones";
import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";


const CotizacionesOptions:React.FC = ()=>{
    const cotizacionesUtils = useRef<CotizacionesProps>({} as CotizacionesProps)
    const [cotizaciones,setCotizaciones] = useState<Record<string,number>>({});

    useEffect(()=>{
        initializeCotizaciones().then(cotizaciones => {
            cotizacionesUtils.current = cotizaciones
            setCotizaciones(cotizacionesUtils.current.getCotizaciones())
        });       
    },[])


    const cotizacionesRef = useRef<HTMLSelectElement>(null);

    const modifyHandler = ()=>{
        const {value:title} = (cotizacionesRef.current as HTMLSelectElement)
        const currentCotization = cotizacionesUtils.current.getCotizaciones()[title]
        let value = prompt(`[!] nueva cotizacion para ${title} o escriba 'eliminar'`,currentCotization.toString())??0;
        if(value == 'eliminar'){
            setCotizaciones(cotizacionesUtils.current.removeCotizacion({title}))
            return;
        }

        value = Number(value);
        if(value != 0 || !isNaN(Number(value)))
        cotizacionesUtils.current.updateCotizacion({title,value})
        else alert('[!] ingresa un valor valido.')
        setCotizaciones(cotizacionesUtils.current.getCotizaciones())       
    }

    const nombreRef = useRef<HTMLInputElement>(null);
    const newCotizacionRef = useRef<HTMLInputElement>(null);

    const addHandler = ()=>{
        const title = (nombreRef.current as HTMLInputElement).value
        const value = Number((newCotizacionRef.current as HTMLInputElement).value)
        if(title && value)
        cotizacionesUtils.current.updateCotizacion({title,value})
        setCotizaciones(cotizacionesUtils.current.getCotizaciones())
        alert(`[!] ${title} agregado a 1usd=$${value}`);
    }

    if(Object.keys(cotizaciones).length)
    return(
        <section>
            <div className="box formBox">
                <h3>Cotizaciones</h3>
                <select ref={cotizacionesRef} name="cotizaciones">
                    {Object.entries(cotizaciones).map(([key,value],index)=>(
                        <option key={index} value={key}>{key}:{value}</option>
                    ))}
                </select>
                <button onClick={modifyHandler}>modificar</button>
                <label>agregar</label>
                <div>
                    <input ref={nombreRef} type="text" placeholder="nombre" name="nombre"/>
                    <input ref={newCotizacionRef} type="number" placeholder="cotizacion" name="cotizacion"/>    
                </div>
                <button onClick={addHandler}>aceptar</button>
            </div>
        </section>
    )
    else return (<>cargando...</>)
}

export {CotizacionesOptions};