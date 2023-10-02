import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import { Config, Products, SerializedProducts } from "@/types/Precios";
import { serializeArray } from "@/utils";
import { Dispatch, SetStateAction, useEffect } from "react";

const InformationPanel:React.FC<{products:Products,config:Config,setConfig:Dispatch<SetStateAction<Config>>}> = ({products,config,setConfig})=>{
    
    // update dolar :3
    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType):ACCOUNT_TYPE.main;
    const dolaresHandler = ()=>{

        setConfig(oldConfig=>{
            const config = {...oldConfig,operacion:'dolar',withTitulo:0} as Config;
            return config;
        })
    }
    return (
    <article className="box formBox">
        <h3>Informacion</h3>
        {accountType == ACCOUNT_TYPE.main?<span>Productos 764: {products.main.length?products.main.length:'cargando...'}</span>:''}
        <span>Productos 925: {products.secondary.length?products.secondary.length:'cargando...'}</span>
        <button onClick={dolaresHandler}>actualizar dolares</button>
    </article>)
}

export {InformationPanel}