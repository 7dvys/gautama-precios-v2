import { Config, XlsxProduct } from "@/types/Precios";

const serializeXlsxItems = (config:Config)=>{
    const {xlsxItems,colCodigo,colCosto,colTitulo} = config;
    
    return xlsxItems.reduce((acc,xlsxItem)=>{
        const codigo = xlsxItem[colCodigo-1].toString();

        const titulo = config.tieneTitulo?xlsxItem[colTitulo-1]:'';
        const costo = Number(xlsxItem[colCosto-1]);

        const newXlsxItem = {codigo,titulo,costo}
        acc[codigo]=newXlsxItem;
        return acc;
    },{} as Record<string,XlsxProduct>);
}

export {serializeXlsxItems};