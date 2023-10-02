import { XlsxProduct } from ".";
import { Cotizacion } from "../cotizaciones";

interface Config{
    idProveedor:number,
    discriminar:number,
    colCodigo:number,
    colCosto:number,
    colTitulo:number,
    withTitulo:number,
    iva:number,
    ivaIncluido:number,
    rentabilidad:number,
    isFinal:number,
    modificacion:number,
    modificacionAfecta:number,
    xlsxItems:(string|number)[][],
    cotizacion:string;
    operacion:'precios'|'dolar'
}

export type {Config}
