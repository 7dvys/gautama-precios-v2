'use client'
import styles from '@/assets/precios.module.css'
import { useState,useContext, useEffect } from "react";
import { ConfigPanel, InformationPanel, MatchTable } from "@/components/Precios";
import { Config } from "@/types/Precios";
import { Product } from "@/types/contabilium";
import { getProducts } from "@/utils/contabilium";
import { toolsContext } from "@/context";

const Precios:React.FC = ()=>{

    const {token,vendors} = useContext(toolsContext);
    const [products,setProducts] = useState<Product[]>([]);

    useEffect(()=>{
        const initializeProducts = async()=>{
            if(token){
                const productsResponse = await getProducts(token)
                if(productsResponse){
                    const products = productsResponse;
                    setProducts(products);
                }
            } 
        }
        initializeProducts();
    },[token])


    const [config,setConfig] = useState<Config>({
        idProveedor:0,
        discriminar:0,
        colCodigo:1,
        colTitulo:2,
        withTitulo:1,
        colCosto:3,
        iva:0,
        ivaIncluido:0,
        rentabilidad:0,
        isFinal:0,
        modificacion:0,
        modificacionAfecta:1,
        xlsxItems:[]
    });

    return (
        <>
            <aside className={styles.aside}>
                <InformationPanel products={(products)}/>
                <ConfigPanel config={config} setConfig={setConfig} vendors={vendors} products={products}/>
            </aside>
            <MatchTable products={products} config={config} token={token} vendors={vendors}/>
        </>
    )
}

export default Precios;