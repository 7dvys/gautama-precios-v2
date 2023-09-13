import { useMatchItems } from "@/hooks/useMatchItems";
import { Config, XlsxProduct } from "@/types/Precios";
import { Product, Vendor } from "@/types/contabilium";
import { useEffect, useRef, useState} from "react";
import styles from '@/assets/MatchTable.module.css'
import { serializeXlsxItems } from "@/utils/precios";
import { serializeArray } from "@/utils";
import { TrItem } from "@/components/Precios/MatchTable";
import { compareTitles } from "@/utils/precios/MatchTable";
import { updateProducts } from "@/utils/contabilium";
import { initializeDb } from "@/utils/indexedDb";
import { Database } from "@/types";
import { Movement } from "@/types/movimientos";

const MatchTable:React.FC<{products:Product[],config:Config,token:string,vendors:Vendor[]}> = ({products,config,token,vendors})=>{
    const {matchItems,matchXlsxAndCbProducts,clearMatchItems,updateMatchItems,deleteMatchItem} = useMatchItems({products,config});    
    const serializedXlsxItems = useRef<Record<string,XlsxProduct>>({});
    const serializedProducts:Record<string,Product> = serializeArray(products,'Codigo');
    const [warnings,setWarnings] = useState<{codigo:string,title:boolean,price:boolean}[]>([])
    const warningsCount = useRef<{title:number,price:number}>({title:0,price:0})
    const [wereUpdated,setWereUpdated] = useState<{codigo:string,status:number}[]>([]);
    const [movimientosDb,setMovimientosDb] = useState<Database>({} as Database);

    useEffect(()=>{
        initializeDb('movimientos').then(db=>{
            setMovimientosDb(db);
        })
    },[])
    
    useEffect(()=>{
        clearMatchItems();
        setWereUpdated([]);
        serializedXlsxItems.current=(serializeXlsxItems(config));
        if(products.length && config.xlsxItems.length){
            matchXlsxAndCbProducts();
        }
    },[config])  

    useEffect(()=>{
        warningsCount.current={title:0,price:0};
        const newWarnings = matchItems.map(({codigo,descripcion,final})=>{
            const newWarning = {codigo,title:false,price:false}
            const {Nombre:cbTitle,PrecioFinal} = serializedProducts[codigo];
            const xlsxTitle = serializedXlsxItems.current[descripcion]?serializedXlsxItems.current[descripcion].titulo??'':'';  
            
            const comparePrices = Math.abs((PrecioFinal/final)-1)>0.3;
        
            if (config.withTitulo && compareTitles({xlsxTitle,cbTitle})) {
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

    const cancelarHandler = ()=>{
        if(confirm('[!] seguro que desea CANCELAR?'))
        clearMatchItems();
    }

    const aceptarHandler = ()=>{
        if(confirm('[!] seguro que desea ACEPTAR?'))
        updateProducts({matchItems,config,serializedProducts,token}).then(updates=>{
            setWereUpdated(updates);

            const products = matchItems.map(({codigo})=>{
                return serializedProducts[codigo];
            })

            const vendor = vendors.filter(({Id})=>(Id==config.idProveedor))[0];
            const movimiento:Movement = {
                vendorId:config.idProveedor,
                vendorName:vendor.NombreFantasia.length?vendor.NombreFantasia:vendor.RazonSocial,
                fuente:'precios',
                fecha:new Date(),
                detalles:{products,matchItems,config}
            }
            movimientosDb.add([movimiento]);
        })
    }
  
    
    if(matchItems.length)
    return (
    <div className={styles.matchTable}>
        <div className={`${styles.tableOptions} box`}>
            <div className={styles.information}>
                <span>coincidencias: {matchItems.length}</span>
                <span>titulos disonantes: {warningsCount.current.title}</span>
                <span>precios dispares: {warningsCount.current.price}</span>
            </div>
            <div className={styles.options}>
                <button onClick={aceptarHandler}>aceptar</button>
                <button onClick={cancelarHandler}>cancelar</button>
            </div>
        </div>
        <div className={`${styles.tableContainer} box`}> 
            <table className={`${styles.table}`}>
                <thead>
                    <tr>
                        {['codigo','descripcion','titulo','final anterior','costo','precio','final',''].map((title,index)=>(
                            <th key={index}>{title}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {matchItems.map((item,index)=>(
                        <TrItem matchItems={matchItems} key={index} wereUpdated={wereUpdated} warnings={warnings} item={item} serializedProducts={serializedProducts} serializedXlsxItems={serializedXlsxItems} updateMatchItems={updateMatchItems} deleteMatchItem={deleteMatchItem}/>
                    ))}
                </tbody>
            </table>
        </div>
    </div>)
}
export {MatchTable};