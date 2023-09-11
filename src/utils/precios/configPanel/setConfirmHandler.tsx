import { Config } from "@/types/Precios";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

interface SetConfirmHandlerProps{
    refConfig:MutableRefObject<Config>
    config:Config;
    setConfig:Dispatch<SetStateAction<Config>>;
}

const setConfirmHandler = ({refConfig,setConfig,config}:SetConfirmHandlerProps)=>{
    const confirmHandler = ()=>{
        let error = '';
        if(!refConfig.current.xlsxItems.length)
        error += '[!] Tu hoja no tiene items: coloca una hoja valida.\n\n';

        if(!refConfig.current.idProveedor)
        error += '[!] Coloca un proveedor.';

        if(!error)
        setConfig({...config,...refConfig.current});
        else alert(error);
    }
    return {confirmHandler};
}

export {setConfirmHandler}