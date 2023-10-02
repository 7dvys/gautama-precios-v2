import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import { initializeCotizaciones } from "@/services/cotizaciones/initializeCotizaciones";
import { Config, Observaciones, Products, SerializedProducts } from "@/types/Precios";
import { serializeArray } from "@/utils";
import { simpleDataSerializer } from "@/utils/simpleDataSerializer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const InformationPanel:React.FC<{products:Products,config:Config,setConfig:Dispatch<SetStateAction<Config>>}> = ({products,config,setConfig})=>{
    
    const {encoder,decoder} = simpleDataSerializer();
    const [dolarGap,setDolarGap]=useState<{main:string,secondary:string}>({main:'',secondary:''});
    
    // update dolar :3
    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType):ACCOUNT_TYPE.main;
    const dolaresHandler = ()=>{
        setConfig(oldConfig=>{
            const config = {...oldConfig,operacion:'dolar',withTitulo:0} as Config;
            return config;
        })
    }

    useEffect(()=>{
        calculateDolarGap();
    },[products])

    const calculateDolarGap = ()=>{
        if((accountType == ACCOUNT_TYPE.main && products.main.length && products.secondary.length)||(accountType == ACCOUNT_TYPE.secondary && products.secondary.length))
        initializeCotizaciones().then(({getCotizaciones})=>{
            const cotizaciones = getCotizaciones();
            const dolarGapList = Object.entries(products).map(([table,tableProduct])=>{
                return tableProduct.reduce((acc,{Observaciones})=>{
                    const decodedObservaciones = decoder(Observaciones) as Observaciones;
                    if(decodedObservaciones.cotizacion){
                        const {cotizacionPrecio,cotizacion} = decodedObservaciones
                        const gap = cotizaciones[cotizacion]/cotizacionPrecio;
                        acc.push(gap)
                    }
                    return acc
                },[] as number[])
            })
            const [main,secondary] = dolarGapList.map(table=>(((table.reduce((a,b)=>(a+b),0)/table.length)-1)*100).toFixed(2))
            setDolarGap({main,secondary});
        })

    }
    
    return (
    <article className="box formBox">
        <h3>Informacion</h3>
        {accountType == ACCOUNT_TYPE.main?<span>Productos 764: {products.main.length?products.main.length:'cargando...'}</span>:''}
        <span>Productos 925: {products.secondary.length?products.secondary.length:'cargando...'}</span>
        {accountType == ACCOUNT_TYPE.main?<span>Diferencia dolar 764: {dolarGap.main.length?dolarGap.main+'%':'cargando...'}</span>:''}
        <span>Diferencia dolar 925: {dolarGap.secondary.length?dolarGap.secondary+'%':'cargando...'}</span>
        <button onClick={dolaresHandler}>actualizar dolares</button>
    </article>)
}

export {InformationPanel}