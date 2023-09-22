import { Config, MatchItems, SerializedProducts, SerializedXlsxItems, Warnings } from "@/types/Precios";
import { MutableRefObject } from "react";
import { compareTitles } from ".";

interface InitializeWaeningsProps{
    matchItems:MatchItems;
    serializedXlsxItems:MutableRefObject<SerializedXlsxItems>;
    serializedProducts:SerializedProducts
    config:Config;
}
const initializeWarnings = ({matchItems,serializedXlsxItems,serializedProducts,config}:InitializeWaeningsProps)=>{
    const newWarningsCount={main:{title:0,price:0},secondary:{title:0,price:0}};
    const newWarnings:Warnings= [];
    Object.entries(matchItems).forEach(([table,tableMatchItems])=>{
        return tableMatchItems.forEach(({codigo,descripcion,final})=>{
            const newWarning = {codigo,title:false,price:false,table:table as 'main'|'secondary'}
            const {Nombre:cbTitle,PrecioFinal} = serializedProducts[(table as 'main'|'secondary')][codigo];
            const xlsxTitle = serializedXlsxItems.current[descripcion]?serializedXlsxItems.current[descripcion].titulo??'':'';  
            
            const comparePrices = Math.abs((PrecioFinal/final)-1)>0.3;
        
            if (config.withTitulo && compareTitles({xlsxTitle,cbTitle}).rate<0.4) {
                newWarning.title = true;
                newWarningsCount[(table as 'main'|'secondary')].title += 1;
            } else {
                newWarning.title = false;
            }
        
            if (comparePrices) {
                newWarning.price = true;
                newWarningsCount[(table as 'main'|'secondary')].price += 1;

            } else {
                newWarning.price = false;
            }
        
            newWarnings.push(newWarning);
        }) 
    })
    return {newWarnings,newWarningsCount};
}

export {initializeWarnings};