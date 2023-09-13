import { Config, XlsxProduct } from "@/types/Precios";

const serializeXlsxItems = (config:Config)=>{
    const {xlsxItems,colCodigo,colCosto,colTitulo} = config;
    
    return xlsxItems.reduce((acc,xlsxItem)=>{

        const codigo = xlsxItem[colCodigo-1]?xlsxItem[colCodigo-1].toString():false;
        const titulo = config.withTitulo?xlsxItem[colTitulo-1]:'';
        const costo = Number(xlsxItem[colCosto-1])??0;
        const newXlsxItem = {codigo,titulo,costo}

        if(codigo)
        acc[codigo]=newXlsxItem;
        return acc;
    },{} as Record<string,XlsxProduct>);
}

export {serializeXlsxItems};