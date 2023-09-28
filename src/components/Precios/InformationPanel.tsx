import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import { Products, SerializedProducts } from "@/types/Precios";
import { serializeArray } from "@/utils";
import { useEffect } from "react";

const InformationPanel:React.FC<{products:Products}> = ({products})=>{
    
    // update dolar :3
    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType):ACCOUNT_TYPE.main;
    
    
    const serializedProducts:SerializedProducts = {
        main:serializeArray(products.main,'Codigo'),
        secondary:serializeArray(products.secondary,'Codigo')
    };

    // useEffect(,[])

    return (
    <article className="box formBox">
        <h3>Informacion</h3>
        {accountType == ACCOUNT_TYPE.main?<span>Productos 764: {products.main.length?products.main.length:'cargando...'}</span>:''}
        <span>Productos 925: {products.secondary.length?products.secondary.length:'cargando...'}</span>
        <span>Variacion Dolar: </span>
        <div>
            <button>actualizar dolar</button>
        </div>
    </article>)
}

export {InformationPanel}