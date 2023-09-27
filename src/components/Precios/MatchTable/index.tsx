'use client'
import styles from '@/assets/MatchTable.module.css'
import { useMatchItems } from "@/hooks/useMatchItems";
import { SerializedProducts,SerializedXlsxItems,MatchTableProps, Warnings, WarningsCount } from "@/types/Precios";
import { useEffect, useRef, useState} from "react";
import { serializeXlsxItems } from "@/utils/precios";
import { serializeArray } from "@/utils";
import { TrItems } from "./TrItems";
import { initializeWarnings } from "@/utils/precios/MatchTable";
import { initializeDb } from "@/data/indexedDb";
import { Database } from "@/types";
import { Movement } from "@/types/movimientos";
import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import { createMovementToDb } from '@/utils/precios/MatchTable';
import { TableControl } from './TableControl';
const MatchTable:React.FC<MatchTableProps> = ({products,config,vendors,updateProducts})=>{
    
    const {main,secondary}=products;
    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType):ACCOUNT_TYPE.main;
    const {matchItems,matchXlsxAndCbProducts,clearMatchItems,updateMatchItems,deleteMatchItem} = useMatchItems({products,config});    
    const serializedXlsxItems = useRef<SerializedXlsxItems>({});
    const serializedProducts:SerializedProducts = {
        main:serializeArray(products.main,'Codigo'),
        secondary:serializeArray(products.secondary,'Codigo')
    };
    
    const [warnings,setWarnings] = useState<Warnings>([])
    const warningsCount = useRef<WarningsCount>({main:{title:0,price:0},secondary:{title:0,price:0}})
    // const [wereUpdated,setWereUpdated] = useState<{codigo:string,status:number}[]>([]);
    const [movimientosDb,setMovimientosDb] = useState<Database<Movement>>({} as Database<Movement>);

    useEffect(()=>{
        initializeDb('movimientos').then(db=>{
            setMovimientosDb(db);
        })
    },[])
    
    useEffect(()=>{
        clearMatchItems();
        // setWereUpdated([]);
        serializedXlsxItems.current=(serializeXlsxItems(config));
        if((accountType == ACCOUNT_TYPE.main && main.length && secondary.length)||(accountType == ACCOUNT_TYPE.secondary && secondary.length)){
            matchXlsxAndCbProducts();
        }
    },[config])  

    useEffect(()=>{
        const {newWarnings,newWarningsCount} = initializeWarnings({matchItems,serializedProducts,serializedXlsxItems,config});
        warningsCount.current = newWarningsCount;
        setWarnings(newWarnings);
    },[matchItems])

    const aceptarHandler = ()=>{
        if(updateProducts && (matchItems.main.length || matchItems.secondary.length) && confirm('[!] seguro que desea ACEPTAR?'))
        updateProducts({matchItems,config,serializedProducts}).then(()=>{
            // setWereUpdated(updates);
            const {movimiento} = createMovementToDb({matchItems,vendors,config,serializedProducts})
            console.log(movimiento)
            // movimientosDb.add([movimiento]);
        })
    }

    const cancelarHandler = ()=>{
        if(confirm('[!] seguro que desea CANCELAR?'))
        clearMatchItems();
    }

  
    return (
    <div className={styles.matchTable}>
        <div className={`${styles.tableOptions} box`}>
            <TableControl matchItems={matchItems} warningsCount={warningsCount.current} aceptarHandler={aceptarHandler} cancelarHandler={cancelarHandler}/>
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
                    <TrItems updateMatchItems={updateMatchItems} deleteMatchItem={deleteMatchItem} matchItems={matchItems} warnings={warnings} serializedProducts={serializedProducts} serializedXlsxItems={serializedXlsxItems.current}/>
                </tbody>
            </table>
        </div>
    </div>)
   
    // return (<></>)

}

export {MatchTable};