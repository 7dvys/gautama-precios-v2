import { useState } from "react"
import { Config,MatchItem, MatchItems, Products } from "@/types/Precios"
import { genCostos } from "@/utils/precios/genCostos"
import { serializeXlsxItems } from "@/utils/precios"

const useMatchItems = ({products,config}:{products:Products;config:Config})=>{
    const [matchItems,setMatchItems]= useState<MatchItems>({main:[],secondary:[]});
    const {idProveedor,discriminar} = config;
    const serializedXlsxItems = serializeXlsxItems(config);

    const matchXlsxAndCbProducts = ()=>{
        const [main,secondary] = Object.values(products).map(product=>
            product.reduce((acc,{Descripcion:descripcion,Codigo:codigo,CodigoBarras,Rentabilidad,Iva})=>{
                descripcion = descripcion.toString().trim();
                codigo = codigo.toString().trim()
                
                if(serializedXlsxItems[descripcion]){
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
    