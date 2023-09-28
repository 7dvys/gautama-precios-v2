'use client'

import { ConfigPanel } from "./ConfigPanel";
import { Config } from "@/types/Precios";
import { useState,useContext, useEffect } from "react";
import { rootContext } from "@/context";
import { InformationPanel } from "./ConfigPanel/InformationPanel";
import { MatchTable } from "./MatchTable";


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
        cotizacion:'blue',
        xlsxItems:[]
    }

    const [config,setConfig] = useState<Config>(initialConfig);
    
    return (
        <>
            <aside className="flex flex-column flex-gap">
            <ConfigPanel config={config} setConfig={setConfig} products={products} vendors={vendors}/>
            </aside>
            <MatchTable products={products} config={config} vendors={vendors} updateProducts={updateProducts} />
        </>
    )
}

export {Precios};