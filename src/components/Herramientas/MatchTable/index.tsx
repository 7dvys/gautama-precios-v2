'use client'

import styles from '@/assets/MatchTable.module.css'
import { useState } from "react"
import { TableControl } from "./TableControl";
import { MatchItems } from "@/types/Precios";

const MatchTable:React.FC<{herramienta:string}> = ({herramienta})=>{
    const [page,setPage] = useState<number>(1);
    const [pageSize,setPageSize] = useState<number>(200);
    const [search,setSearch] = useState<string>('');
    const matchItems = {main:[],secondary:[]}
    return (
        <>
        <div className={`${styles.tableOptions} box sticky`}>
            <TableControl matchItems={matchItems} page={page} setPage={setPage} setPageSize={setPageSize} pageSize={pageSize} search={search} setSearch={setSearch}/>
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
                    {/* <TrItems wereUpdated={wereUpdated} page={page} pageSize={pageSize} search={search} updateMatchItems={updateMatchItems} deleteMatchItem={deleteMatchItem} matchItems={matchItems} warnings={warnings} serializedProducts={serializedProducts} serializedXlsxItems={serializedXlsxItems.current}/> */}
                </tbody>
            </table>
        </div>
        </>
    )
}

export {MatchTable}