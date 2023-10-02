import { useState } from "react"
import { Config,MatchItem, MatchItems, Observaciones as ObservacionesType, Products } from "@/types/Precios"
import { genCostos } from "@/utils/precios/genCostos"
import { serializeXlsxItems } from "@/utils/precios"
import { initializeCotizaciones } from "@/services/cotizaciones/initializeCotizaciones"
import { simpleDataSerializer } from "@/utils/simpleDataSerializer"

const useMatchItems = ({products,config}:{products:Products;config:Config})=>{
    const [matchItems,setMatchItems]= useState<MatchItems>({main:[],secondary:[]});
    const {idProveedor,discriminar} = config;
    const serializedXlsxItems = serializeXlsxItems(config);

    const matchXlsxAndCbProducts = ()=>{
        const {decoder} = simpleDataSerializer();
        const {operacion} = config;
        initializeCotizaciones().then(({getCotizaciones})=>{
            const cotizaciones = getCotizaciones();
            const [main,secondary] = Object.values(products).map(tableProduct=>
            tableProduct.reduce((acc,{Descripcion:descripcion,Codigo:codigo,CodigoBarras,Rentabilidad,Iva,CostoInterno,Observaciones})=>{
                descripcion = descripcion.toString().trim(); // En descripcion ira el codigo que figura en la lista del proveedor
                codigo = codigo.toString().trim() // El codigo sera el de nuestra preferencia
                
                const prevObservaciones = decoder(Observaciones) as ObservacionesType;
                if(operacion == 'dolar' && prevObservaciones.cotizacion){
                    const {cotizacion,cotizacionPrecio} = decoder(Observaciones) as ObservacionesType
                    const costoDolar = CostoInterno/cotizacionPrecio;
                    const rentabilidadFactor = 1+Rentabilidad/100;
                    const ivaFactor = 1+Iva/100
                    
                    const costo = Number((costoDolar*cotizaciones[cotizacion]).toFixed(2));
                    const precio = Number((costo*rentabilidadFactor).toFixed(2));
                    const final = Number((precio*ivaFactor).toFixed(2));
    
                    const matchItem:MatchItem = {codigo,descripcion,subCosto:costo,costo,precio,final,rentabilidad:Rentabilidad,iva:Iva}
                    acc.push(matchItem)
                }
                
                if(operacion == 'precios' && serializedXlsxItems[descripcion]){
                    const {costo} = serializedXlsxItems[descripcion];
                    const xlsxCosto = costo?Number(costo):0;
                    const rentabilidadPrevia = Rentabilidad;
                    const ivaPrevio = Iva;
                    const newCostos = genCostos({xlsxCosto,rentabilidadPrevia,ivaPrevio,config})

                    const matchItem:MatchItem = {codigo,descripcion,...newCostos}

                    const discriminarBoolean = (CodigoBarras == idProveedor.toString());
                    if(!discriminar || (discriminar && discriminarBoolean)) 
                    acc.push(matchItem)                
                }
                return acc; 
            },[] as MatchItem[]))
            setMatchItems({main,secondary});
        })
    }

    const updateExchangeRate = ({products}:{products:Products})=>{
        
    }

    const updateMatchItems = ({codigoItem,nuevoFinal,table}:{codigoItem:string,nuevoFinal:number,table:'main'|'secondary'})=>{

        const newMatchItems = matchItems[table].map((matchItem)=>{
            const {costo,final,iva,codigo} = matchItem;

            const ivaFactor = 1+iva/100;
            const nuevoPrecio = (nuevoFinal??final)/ivaFactor;
            const nuevaRentalibidad = ((nuevoFinal??final)/(costo*ivaFactor)-1)*100
            
            const updated:MatchItem = {...matchItem,
                precio:Number(nuevoPrecio.toFixed(2)),
                rentabilidad:Number(nuevaRentalibidad.toFixed(2)),
                final:Number(nuevoFinal.toFixed(2))
            }

            return codigo==codigoItem?updated:matchItem;
        })
        setMatchItems(prevMatchItems=>({...prevMatchItems,[table]:newMatchItems}))
    }

    const deleteMatchItem = ({codigoItem,table}:{codigoItem:string,table:'main'|'secondary'})=>{
      const newMatchItems = matchItems[table].filter(({codigo})=>(codigo!=codigoItem));
      setMatchItems(prevMatchItems=>({...prevMatchItems,[table]:newMatchItems}))
    }

    const clearMatchItems = ()=>{
      setMatchItems({main:[],secondary:[]})
  }

    return {matchItems,clearMatchItems,matchXlsxAndCbProducts,updateMatchItems,deleteMatchItem}
}

export {useMatchItems};
    