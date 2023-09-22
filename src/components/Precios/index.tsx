'use client'

import { ConfigPanel } from "./ConfigPanel";
import { Config } from "@/types/Precios";
import { useState,useContext, useEffect } from "react";
import { rootContext } from "@/context";
import { InformationPanel } from "./InformationPanel";
import { MatchTable } from "./MatchTable";
import styles from '@/assets/MatchTable.module.css';


const Precios:React.FC = ()=>{
    const {products,vendors,updateProducts} = useContext(rootContext);

    const initialConfig = {
        idProveedor:0,
        discriminar:0,
        colCodigo:1,
        colCosto:3,
        colTitulo:2,
        withTitulo:1,
        iva:0,
        ivaIncluido:0,
        rentabilidad:0,
        isFinal:0,
        modificacion:0,
        modificacionAfecta:1,
        xlsxItems:[]
    }

    const [config,setConfig] = useState<Config>(initialConfig);

    useEffect(()=>{console.log(products)},[products])
    
    return (
        <>
            <aside className="flex flex-column flex-gap">
            <InformationPanel products={products}/>
            <ConfigPanel config={config} setConfig={setConfig} products={products} vendors={vendors}/>
            </aside>
            <MatchTable products={products} config={config} vendors={vendors} updateProducts={updateProducts} />
        </>
    )
}

export {Precios};