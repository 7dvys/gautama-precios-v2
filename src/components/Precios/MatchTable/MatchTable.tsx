import { useMatchItems } from "@/hooks/useMatchItems";
import { Config, XlsxProduct } from "@/types/Precios";
import { Product } from "@/types/contabilium";
import { useEffect, useRef, useState} from "react";
import styles from '@/assets/MatchTable.module.css'
import { serializeXlsxItems } from "@/utils/precios";
import { serializeArray } from "@/utils";
import { TrItem } from "@/components/Precios/MatchTable";
import { compareTitles } from "@/utils/precios/MatchTable";

const MatchTable:React.FC<{products:Product[],config:Config}> = ({products,config})=>{
    const {matchItems,matchXlsxAndCbProducts,clearMatchItems,updateMatchItems,deleteMatchItem} = useMatchItems({products,config});    
    const serializedXlsxItems = useRef<Record<string,XlsxProduct>>({});
    const serializedProducts:Record<string,Product> = serializeArray(products,'Codigo');
    const [warnings,setWarnings] = useState<{codigo:string,title:boolean,price:boolean}[]>([])
    const warningsCount = useRef<{title:number,price:number}>({title:0,price:0})


    useEffect(()=>{
        clearMatchItems();
        serializedXlsxItems.current=(serializeXlsxItems(config));
        if(products.length && config.xlsxItems.length){
            matchXlsxAndCbProducts();
        }
    },[config])  

    useEffect(()=>{
        warningsCount.current={title:0,price:0};
        const newWarnings = matchItems.map(({codigo,final})=>{
            const newWarning = {codigo,title:false,price:false}
            const {Nombre:cbTitle,PrecioFinal} = serializedProducts[codigo];
            const {titulo:xlsxTitle} = serializedXlsxItems.current[codigo];        
            
            const comparePrices = Math.abs((PrecioFinal/final)-1)>0.3;
        
            if (config.tieneTitulo && compareTitles({xlsxTitle,cbTitle})) {
                newWarning.title = true;
                warningsCount.current.title += 1;
            } else {
                newWarning.title = false;
            }
        
            if (comparePrices) {
                newWarning.price = true;
                warningsCount.current.price += 1;

            } else {
                newWarning.price = false;
            }
        
            return newWarning;
        }) 
        setWarnings(newWarnings);
    },[matchItems])

    
    
    
    if(matchItems.length)
    return (
    <div className={styles.matchTable}>
        <div className={`${styles.tableOptions} box`}>
            <button onClick={clearMatchItems}>cancelar</button>
            <span>articulos: {matchItems.length}</span>
            <span>titulos {warningsCount.current.title}</span>
            <span>precios {warningsCount.current.price}</span>
        </div>
        <div className={`${styles.tableContainer} box`}> 
            <table className={`${styles.table}`}>
                <thead>
                    <tr>
                        {['codigo','titulo','final anterior','costo','precio','final','eliminar'].map((title,index)=>(
                            <th key={index}>{title}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {matchItems.map((item,index)=>(
                        <TrItem matchItems={matchItems} key={index} warnings={warnings} item={item} serializedProducts={serializedProducts} serializedXlsxItems={serializedXlsxItems} updateMatchItems={updateMatchItems} deleteMatchItem={deleteMatchItem}/>
                    ))}
                </tbody>
            </table>
        </div>
    </div>)
}
export {MatchTable};