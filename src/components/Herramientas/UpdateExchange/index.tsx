'use client'

import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import { initializeCotizaciones } from "@/services/cotizaciones/initializeCotizaciones";
import { ExchangeRateMatchItem, ExchangeRateMatchItems } from "@/types/Herramientas";
import { MatchItems, Observaciones, Products } from "@/types/Precios"
import { Cotizacion } from "@/types/cotizaciones";
import { simpleDataSerializer } from "@/utils/simpleDataSerializer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UpdateExchangeProps{
    products:Products;
    setMatchItems:Dispatch<SetStateAction<MatchItems>>
}

export const UpdateExchange:React.FC<UpdateExchangeProps> = ({products,setMatchItems})=>{
    
    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType):ACCOUNT_TYPE.main;

    const [cotizaciones,setCotizaciones] = useState<Record<string,number>>({});
    const {encoder,decoder} = simpleDataSerializer();

    useEffect(()=>{
        initializeCotizaciones().then(({getCotizaciones})=>{
            setCotizaciones(getCotizaciones());
        })
    },[])

    useEffect(()=>{
        if(Object.keys(cotizaciones).length){
            
    }},[cotizaciones,products])
    
    const aceptarHandler = ()=>{
        const newMatchItems = Object.entries(products).reduce((acc,[table,tableProducts])=>{
            const items =  tableProducts.reduce((acc,product)=>{
                const {Observaciones,Codigo:codigo,CostoInterno,Rentabilidad,Iva,Descripcion:descripcion} = product;
                const decodedDescripcion = decoder(Observaciones) as Observaciones;

                if(decodedDescripcion.cotizacion){
                    const rentabilidadFactor = 1+Number(Rentabilidad)/100
                    const ivaFactor = 1+Number(Iva)/100
                    const {cotizacion,cotizacionPrecio} = decodedDescripcion;
                    const costoDolar = CostoInterno/Number(cotizacionPrecio);

                    const costo = costoDolar*cotizaciones[cotizacion]
                    const precio = costo*rentabilidadFactor;
                    const final = precio*ivaFactor;

                    const newExchangeMatchItem:ExchangeRateMatchItem = {codigo,costo,precio,final,subCosto:costo,descripcion,prevCotizacion:cotizacion,prevCotizacionRate:cotizacionPrecio,rentabilidad:Rentabilidad,iva:Iva}
                    acc.push(newExchangeMatchItem);

                }
                return acc;
            },[] as ExchangeRateMatchItem[])

            acc[(table as 'main'|'secondary')]=items;
            return acc
        },{} as ExchangeRateMatchItems)
        setMatchItems(newMatchItems)
    }
    
    return (
        <>
        <div className="formBox box">
        <h3>Actualizar Dolar</h3>
        <span>Variacion del dolar: 50%</span>
        <button onClick={aceptarHandler} disabled={(accountType == ACCOUNT_TYPE.main && products.main.length && products.secondary.length)||(accountType == ACCOUNT_TYPE.secondary && products.secondary.length)?false:true}>aceptar</button>
        </div>
        </>
    )
}

