import { ChangeEvent, MutableRefObject, RefObject } from "react";
import { letterToNumber } from "@/utils";
import { Config } from "@/types/Precios";

interface SetConfigChangeHandlerProps{
    refConfig:MutableRefObject<Config>;
    setDisabled:Function;
    xlsxWorker:MutableRefObject<Worker>;
    refSelectSheet:RefObject<HTMLSelectElement>;
}

const setConfigChangeHandler = ({refConfig,setDisabled,xlsxWorker,refSelectSheet}:SetConfigChangeHandlerProps)=>{
    const configChangeHandler = (event:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {name,value} = event.target;
        
        if (name in refConfig.current)
        (refConfig.current[name as keyof Omit<Config,'xlsxItems'>] as number) = (name == 'colCodigo' || name == 'colCosto' || name =='colTitulo')?letterToNumber(value):Number(value);
 
        if (name == 'file' && (event as ChangeEvent<HTMLInputElement>).target.files){
            setDisabled();
            xlsxWorker.current.postMessage({task:'read',attach:((event as ChangeEvent<HTMLInputElement>).target.files as FileList)[0]});
            (refSelectSheet.current as HTMLSelectElement).value = 'none';
            refConfig.current.xlsxItems = [];
        }
    }
    return {configChangeHandler};
}

export {setConfigChangeHandler};

