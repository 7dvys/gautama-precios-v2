import { useState } from "react"
import { serializeArray } from "@/utils"
import { Product } from "@/types/contabilium"
import { Config,MatchItem } from "@/types/Precios"
import { genCostos } from "@/utils/precios/genCostos"
import { serializeXlsxItems } from "@/utils/precios"
// import { genCostoPrecioAndFinal } from "@/utils/precios"


const useMatchItems = ({products,config}:{products:Product[];config:Config})=>{
    const [matchItems,setMatchItems]= useState<(MatchItem)[]>([])
    const {idProveedor,discriminar} = config;
    const serializedXlsxItems = serializeXlsxItems(config);

    const matchXlsxAndCbProducts = ()=>{
        const serializedProducts:Record<string,Product> = serializeArray(products,"Codigo")
        const matchItems = Object.values(serializedXlsxItems).reduce((acc,{codigo,costo})=>{
            // const codigo = currentXlsxProduct[colCodigo-1].toString();
            // const costo = currentXlsxProduct[colCosto-1];

            if(serializedProducts[codigo]){  
                const currentProduct = serializedProducts[codigo];
                const xlsxCosto = Number(costo);
                const rentabilidadPrevia = currentProduct.Rentabilidad;
                const ivaPrevio = currentProduct.Iva;
                const newCostos = genCostos({xlsxCosto,rentabilidadPrevia,ivaPrevio,config})

                const matchItem:MatchItem = {codigo,...newCostos}

                const discriminarBoolean = (Number(currentProduct.CodigoBarras) == idProveedor);
                if(!discriminar || (discriminar && discriminarBoolean)) 
                acc.push(matchItem);   
            }
            return acc;
        },[] as MatchItem[])
        setMatchItems(matchItems);
    }

    const updateMatchItems = (codigoObj:string,nuevoFinal:number)=>{

        const newMatchItems = matchItems.map((matchItem)=>{
            const {costo,final,iva,codigo} = matchItem;

            const ivaFactor = 1+iva/100;
            const nuevoPrecio = (nuevoFinal??final)/ivaFactor;
            const nuevaRentalibidad = ((nuevoFinal??final)/(costo*ivaFactor)-1)*100
            
            const updated:MatchItem = {...matchItem,
                precio:Number(nuevoPrecio.toFixed(2)),
                rentabilidad:Number(nuevaRentalibidad.toFixed(2)),
                final:Number(nuevoFinal.toFixed(2))
            }

            return codigo==codigoObj?updated:matchItem;
        })
        setMatchItems(newMatchItems)
    }

    const deleteMatchItem = (codigoObj:string)=>{
      const newMatchItems = matchItems.filter(({codigo})=>(codigo!=codigoObj));
      setMatchItems(newMatchItems);
    }

    const clearMatchItems = ()=>{
      setMatchItems([])
  }

    return {matchItems,clearMatchItems,matchXlsxAndCbProducts,updateMatchItems,deleteMatchItem}
}

export {useMatchItems};
    