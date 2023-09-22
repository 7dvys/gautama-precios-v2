import { Config, MatchItem } from "../Precios";
import { Product } from "../contabilium";

interface DetallesPrecios{
    matchItems:{main:MatchItem[],secondary:MatchItem[]};
    config:Config;
    products:{main:Product[],secondary:Product[]};
}

interface Movement{
    id?:number;
    vendorId:number;
    vendorName:string;
    fuente:'precios'|'imap'|'pedidos';
    detalles:DetallesPrecios;
    fecha:Date;
}

export type {Movement};