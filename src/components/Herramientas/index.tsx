'use client';

import styles from '@/assets/MatchTable.module.css';
import { ChangeEvent, useContext, useState } from "react";
import { UpdateExchange } from "./UpdateExchange";
import { rootContext } from "@/context";
import { MatchTable } from './MatchTable';
import { MatchItems } from '@/types/Precios';


const Herramientas:React.FC = ()=>{
    const {products,vendors,updateProducts} = useContext(rootContext);
    const [herramienta,setHerramienta] = useState<string>('updateExchange')
    const [matchItems,setMatchItems] = useState<MatchItems>({main:[],secondary:[]})


    const Herramienta = herramienta=='updateExchange'?<UpdateExchange setMatchItems={setMatchItems} products={products}/>:<></> 

    
    const toolChangeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const {value} = event.target as HTMLSelectElement;
        setHerramienta(value)
    }

    return (
    <>
    <aside className="flex flex-column flex-gap">
        <div className="formBox box">
            <h3>Herramientas</h3>
            <select onChange={toolChangeHandler}>
                <option value="updateExchange">actualizar dolares</option>
                <option value="discoverProducts">descubrir productos</option>
            </select>
        </div>
        {Herramienta}
    </aside>
    <main className={`${styles.matchTable}`}>
        <MatchTable herramienta={herramienta} />
    </main>
    </>
    )
}

export {Herramientas}